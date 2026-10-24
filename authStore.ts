import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data Models
export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'user' | 'admin';
  createdAt: number;
  lastLoginAt: number;
  failedAttempts: number;
  lockoutUntil?: number;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: number;
  createdAt: number;
  ip?: string;
  userAgent?: string;
}

export interface UserReport {
  id: string;
  userId: string;
  timestamp: number;
  jobTitle: string;
  companyName: string;
  overallScore: number;
  verdict: string;
  summary: string;
  reportData: any;
}

interface DatabaseSchema {
  users: User[];
  sessions: Session[];
  reports: UserReport[];
}

// Storage setup
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Admin configuration: requires exact email and secret verification key
export const PRIMARY_ADMIN_EMAIL = 'yogeshwarisalunkhe2003@gmail.com';
export const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'ResuMatch-Admin-2026-SecureKey';

// Atomic file-backed persistence with in-memory cache
class AuthStore {
  private db: DatabaseSchema = {
    users: [],
    sessions: [],
    reports: [],
  };

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.db = JSON.parse(raw);
        if (!this.db.users) this.db.users = [];
        if (!this.db.sessions) this.db.sessions = [];
        if (!this.db.reports) this.db.reports = [];
      } else {
        this.saveToDisk();
      }
    } catch (err) {
      console.error('Error reading db.json, initializing fresh store:', err);
      this.db = { users: [], sessions: [], reports: [] };
      this.saveToDisk();
    }
  }

  private saveToDisk() {
    try {
      // Atomic write pattern: write to tmp file then rename
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(this.db, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error saving db to disk:', err);
    }
  }

  // Password Hashing with Scrypt and 16-byte random salt
  public hashPassword(password: string): { hash: string; salt: string } {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return { hash, salt };
  }

  public verifyPassword(password: string, salt: string, storedHash: string): boolean {
    try {
      const derivedHash = crypto.scryptSync(password, salt, 64).toString('hex');
      const bufA = Buffer.from(derivedHash, 'hex');
      const bufB = Buffer.from(storedHash, 'hex');
      if (bufA.length !== bufB.length) return false;
      return crypto.timingSafeEqual(bufA, bufB);
    } catch (e) {
      return false;
    }
  }

  // Find User by Email (case-insensitive)
  public getUserByEmail(email: string): User | undefined {
    const normalized = email.trim().toLowerCase();
    return this.db.users.find((u) => u.email.toLowerCase() === normalized);
  }

  public getUserById(id: string): User | undefined {
    return this.db.users.find((u) => u.id === id);
  }

  // Register User
  public registerUser(
    fullName: string,
    email: string,
    password: string,
    providedAdminSecret?: string
  ): { user: Omit<User, 'passwordHash' | 'salt'>; error?: string } {
    const normalizedEmail = email.trim().toLowerCase();

    if (this.getUserByEmail(normalizedEmail)) {
      return { user: null as any, error: 'An account with this email address already exists.' };
    }

    if (password.length < 8) {
      return { user: null as any, error: 'Password must be at least 8 characters long.' };
    }

    // Role verification: user can only become admin if they match PRIMARY_ADMIN_EMAIL AND provide the exact ADMIN_SECRET_KEY
    let role: 'user' | 'admin' = 'user';
    if (
      normalizedEmail === PRIMARY_ADMIN_EMAIL.toLowerCase() &&
      providedAdminSecret &&
      providedAdminSecret === ADMIN_SECRET_KEY
    ) {
      role = 'admin';
    }

    const { hash, salt } = this.hashPassword(password);
    const newUser: User = {
      id: 'usr_' + crypto.randomBytes(12).toString('hex'),
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash: hash,
      salt,
      role,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
      failedAttempts: 0,
    };

    this.db.users.push(newUser);
    this.saveToDisk();

    const { passwordHash: _, salt: __, ...safeUser } = newUser;
    return { user: safeUser };
  }

  // Verify Admin Key for Existing Account (elevation after verification)
  public promoteToAdminWithSecret(userId: string, secretKey: string): { success: boolean; error?: string } {
    const user = this.getUserById(userId);
    if (!user) return { success: false, error: 'User not found.' };

    if (user.email.toLowerCase() !== PRIMARY_ADMIN_EMAIL.toLowerCase()) {
      return {
        success: false,
        error: `Only the verified application owner (${PRIMARY_ADMIN_EMAIL}) can claim administrator privileges.`,
      };
    }

    if (!secretKey || secretKey !== ADMIN_SECRET_KEY) {
      return {
        success: false,
        error: 'Invalid Administrator Verification Key. Access denied.',
      };
    }

    user.role = 'admin';
    this.saveToDisk();
    return { success: true };
  }

  // Handle Login with Rate Limiting & Lockout
  public loginUser(
    email: string,
    password: string,
    ip?: string,
    userAgent?: string
  ): { session?: Session; user?: Omit<User, 'passwordHash' | 'salt'>; error?: string } {
    const user = this.getUserByEmail(email);
    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    // Check Lockout
    if (user.lockoutUntil && user.lockoutUntil > Date.now()) {
      const waitMinutes = Math.ceil((user.lockoutUntil - Date.now()) / 60000);
      return { error: `Account temporarily locked due to failed attempts. Try again in ${waitMinutes} minute(s).` };
    }

    const isMatch = this.verifyPassword(password, user.salt, user.passwordHash);
    if (!isMatch) {
      user.failedAttempts = (user.failedAttempts || 0) + 1;
      if (user.failedAttempts >= 5) {
        user.lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 min lockout
        this.saveToDisk();
        return { error: 'Too many failed login attempts. Account locked for 15 minutes.' };
      }
      this.saveToDisk();
      return { error: 'Invalid email or password.' };
    }

    // Reset failed attempts on success
    user.failedAttempts = 0;
    user.lockoutUntil = undefined;
    user.lastLoginAt = Date.now();

    // Create 256-bit crypto session token (7-day duration)
    const token = crypto.randomBytes(32).toString('hex');
    const session: Session = {
      id: 'ses_' + crypto.randomBytes(12).toString('hex'),
      userId: user.id,
      token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      createdAt: Date.now(),
      ip,
      userAgent,
    };

    // Remove expired sessions
    this.db.sessions = this.db.sessions.filter((s) => s.expiresAt > Date.now());
    this.db.sessions.push(session);
    this.saveToDisk();

    const { passwordHash: _, salt: __, ...safeUser } = user;
    return { session, user: safeUser };
  }

  // Validate Active Session
  public validateSession(token: string): { user?: Omit<User, 'passwordHash' | 'salt'>; session?: Session } {
    if (!token) return {};

    const session = this.db.sessions.find((s) => s.token === token && s.expiresAt > Date.now());
    if (!session) return {};

    const user = this.getUserById(session.userId);
    if (!user) return {};

    const { passwordHash: _, salt: __, ...safeUser } = user;
    return { user: safeUser, session };
  }

  // Revoke Session (Logout)
  public revokeSession(token: string): boolean {
    const initialLen = this.db.sessions.length;
    this.db.sessions = this.db.sessions.filter((s) => s.token !== token);
    const changed = this.db.sessions.length !== initialLen;
    if (changed) this.saveToDisk();
    return changed;
  }

  // --- User Report Isolation ---
  public saveUserReport(
    userId: string,
    reportData: {
      jobTitle: string;
      companyName: string;
      overallScore: number;
      verdict: string;
      summary: string;
      result: any;
    }
  ): UserReport {
    const report: UserReport = {
      id: 'rep_' + Date.now() + '_' + crypto.randomBytes(6).toString('hex'),
      userId,
      timestamp: Date.now(),
      jobTitle: reportData.jobTitle || 'Target Role',
      companyName: reportData.companyName || 'Company',
      overallScore: reportData.overallScore || 0,
      verdict: reportData.verdict || 'Scored',
      summary: reportData.summary || '',
      reportData: reportData.result,
    };

    this.db.reports.unshift(report);
    this.saveToDisk();
    return report;
  }

  public getUserReports(userId: string): UserReport[] {
    return this.db.reports.filter((r) => r.userId === userId);
  }

  public deleteUserReport(userId: string, reportId: string): boolean {
    const idx = this.db.reports.findIndex((r) => r.id === reportId && r.userId === userId);
    if (idx === -1) return false;
    this.db.reports.splice(idx, 1);
    this.saveToDisk();
    return true;
  }

  // --- Admin Queries (Protected) ---
  public getAdminStats() {
    const totalUsers = this.db.users.length;
    const totalReports = this.db.reports.length;
    const activeSessions = this.db.sessions.filter((s) => s.expiresAt > Date.now()).length;

    const averageScore =
      totalReports > 0
        ? Math.round(this.db.reports.reduce((acc, r) => acc + (r.overallScore || 0), 0) / totalReports)
        : 0;

    return {
      totalUsers,
      totalReports,
      activeSessions,
      averageScore,
    };
  }

  public getAdminUsersList() {
    return this.db.users.map((u) => {
      const reportCount = this.db.reports.filter((r) => r.userId === u.id).length;
      return {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        reportCount,
      };
    });
  }

  public getAdminRecentReports(limit = 20) {
    return this.db.reports.slice(0, limit).map((r) => {
      const user = this.getUserById(r.userId);
      return {
        id: r.id,
        userId: r.userId,
        userName: user?.fullName || 'User',
        userEmail: user?.email || 'unknown',
        timestamp: r.timestamp,
        jobTitle: r.jobTitle,
        companyName: r.companyName,
        overallScore: r.overallScore,
        verdict: r.verdict,
      };
    });
  }
}

export const authStore = new AuthStore();
