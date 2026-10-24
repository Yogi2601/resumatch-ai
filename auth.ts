import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  createUser,
  findUserByUsernameOrEmail,
  findUserById,
  updateLastLogin,
  isUsernameTaken,
  isEmailTaken,
  saveAnalysis,
  getUserAnalyses,
  deleteUserAnalysis,
  clearUserAnalyses,
  getAllUsersAdmin,
  getPlatformMetricsAdmin,
  updateUserRoleAdmin,
  deleteUserAdmin,
  UserRecord,
} from './db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'resumatch-ai-jwt-production-secret-key-2026';
const TOKEN_EXPIRY = '7d';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    fullName: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
  };
}

// Generate JWT token
export function generateToken(user: UserRecord): string {
  return jwt.sign(
    {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

// Sanitize user for public/client responses
export function sanitizeUser(user: UserRecord) {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
}

// Authentication Middleware: verifies Bearer token
export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      fullName: decoded.fullName,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }
}

// Optional Auth Middleware: attaches user if token is valid, but does not block if not
export function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = {
        id: decoded.id,
        fullName: decoded.fullName,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (e) {
      // ignore
    }
  }
  next();
}

// Admin-Only Authorization Middleware
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied: You do not have administrator permissions to access this resource.',
    });
  }

  next();
}

// Registration Handler
export async function handleSignup(req: Request, res: Response) {
  try {
    const { fullName, username, email, password, confirmPassword } = req.body;

    // 1. Validation checks
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your valid full name (minimum 2 characters).' });
    }

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required.' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const usernameRegex = /^[a-zA-Z0-9_]{3,25}$/;
    if (!usernameRegex.test(cleanUsername)) {
      return res.status(400).json({
        error: 'Username must be between 3 and 25 characters and contain only letters, numbers, and underscores.',
      });
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please provide a valid personal email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Password confirmation does not match the password.' });
    }

    // 2. Check Uniqueness
    if (isUsernameTaken(cleanUsername)) {
      return res.status(409).json({ error: `Username "${cleanUsername}" is already taken. Please choose another.` });
    }

    if (isEmailTaken(cleanEmail)) {
      return res.status(409).json({ error: `An account with email "${cleanEmail}" is already registered. Please sign in.` });
    }

    // 3. Create User (Role is strictly forced to 'user' in db.ts)
    const newUser = await createUser({
      fullName,
      username: cleanUsername,
      email: cleanEmail,
      password,
    });

    const token = generateToken(newUser);
    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: sanitizeUser(newUser),
    });
  } catch (err: any) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error during registration.' });
  }
}

// Login Handler: Supports Username OR Email
export async function handleLogin(req: Request, res: Response) {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Please provide your username or email address and password.' });
    }

    // Lookup by username OR email (case-insensitive)
    const user = findUserByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. No account found with that username or email.' });
    }

    // Verify hashed password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Incorrect password.' });
    }

    // Record last login
    updateLastLogin(user.id);

    const token = generateToken(user);
    return res.json({
      message: 'Login successful!',
      token,
      user: sanitizeUser(user),
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error during login.' });
  }
}

// Get current logged-in user profile
export function handleGetMe(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  return res.json({ user: sanitizeUser(user) });
}

// User-Isolated History Handlers
export function handleGetUserAnalyses(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
  const analyses = getUserAnalyses(req.user.id);
  return res.json({ analyses });
}

export function handleSaveUserAnalysis(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
  const { analysis, jobTitle, companyName } = req.body;
  if (!analysis) return res.status(400).json({ error: 'Analysis data is required.' });

  const record = saveAnalysis(req.user.id, analysis, jobTitle, companyName);
  return res.status(201).json({ record });
}

export function handleDeleteUserAnalysis(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
  const { id } = req.params;
  const deleted = deleteUserAnalysis(req.user.id, id);
  if (!deleted) return res.status(404).json({ error: 'Report not found or not authorized to delete.' });
  return res.json({ message: 'Report deleted successfully.' });
}

export function handleClearUserAnalyses(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
  clearUserAnalyses(req.user.id);
  return res.json({ message: 'All your history reports have been cleared.' });
}

// Admin-Only Handlers
export function handleGetAdminOverview(req: AuthenticatedRequest, res: Response) {
  const metrics = getPlatformMetricsAdmin();
  const users = getAllUsersAdmin();
  return res.json({ metrics, users });
}

export function handleAdminUpdateRole(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { role } = req.body;
  if (role !== 'user' && role !== 'admin') {
    return res.status(400).json({ error: 'Invalid role specified.' });
  }

  const success = updateUserRoleAdmin(id, role);
  if (!success) return res.status(404).json({ error: 'Target user not found.' });
  return res.json({ message: `User role updated to "${role}".` });
}

export function handleAdminDeleteUser(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  try {
    const success = deleteUserAdmin(id);
    if (!success) return res.status(404).json({ error: 'User not found.' });
    return res.json({ message: 'User deleted from platform.' });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
