import crypto from 'crypto';
import express from 'express';
import type { UserProfile, JobListing, AppSettings, WorkflowState } from '../src/types.js';
import { INITIAL_PROFILE, INITIAL_JOBS, INITIAL_SETTINGS } from './seedData.js';
import { computeSafeJobId, normalizeJobUrl } from './jobSearch.js';
import {
  dbUsers,
  dbSessions,
  dbUserProfiles,
  dbUserSettings,
  dbUserWorkflows,
  dbUserRegistries,
  dbUserJobs,
  recomposePartitionFromDb,
  decomposePartitionToDb,
  saveRelationalDatabase,
  getHydratedJobsForUser,
  removeUserFromDatabase,
} from './database.js';

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
  const expiresAt = new Date(now + 15 * 60 * 1000).toISOString(); // 15 mins
  passwordResetCodes[cleanEmail] = {
    email: cleanEmail,
    code,
    created_at: new Date(now).toISOString(),
    expires_at: expiresAt,
  };

  // Persist code on user object to survive serverless instance rotation
  const userId = userEmailIndex[cleanEmail];
  if (userId) {
    if (users[userId]) {
      (users[userId] as any).reset_code = code;
      (users[userId] as any).reset_expires_at = expiresAt;
    }
    if (dbUsers[userId]) {
      (dbUsers[userId] as any).reset_code = code;
      (dbUsers[userId] as any).reset_expires_at = expiresAt;
    }
  }

  return code;
}

export function verifyAndResetPassword(
  email: string,
  code: string,
  newPassword: string
): { success: boolean; error?: string; user?: UserAccountRecord } {
  const cleanEmail = email.toLowerCase().trim();
  let record = passwordResetCodes[cleanEmail];
  const userId = userEmailIndex[cleanEmail];
  const user = userId ? users[userId] || dbUsers[userId] : null;

  // Fallback to persisted record on user object if in-memory cache was lost due to serverless cold start
  if (!record && user && (user as any).reset_code) {
    record = {
      email: cleanEmail,
      code: (user as any).reset_code,
      created_at: user.created_at,
      expires_at: (user as any).reset_expires_at || new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
  }

  if (!record) {
    return { success: false, error: 'No active password reset request found for this email. Please request a new code.' };
  }

  if (new Date(record.expires_at).getTime() < Date.now()) {
    delete passwordResetCodes[cleanEmail];
    if (user) {
      delete (user as any).reset_code;
      delete (user as any).reset_expires_at;
    }
    return { success: false, error: 'The verification code has expired. Please request a new one.' };
  }

  if (record.code.trim() !== code.trim()) {
    return { success: false, error: 'Incorrect verification code. Please check and try again.' };
  }

  if (!userId || !user) {
    return { success: false, error: 'User account not found.' };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' };
  }

  const { hash, salt } = hashPassword(newPassword);
  const now = new Date().toISOString();

  // Synchronize both users and dbUsers immediately
  if (users[userId]) {
    users[userId].password_hash = hash;
    users[userId].salt = salt;
    users[userId].last_login_at = now;
    delete (users[userId] as any).reset_code;
    delete (users[userId] as any).reset_expires_at;
  }
  if (dbUsers[userId]) {
    dbUsers[userId].password_hash = hash;
    dbUsers[userId].salt = salt;
    dbUsers[userId].last_login_at = now;
    delete (dbUsers[userId] as any).reset_code;
    delete (dbUsers[userId] as any).reset_expires_at;
  } else if (users[userId]) {
    dbUsers[userId] = { ...users[userId] };
  }

  // Invalidate any existing sessions for security
  for (const [token, sess] of Object.entries(sessions)) {
    if (sess.user_id === userId) {
      delete sessions[token];
    }
  }

  delete passwordResetCodes[cleanEmail];
  const activeUser = users[userId] || dbUsers[userId];
  return { success: true, user: activeUser };
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

  const defaultChatId = user?.telegram_chat_id || (user?.id === PRIMARY_USER_ID ? process.env.TELEGRAM_CHAT_ID : '');
  const defaultBotToken = process.env.TELEGRAM_BOT_TOKEN;
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

  // New users start with a clean dashboard (0 jobs).
  // Existing candidate jobs are managed strictly in the relational database (dbUserJobs).
  const sampleJobs: JobListing[] = [];
  const partitionRegistry: Record<string, any> = {};

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

export const DEFAULT_CANDIDATES_SEED: Array<{
  id: string;
  email: string;
  full_name: string;
  password: string;
  telegram_chat_id?: string;
  target_roles: string[];
  preferred_locations: string[];
  skills?: string[];
  job_slice?: [number, number];
}> = [
  {
    id: PRIMARY_USER_ID,
    email: 'kb270102@gmail.com',
    full_name: 'Kartik Bhatt',
    password: 'careerops123',
    telegram_chat_id: process.env.TELEGRAM_CHAT_ID || '1368681854',
    target_roles: [
      'AI Transformation Analyst',
      'Power Platform Developer',
      'Automation Consultant',
      'Business Intelligence & GenAI Specialist',
      'Solutions Analyst',
    ],
    preferred_locations: ['Gurgaon', 'Gurugram', 'Noida', 'Delhi', 'Remote', 'Bangalore', 'Bengaluru'],
    skills: ['AI Automation', 'Power Platform', 'Azure AI', 'Python', 'Power BI', 'LangChain'],
  },
  {
    id: DEMO_USER_ID,
    email: 'demo@careerops.ai',
    full_name: 'Demo Candidate',
    password: 'demo123',
    telegram_chat_id: '1368681854',
    target_roles: ['Data Analyst', 'Software Engineer', 'AI/BI Developer', 'Solutions Analyst'],
    preferred_locations: ['Remote', 'Gurugram', 'Bengaluru', 'Delhi NCR', 'Hybrid'],
    skills: ['Data Analysis', 'SQL', 'Python', 'Power BI', 'JavaScript'],
  },
  {
    id: 'usr_1c17ab7bbea3a5b5',
    email: 'alex.dev@example.com',
    full_name: 'Alex Developer',
    password: 'Password123!',
    target_roles: ['Senior Full Stack Developer', 'React/Node Architect', 'TypeScript Specialist'],
    preferred_locations: ['Remote', 'Bengaluru', 'Mumbai', 'Hybrid'],
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
    job_slice: [0, 29],
  },
  {
    id: 'usr_priya_sharma',
    email: 'priya.sharma@example.com',
    full_name: 'Priya Sharma',
    password: 'Password123!',
    target_roles: ['AI Engineer', 'Machine Learning Specialist', 'GenAI Developer', 'NLP Engineer'],
    preferred_locations: ['Bangalore', 'Hyderabad', 'Remote'],
    skills: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'Gemini API', 'Docker'],
    job_slice: [5, 35],
  },
  {
    id: 'usr_rohan_mehta',
    email: 'rohan.mehta@example.com',
    full_name: 'Rohan Mehta',
    password: 'Password123!',
    target_roles: ['Cloud Solutions Architect', 'DevOps Engineer', 'Site Reliability Engineer'],
    preferred_locations: ['Pune', 'Delhi NCR', 'Remote'],
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux'],
    job_slice: [10, 42],
  },
  {
    id: 'usr_ananya_gupta',
    email: 'ananya.gupta@example.com',
    full_name: 'Ananya Gupta',
    password: 'Password123!',
    target_roles: ['BI Specialist', 'Data Engineer', 'Analytics Consultant', 'Tableau Developer'],
    preferred_locations: ['Gurgaon', 'Noida', 'Remote'],
    skills: ['SQL', 'Power BI', 'Tableau', 'dbt', 'Snowflake', 'Python'],
    job_slice: [15, 45],
  },
];

let hasSeeded = false;
let isSeeding = false;

/**
 * Initializes default candidate accounts and ensures at least 6 accounts exist in DB
 */
export function seedDefaultUsers(force = false) {
  if (isSeeding) return;
  if (hasSeeded && !force) return;
  if (typeof dbUsers === 'undefined') return;

  isSeeding = true;
  let seededAny = false;

  try {
    for (const cand of DEFAULT_CANDIDATES_SEED) {
      const cleanEmail = cand.email.toLowerCase().trim();
      const existingId = userEmailIndex[cleanEmail] || (users[cand.id] ? cand.id : (dbUsers[cand.id] ? cand.id : null));

      if (!existingId || (!users[existingId] && !dbUsers[existingId])) {
        const { hash, salt } = hashPassword(cand.password);
        const account: UserAccountRecord = {
          id: cand.id,
          email: cleanEmail,
          full_name: cand.full_name,
          password_hash: hash,
          salt,
          created_at: '2026-01-01T00:00:00.000Z',
          last_login_at: new Date().toISOString(),
          telegram_chat_id: cand.telegram_chat_id,
        };

        users[cand.id] = account;
        dbUsers[cand.id] = account;
        userEmailIndex[cleanEmail] = cand.id;
        seededAny = true;

        // Seed candidate partition and profile if missing
        if (!userPartitions[cand.id] && !dbUserProfiles[cand.id]) {
          const partition = createDefaultPartitionForUser(account, {
            target_roles: cand.target_roles,
            preferred_locations: cand.preferred_locations,
            skills: cand.skills,
          });

          if (cand.job_slice && Array.isArray(INITIAL_JOBS)) {
            partition.jobListings = INITIAL_JOBS.slice(cand.job_slice[0], cand.job_slice[1]);
          }

          userPartitions[cand.id] = partition;
          decomposePartitionToDb(cand.id, partition);
        }
      } else {
        // Ensure existing is in both maps
        const activeUser = users[existingId] || dbUsers[existingId];
        if (activeUser) {
          users[existingId] = activeUser;
          dbUsers[existingId] = activeUser;
          userEmailIndex[cleanEmail] = existingId;
        }
      }
    }

    if (seededAny) {
      try {
        saveRelationalDatabase();
      } catch {}
    }
    hasSeeded = true;
  } catch (err: any) {
    console.warn('[Auth] seedDefaultUsers note:', err?.message || err);
  } finally {
    isSeeding = false;
  }
}

/**
 * Bidirectionally synchronizes in-memory `users` and relational `dbUsers`
 */
export function syncUsersFromDb(): void {
  try {
    if (typeof dbUsers === 'undefined') return;
    seedDefaultUsers();

    for (const [id, u] of Object.entries(dbUsers)) {
      if (u && u.email) {
        users[id] = u;
        userEmailIndex[u.email.toLowerCase().trim()] = id;
      }
    }
    for (const [id, u] of Object.entries(users)) {
      if (u && !dbUsers[id]) {
        dbUsers[id] = u;
      }
    }
  } catch (err: any) {
    console.warn('[Auth] syncUsersFromDb note:', err?.message || err);
  }
}

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
  if (!token && typeof req.query.auth === 'string') {
    token = req.query.auth;
  }

  if (!token) return null;

  const session = sessions[token] || dbSessions[token];
  if (!session) return null;

  if (new Date(session.expires_at).getTime() < Date.now()) {
    delete sessions[token];
    delete dbSessions[token];
    return null;
  }

  return users[session.user_id] || dbUsers[session.user_id] || null;
}


/**
 * Retrieves or lazily creates a data partition for a given user ID
 */
export function getUserPartition(userId: string, initialPreferences?: InitialCareerPreferences): UserPartitionData {
  if (!userPartitions[userId]) {
    const hasDbRecord =
      Boolean(dbUsers[userId]) ||
      Boolean(dbUserProfiles[userId]) ||
      Object.values(dbUserJobs).some((r) => r.user_id === userId);

    if (hasDbRecord) {
      userPartitions[userId] = recomposePartitionFromDb(userId);
    } else {
      userPartitions[userId] = createDefaultPartitionForUser(users[userId], initialPreferences);
      decomposePartitionToDb(userId, userPartitions[userId]);
      saveRelationalDatabase();
    }
  } else {
    // If the relational database has candidate relations for this user, ensure partition matches relational DB
    const candidateRels = Object.values(dbUserJobs).filter((r) => r.user_id === userId);
    if (candidateRels.length > 0) {
      userPartitions[userId].jobListings = getHydratedJobsForUser(userId);
    }
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
  syncUsersFromDb();
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
 * Returns detailed, readable user accounts for administration
 * Merges in-memory `users` with relational `dbUsers`
 */
export function getAllUsersWithStats() {
  syncUsersFromDb();

  // Merge both user sources
  const allUsers = new Map<string, UserAccountRecord>();
  for (const u of Object.values(users)) {
    if (u?.id) allUsers.set(u.id, u);
  }
  for (const u of Object.values(dbUsers)) {
    if (u?.id && !allUsers.has(u.id)) allUsers.set(u.id, u);
  }

  return Array.from(allUsers.values()).map((u) => {
    const partition = userPartitions[u.id];
    const profile = partition?.currentProfile || dbUserProfiles[u.id];
    const jobList = partition?.jobListings || (u.id ? getHydratedJobsForUser(u.id) : []);
    const jobCount = jobList ? jobList.length : 0;
    const isPrimary = u.id === PRIMARY_USER_ID || u.email?.toLowerCase() === 'kb270102@gmail.com';

    const status_breakdown: Record<string, number> = {};
    if (jobList && jobList.length > 0) {
      for (const j of jobList) {
        const s = j.status || 'discovered';
        status_breakdown[s] = (status_breakdown[s] || 0) + 1;
      }
    }

    return {
      id: u.id,
      email: u.email,
      full_name: u.full_name || profile?.full_name || u.email?.split('@')[0],
      avatar_url: u.avatar_url,
      created_at: u.created_at || new Date().toISOString(),
      last_login_at: u.last_login_at || u.created_at || new Date().toISOString(),
      is_primary: isPrimary,
      is_primary_admin: isPrimary,
      target_roles: profile?.target_roles || [],
      preferred_locations: profile?.preferred_locations || [],
      job_count: jobCount,
      status_breakdown,
      has_resume: Boolean(profile?.parsed_from_document || (profile as any)?.raw_resume_text || (profile?.experience?.length || 0) > 0),
    };
  });
}

/**
 * Deletes a user account and purges their partition, sessions, and database records
 */
export function deleteUserAccount(userId: string): { success: boolean; error?: string } {
  if (userId === PRIMARY_USER_ID) {
    return { success: false, error: 'Cannot delete the primary administrator account (Kartik Bhatt).' };
  }
  syncUsersFromDb();
  const u = users[userId] || dbUsers[userId];
  if (!u) {
    return { success: false, error: 'User account not found.' };
  }
  const emailLower = u.email.toLowerCase();
  delete users[userId];
  delete dbUsers[userId];
  delete userEmailIndex[emailLower];
  delete userPartitions[userId];

  // Purge any active sessions
  for (const [token, s] of Object.entries(sessions)) {
    if (s.user_id === userId) {
      delete sessions[token];
    }
  }
  for (const [token, s] of Object.entries(dbSessions)) {
    if (s.user_id === userId) {
      delete dbSessions[token];
    }
  }

  // Purge database files
  removeUserFromDatabase(userId);
  saveRelationalDatabase();
  return { success: true };
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
