import crypto from 'crypto';
import express from 'express';
import type { UserProfile, JobListing, AppSettings, WorkflowState } from '../src/types.js';
import { INITIAL_PROFILE, INITIAL_JOBS, INITIAL_SETTINGS } from './seedData.js';
import { computeSafeJobId, normalizeJobUrl } from './jobSearch.js';

export interface UserAccountRecord {
  id: string;
  email: string;
  full_name: string;
  password_hash: string;
  salt: string;
  created_at: string;
  last_login_at: string;
  avatar_url?: string;
  telegram_chat_id?: string;
}

export interface UserSessionRecord {
  token: string;
  user_id: string;
  created_at: string;
  expires_at: string;
  user_agent?: string;
}

export interface UserPartitionData {
  currentProfile: UserProfile;
  jobListings: JobListing[];
  notifiedJobIds: string[];
  deletedJobIds: string[];
  seenJobs: Record<string, string>;
  searchedRegistry: Record<string, any>;
  appSettings: AppSettings & { serpapi_key?: string };
  workflowState: WorkflowState;
  lastUpdated: string;
}

export const SESSION_COOKIE_NAME = 'careerops_session';
export const SESSION_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000; // 90 days device persistence (like Facebook/Google)
export const PRIMARY_USER_ID = 'usr_kb270102';
export const DEMO_USER_ID = 'usr_demo';

export const users: Record<string, UserAccountRecord> = {};
export const userEmailIndex: Record<string, string> = {}; // lowercase email -> user_id
export const sessions: Record<string, UserSessionRecord> = {}; // token -> session
export const userPartitions: Record<string, UserPartitionData> = {}; // user_id -> partition

export interface PasswordResetRecord {
  email: string;
  code: string;
  created_at: string;
  expires_at: string;
}

export const passwordResetCodes: Record<string, PasswordResetRecord> = {};

export function createPasswordResetCode(email: string): string {
  const cleanEmail = email.toLowerCase().trim();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const now = Date.now();
  passwordResetCodes[cleanEmail] = {
    email: cleanEmail,
    code,
    created_at: new Date(now).toISOString(),
    expires_at: new Date(now + 15 * 60 * 1000).toISOString(), // 15 mins
  };
  return code;
}

export function verifyAndResetPassword(
  email: string,
  code: string,
  newPassword: string
): { success: boolean; error?: string; user?: UserAccountRecord } {
  const cleanEmail = email.toLowerCase().trim();
  const record = passwordResetCodes[cleanEmail];
  if (!record) {
    return { success: false, error: 'No active password reset request found for this email. Please request a new code.' };
  }

  if (new Date(record.expires_at).getTime() < Date.now()) {
    delete passwordResetCodes[cleanEmail];
    return { success: false, error: 'The verification code has expired. Please request a new one.' };
  }

  if (record.code.trim() !== code.trim()) {
    return { success: false, error: 'Incorrect verification code. Please check and try again.' };
  }

  const userId = userEmailIndex[cleanEmail];
  if (!userId || !users[userId]) {
    return { success: false, error: 'User account not found.' };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' };
  }

  const { hash, salt } = hashPassword(newPassword);
  users[userId].password_hash = hash;
  users[userId].salt = salt;
  users[userId].last_login_at = new Date().toISOString();

  // Invalidate any existing sessions for security
  for (const [token, sess] of Object.entries(sessions)) {
    if (sess.user_id === userId) {
      delete sessions[token];
    }
  }

  delete passwordResetCodes[cleanEmail];
  return { success: true, user: users[userId] };
}

export function hashPassword(password: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const derived = crypto.scryptSync(password, salt, 64).toString('hex');
    const a = Buffer.from(derived, 'hex');
    const b = Buffer.from(storedHash, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function getCanonicalNextRun(intervalHours = 4): string {
  const now = Date.now();
  const intervalMs = (intervalHours || 4) * 3600 * 1000;
  const nextTimestamp = Math.ceil((now + 1000) / intervalMs) * intervalMs;
  return new Date(nextTimestamp).toISOString();
}

export interface InitialCareerPreferences {
  target_roles?: string[];
  salary_expectation?: { min_lpa: number; max_lpa: number };
  preferred_locations?: string[];
  total_years_experience?: number;
  seniority_tier?: string;
  skills?: string[];
  headline?: string;
}

/**
 * Creates a clean isolated partition for a new user with fresh profile and sample ATS listings
 */
export function createDefaultPartitionForUser(
  user?: Partial<UserAccountRecord>,
  preferences?: InitialCareerPreferences
): UserPartitionData {
  const chosenRoles = preferences?.target_roles?.length
    ? preferences.target_roles
    : ['Software Engineer', 'Full Stack Developer', 'Data Analyst', 'Solutions Architect'];

  const chosenLocations = preferences?.preferred_locations?.length
    ? preferences.preferred_locations
    : ['Remote', 'Bengaluru', 'Delhi NCR', 'Hybrid'];

  const chosenSalary = preferences?.salary_expectation || { min_lpa: 12, max_lpa: 25 };
  const chosenExp = preferences?.total_years_experience !== undefined ? preferences.total_years_experience : 2.5;
  const chosenTier = preferences?.seniority_tier || (chosenExp >= 5 ? 'Senior' : chosenExp >= 2 ? 'Mid' : 'Entry');

  const userProfile: UserProfile = {
    full_name: user?.full_name || 'Candidate',
    contact: {
      email: user?.email || '',
      phone: '',
      location: chosenLocations[0] || 'Remote',
      links: '',
    },
    total_years_experience: chosenExp,
    seniority_tier: chosenTier,
    education: [
      {
        institution: 'University / Institute',
        degree: 'Bachelor of Science / Technology',
        details: 'Engineering / Computer Science',
        dates: '2020 – 2024',
      },
    ],
    experience: [],
    skills: preferences?.skills?.length
      ? preferences.skills
      : ['Python', 'SQL', 'TypeScript', 'React', 'Node.js', 'System Design'],
    certifications: [],
    target_roles: chosenRoles,
    anti_targets: ['Telemarketing', 'Cold Calling Sales', 'Unpaid Internships'],
    preferred_locations: chosenLocations,
    salary_expectation: chosenSalary,
  };

  const defaultChatId = user?.telegram_chat_id || (user?.id === PRIMARY_USER_ID ? (process.env.TELEGRAM_CHAT_ID || '1368681854') : '');
  const defaultBotToken = process.env.TELEGRAM_BOT_TOKEN || '8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas';
  const hasTelegram = Boolean(defaultChatId);

  const partitionSettings: AppSettings & { serpapi_key?: string } = {
    min_match_score: 75,
    telegram_configured: hasTelegram,
    telegram_chat_id: defaultChatId,
    telegram_bot_token: defaultBotToken,
    telegram_bot_name: 'CareerOps Bot',
    telegram_custom_header: `🎯 ${user?.full_name || 'CareerOps'} High-Fit Role!`,
    telegram_include_salary: true,
    telegram_include_skill_gap: true,
    telegram_include_apply_link: true,
    seen_ttl_days: 14,
    workflow_enabled: true,
    workflow_interval_hours: 4,
    auto_notify_telegram: hasTelegram,
  };

  const partitionWorkflow: WorkflowState = {
    enabled: true,
    interval_hours: 4,
    last_run: null,
    next_run: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    is_running: false,
    total_runs: 0,
    auto_notify_telegram: hasTelegram,
    runs: [],
  };

  // Ensure every registered candidate gets the rich catalog of viable jobs matched to tech/automation
  const activeSeedJobs = (userPartitions[PRIMARY_USER_ID]?.jobListings && userPartitions[PRIMARY_USER_ID].jobListings.length > 0)
    ? userPartitions[PRIMARY_USER_ID].jobListings.map((j) => ({
        ...j,
        id: j.id,
        status: (j.status || 'discovered') as any,
      }))
    : INITIAL_JOBS.slice(0, 8).map((j, idx) => ({
        ...j,
        id: computeSafeJobId(j.title, `${j.company_name}_${user?.id || 'sample'}_${idx}`),
        status: (idx === 0 ? 'discovered' : idx === 1 ? 'notified' : 'discovered') as any,
      }));

  const sampleJobs = activeSeedJobs;

  const partitionRegistry: Record<string, any> = {};
  for (const j of sampleJobs) {
    const sig = `${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`;
    const normLink = normalizeJobUrl(j.apply_link);
    partitionRegistry[j.id] = {
      id: j.id,
      signature: sig,
      normalized_url: normLink,
      company_name: j.company_name,
      title: j.title,
      status: j.status || 'discovered',
      discovered_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
    };
  }

  return {
    currentProfile: userProfile,
    jobListings: sampleJobs,
    notifiedJobIds: [],
    deletedJobIds: [],
    seenJobs: {},
    searchedRegistry: partitionRegistry,
    appSettings: partitionSettings,
    workflowState: partitionWorkflow,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Initializes built-in default accounts:
 * 1. Primary user: Kartik Bhatt (kb270102@gmail.com)
 * 2. Demo candidate user: Demo User (demo@careerops.ai)
 */
export function seedDefaultUsers() {
  if (!users[PRIMARY_USER_ID]) {
    const { hash, salt } = hashPassword('careerops123');
    const primaryAccount: UserAccountRecord = {
      id: PRIMARY_USER_ID,
      email: 'kb270102@gmail.com',
      full_name: 'Kartik Bhatt',
      password_hash: hash,
      salt,
      created_at: '2026-01-01T00:00:00.000Z',
      last_login_at: new Date().toISOString(),
      telegram_chat_id: process.env.TELEGRAM_CHAT_ID || '1368681854',
    };
    users[PRIMARY_USER_ID] = primaryAccount;
    userEmailIndex['kb270102@gmail.com'] = PRIMARY_USER_ID;
  }

  if (!users[DEMO_USER_ID]) {
    const { hash, salt } = hashPassword('demo123');
    const demoAccount: UserAccountRecord = {
      id: DEMO_USER_ID,
      email: 'demo@careerops.ai',
      full_name: 'Demo Candidate',
      password_hash: hash,
      salt,
      created_at: '2026-01-01T00:00:00.000Z',
      last_login_at: new Date().toISOString(),
      telegram_chat_id: '1368681854',
    };
    users[DEMO_USER_ID] = demoAccount;
    userEmailIndex['demo@careerops.ai'] = DEMO_USER_ID;
  }
}

seedDefaultUsers();

/**
 * Resolves the authenticated user from cookies, Bearer header, or auth query parameter
 */
export function resolveAuthUser(req: express.Request): UserAccountRecord | null {
  let token: string | undefined = req.cookies?.[SESSION_COOKIE_NAME];

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      token = parts[1];
    }
  }

  if (!token && typeof req.query.auth_token === 'string') {
    token = req.query.auth_token;
  }

  if (!token) return null;

  const session = sessions[token];
  if (!session) return null;

  if (new Date(session.expires_at).getTime() < Date.now()) {
    delete sessions[token];
    return null;
  }

  return users[session.user_id] || null;
}

/**
 * Retrieves or lazily creates a data partition for a given user ID
 */
export function getUserPartition(userId: string, initialPreferences?: InitialCareerPreferences): UserPartitionData {
  if (!userPartitions[userId]) {
    userPartitions[userId] = createDefaultPartitionForUser(users[userId], initialPreferences);
  }
  return userPartitions[userId];
}

/**
 * Retrieves all registered user partitions currently loaded in memory
 */
export function getAllUserPartitions(): Array<{ userId: string; user?: UserAccountRecord; partition: UserPartitionData }> {
  const list: Array<{ userId: string; user?: UserAccountRecord; partition: UserPartitionData }> = [];
  for (const [userId, partition] of Object.entries(userPartitions)) {
    if (partition) {
      list.push({ userId, user: users[userId], partition });
    }
  }
  return list;
}

/**
 * Creates a persistent session for a user and registers it
 */
export function createSessionForUser(userId: string, userAgent?: string): string {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS).toISOString();
  sessions[token] = {
    token,
    user_id: userId,
    created_at: new Date().toISOString(),
    expires_at: expiresAt,
    user_agent: userAgent,
  };
  return token;
}

/**
 * Sets the persistent cookie on the HTTP response (like Facebook/Google persistent login)
 */
export function attachSessionCookie(res: express.Response, req: express.Request, token: string): void {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https' || (req.headers.host && !req.headers.host.includes('localhost'));
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_MS,
    sameSite: isHttps ? 'none' : 'lax',
    secure: isHttps,
    path: '/',
  });
}

/**
 * Clears the persistent session cookie on logout
 */
export function clearSessionCookie(res: express.Response): void {
  res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
}

/**
 * Returns saved account previews for the device/browser
 */
export function getSavedAccountsList() {
  return Object.values(users).map((u) => ({
    id: u.id,
    email: u.email,
    name: u.full_name || u.email.split('@')[0],
    full_name: u.full_name,
    telegram_chat_id: u.telegram_chat_id,
    last_active_at: u.last_login_at || new Date().toISOString(),
    last_login_at: u.last_login_at,
  }));
}

/**
 * Serializes auth tables for persistence
 */
export function serializeAuthData() {
  return {
    users,
    sessions,
    userPartitions,
  };
}

/**
 * Restores auth tables and migrates existing single-tenant store if found
 */
export function deserializeAuthData(data: any, legacyData?: any) {
  if (data?.users && typeof data.users === 'object') {
    Object.assign(users, data.users);
    for (const [id, u] of Object.entries(users)) {
      if (u?.email) {
        userEmailIndex[u.email.toLowerCase()] = id;
      }
    }
  }

  if (data?.sessions && typeof data.sessions === 'object') {
    const now = Date.now();
    for (const [token, s] of Object.entries(data.sessions)) {
      if (s && new Date((s as any).expires_at).getTime() > now) {
        sessions[token] = s as UserSessionRecord;
      }
    }
  }

  if (data?.userPartitions && typeof data.userPartitions === 'object') {
    Object.assign(userPartitions, data.userPartitions);
  }

  // Ensure default accounts exist
  seedDefaultUsers();

  // If the primary user partition is empty or unpopulated, migrate from legacy data
  if (
    (!userPartitions[PRIMARY_USER_ID] || userPartitions[PRIMARY_USER_ID].jobListings.length === 0) &&
    legacyData &&
    Array.isArray(legacyData.jobListings) &&
    legacyData.jobListings.length > 0
  ) {
    console.log(`[Auth] Migrating legacy single-user store into primary user partition (${legacyData.jobListings.length} jobs)`);
    userPartitions[PRIMARY_USER_ID] = {
      currentProfile: legacyData.currentProfile || INITIAL_PROFILE,
      jobListings: legacyData.jobListings,
      notifiedJobIds: legacyData.notifiedJobIds || [],
      deletedJobIds: legacyData.deletedJobIds || [],
      seenJobs: legacyData.seenJobs || {},
      searchedRegistry: legacyData.searchedRegistry || {},
      appSettings: legacyData.appSettings || INITIAL_SETTINGS,
      workflowState: legacyData.workflowState || {
        enabled: true,
        interval_hours: 4,
        last_run: null,
        next_run: getCanonicalNextRun(4),
        is_running: false,
        total_runs: 0,
        auto_notify_telegram: true,
        runs: [],
      },
      lastUpdated: legacyData.lastUpdated || new Date().toISOString(),
    };
  }

  // Ensure demo partition has sample data
  if (!userPartitions[DEMO_USER_ID]) {
    userPartitions[DEMO_USER_ID] = createDefaultPartitionForUser(users[DEMO_USER_ID]);
  }
}
