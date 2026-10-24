import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface UserRecord {
  id: string;
  fullName: string;
  username: string; // Normalized lowercase
  email: string; // Normalized lowercase
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserAnalysisRecord {
  id: string;
  userId: string;
  jobTitle: string;
  companyName: string;
  overallScore: number;
  verdict: string;
  analysis: any;
  createdAt: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  analyses: UserAnalysisRecord[];
}

// In-memory cache for fast sync writes
let dbCache: DatabaseSchema = {
  users: [],
  analyses: [],
};

// Ensure directory and load DB
export function initDb(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(raw);
      if (!Array.isArray(dbCache.users)) dbCache.users = [];
      if (!Array.isArray(dbCache.analyses)) dbCache.analyses = [];
    } catch (err) {
      console.error('Failed to parse database.json, reinitializing cache:', err);
      dbCache = { users: [], analyses: [] };
    }
  } else {
    dbCache = { users: [], analyses: [] };
    persistDb();
  }

  // Pre-seed Administrator Account if not present
  // Note: Ordinary users cannot sign up as admin; this is seeded server-side
  const adminEmail = (process.env.ADMIN_EMAIL || 'yogeshwarisalunkhe2003@gmail.com').toLowerCase();
  const existingAdmin = dbCache.users.find(
    (u) => u.role === 'admin' || u.email === adminEmail || u.username === 'admin'
  );

  if (!existingAdmin) {
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@ResuMatch2026!';
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(adminPassword, salt);

    const adminUser: UserRecord = {
      id: 'admin-master-001',
      fullName: 'Yogeshwari Salunkhe (Administrator)',
      username: 'admin',
      email: adminEmail,
      passwordHash,
      role: 'admin',
      createdAt: new Date().toISOString(),
    };

    dbCache.users.push(adminUser);
    persistDb();
    console.log(`[Auth DB] Seeded server-side Admin account: username="admin", email="${adminEmail}"`);
  }
}

function persistDb(): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error persisting database:', err);
  }
}

// User Operations
export function findUserByUsernameOrEmail(identifier: string): UserRecord | undefined {
  if (!identifier) return undefined;
  const clean = identifier.trim().toLowerCase();
  return dbCache.users.find((u) => u.username === clean || u.email === clean);
}

export function findUserById(id: string): UserRecord | undefined {
  return dbCache.users.find((u) => u.id === id);
}

export function isUsernameTaken(username: string): boolean {
  const clean = username.trim().toLowerCase();
  return dbCache.users.some((u) => u.username === clean);
}

export function isEmailTaken(email: string): boolean {
  const clean = email.trim().toLowerCase();
  return dbCache.users.some((u) => u.email === clean);
}

export interface CreateUserInput {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export async function createUser(input: CreateUserInput): Promise<UserRecord> {
  const cleanUsername = input.username.trim().toLowerCase();
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanFullName = input.fullName.trim();

  if (isUsernameTaken(cleanUsername)) {
    throw new Error('This username is already taken. Please choose another.');
  }

  if (isEmailTaken(cleanEmail)) {
    throw new Error('An account with this email address already exists.');
  }

  // Hash password securely with bcrypt
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(input.password, salt);

  // CRITICAL REQUIREMENT 6: Never allow users to select or assign their own admin role during signup.
  // Ordinary signup ALWAYS sets role = 'user'.
  const newUser: UserRecord = {
    id: 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
    fullName: cleanFullName,
    username: cleanUsername,
    email: cleanEmail,
    passwordHash,
    role: 'user', // strictly user
    createdAt: new Date().toISOString(),
  };

  dbCache.users.push(newUser);
  persistDb();
  return newUser;
}

export function updateLastLogin(userId: string): void {
  const user = dbCache.users.find((u) => u.id === userId);
  if (user) {
    user.lastLoginAt = new Date().toISOString();
    persistDb();
  }
}

// User-Isolated Analyses & History Operations
export function saveAnalysis(userId: string, analysisData: any, jobTitle: string, companyName: string): UserAnalysisRecord {
  const record: UserAnalysisRecord = {
    id: 'analysis-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    userId,
    jobTitle: jobTitle || 'Target Role',
    companyName: companyName || 'Company',
    overallScore: analysisData.overallScore || 0,
    verdict: analysisData.verdict || 'Evaluated',
    analysis: analysisData,
    createdAt: new Date().toISOString(),
  };

  dbCache.analyses.unshift(record);
  // Cap at 100 recent per user to save disk space
  const userAnalyses = dbCache.analyses.filter((a) => a.userId === userId);
  if (userAnalyses.length > 50) {
    const oldestToRemove = userAnalyses.slice(50);
    dbCache.analyses = dbCache.analyses.filter((a) => !oldestToRemove.includes(a));
  }

  persistDb();
  return record;
}

export function getUserAnalyses(userId: string): UserAnalysisRecord[] {
  // CRITICAL REQUIREMENT 5: Users must only access their own resume reports and history
  return dbCache.analyses.filter((a) => a.userId === userId);
}

export function deleteUserAnalysis(userId: string, analysisId: string): boolean {
  const initialLength = dbCache.analyses.length;
  dbCache.analyses = dbCache.analyses.filter((a) => !(a.id === analysisId && a.userId === userId));
  const changed = dbCache.analyses.length !== initialLength;
  if (changed) persistDb();
  return changed;
}

export function clearUserAnalyses(userId: string): void {
  dbCache.analyses = dbCache.analyses.filter((a) => a.userId !== userId);
  persistDb();
}

// Admin-Only Operations
export function getAllUsersAdmin(): Array<Omit<UserRecord, 'passwordHash'> & { scansCount: number }> {
  return dbCache.users.map((u) => {
    const scansCount = dbCache.analyses.filter((a) => a.userId === u.id).length;
    const { passwordHash, ...safeUser } = u;
    return { ...safeUser, scansCount };
  });
}

export function getPlatformMetricsAdmin() {
  const totalUsers = dbCache.users.length;
  const totalScans = dbCache.analyses.length;
  const adminUsers = dbCache.users.filter((u) => u.role === 'admin').length;
  
  let averageScore = 0;
  if (totalScans > 0) {
    const sum = dbCache.analyses.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
    averageScore = Math.round(sum / totalScans);
  }

  const recentScans = dbCache.analyses.slice(0, 15).map((a) => {
    const user = dbCache.users.find((u) => u.id === a.userId);
    return {
      id: a.id,
      userName: user ? user.fullName : 'Unknown User',
      username: user ? user.username : 'unknown',
      jobTitle: a.jobTitle,
      companyName: a.companyName,
      overallScore: a.overallScore,
      verdict: a.verdict,
      createdAt: a.createdAt,
    };
  });

  return {
    totalUsers,
    totalScans,
    adminUsers,
    averageScore,
    recentScans,
  };
}

export function updateUserRoleAdmin(targetUserId: string, newRole: 'user' | 'admin'): boolean {
  const user = dbCache.users.find((u) => u.id === targetUserId);
  if (user) {
    user.role = newRole;
    persistDb();
    return true;
  }
  return false;
}

export function deleteUserAdmin(targetUserId: string): boolean {
  const target = dbCache.users.find((u) => u.id === targetUserId);
  if (!target) return false;
  // Prevent deleting the last master admin
  if (target.role === 'admin' && dbCache.users.filter((u) => u.role === 'admin').length <= 1) {
    throw new Error('Cannot delete the sole master administrator account.');
  }
  dbCache.users = dbCache.users.filter((u) => u.id !== targetUserId);
  dbCache.analyses = dbCache.analyses.filter((a) => a.userId !== targetUserId);
  persistDb();
  return true;
}
