import fs from 'fs';
import path from 'path';
import type { UserProfile, JobListing, AppSettings, WorkflowState, JobStatus, LinkVerificationStatus, MatchResult, TailoredContent } from '../src/types.js';
import { type UserAccountRecord, type UserSessionRecord, type UserPartitionData, PRIMARY_USER_ID, DEMO_USER_ID } from './auth.js';
import { INITIAL_PROFILE, INITIAL_SETTINGS, INITIAL_JOBS } from './seedData.js';

export interface JobEntity {
  id: string;
  title: string;
  company_name: string;
  location: string;
  salary_range_lpa?: [number, number];
  salary_is_estimated?: boolean;
  salary_source?: string;
  experience_range_years?: [number, number];
  experience_is_inferred?: boolean;
  description: string;
  apply_link: string;
  ats_source: string;
  is_direct_posting?: boolean;
  verification_status?: LinkVerificationStatus;
  verification_notes?: string;
  verified_at?: string;
  posted_date?: string;
  posted_days_ago?: number;
  discovered_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserJobRelation {
  id: string; // e.g. rel_${userId}_${jobId}
  user_id: string; // Foreign key -> users.id
  job_id: string; // Foreign key -> jobs.id
  status: JobStatus;
  fit?: MatchResult;
  tailored?: TailoredContent;
  tailored_resume?: string;
  cover_letter?: string;
  notes?: string;
  notified_telegram: boolean;
  seen: boolean;
  deleted: boolean;
  applied_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRegistryRecord {
  user_id: string;
  seen_jobs: Record<string, string>;
  searched_registry: Record<string, any>;
  deleted_job_ids: string[];
  notified_job_ids: string[];
  updated_at: string;
}

// In-Memory Relational Database Tables
export const dbUsers: Record<string, UserAccountRecord> = {};
export const dbSessions: Record<string, UserSessionRecord> = {};
export const dbJobs: Record<string, JobEntity> = {};
export const dbUserJobs: Record<string, UserJobRelation> = {};
export const dbUserProfiles: Record<string, UserProfile> = {};
export const dbUserSettings: Record<string, AppSettings & { serpapi_key?: string }> = {};
export const dbUserWorkflows: Record<string, WorkflowState> = {};
export const dbUserRegistries: Record<string, UserRegistryRecord> = {};

const ROOT_DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
export const DB_DIR = path.join(ROOT_DATA_DIR, 'db');
export const BUNDLED_DB_DIR = path.join(process.cwd(), 'data', 'db');

const TABLES = {
  users: 'users.json',
  sessions: 'sessions.json',
  jobs: 'jobs.json',
  user_jobs: 'user_jobs.json',
  user_profiles: 'user_profiles.json',
  user_settings: 'user_settings.json',
  user_workflows: 'user_workflows.json',
  user_registries: 'user_registries.json',
} as const;

function ensureDbDirectory(): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (BUNDLED_DB_DIR !== DB_DIR && !fs.existsSync(BUNDLED_DB_DIR)) {
      fs.mkdirSync(BUNDLED_DB_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('[DB] Directory creation note:', err);
  }
}

function readJsonFile<T>(filename: string): Record<string, T> | null {
  const candidatePaths = [
    path.join(DB_DIR, filename),
    path.join(BUNDLED_DB_DIR, filename),
    path.join('/tmp', 'db', filename),
  ];

  for (const filePath of candidatePaths) {
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
      } catch (err: any) {
        console.warn(`[DB] Failed to read ${filePath}:`, err.message);
      }
    }
  }
  return null;
}

function writeJsonFile(filename: string, data: any): void {
  ensureDbDirectory();
  const primaryPath = path.join(DB_DIR, filename);
  try {
    fs.writeFileSync(primaryPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err: any) {
    console.error(`[DB] Failed to write ${primaryPath}:`, err.message);
  }

  // Also write to bundled path if distinct and parent exists
  if (BUNDLED_DB_DIR !== DB_DIR) {
    try {
      const secondaryPath = path.join(BUNDLED_DB_DIR, filename);
      fs.writeFileSync(secondaryPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch {}
  }
}

/**
 * Normalizes a raw JobListing into a persistent global JobEntity
 */
export function normalizeToJobEntity(job: JobListing): JobEntity {
  const now = new Date().toISOString();
  return {
    id: job.id,
    title: job.title,
    company_name: job.company_name,
    location: job.location,
    salary_range_lpa: job.salary_range_lpa,
    salary_is_estimated: job.salary_is_estimated,
    salary_source: job.salary_source,
    experience_range_years: job.experience_range_years,
    experience_is_inferred: job.experience_is_inferred,
    description: job.description,
    apply_link: job.apply_link,
    ats_source: job.ats_source,
    is_direct_posting: job.is_direct_posting,
    verification_status: job.verification_status,
    verification_notes: job.verification_notes,
    verified_at: job.verified_at,
    posted_date: job.posted_date,
    posted_days_ago: job.posted_days_ago,
    discovered_at: job.discovered_at || now,
    created_at: job.discovered_at || now,
    updated_at: now,
  };
}

/**
 * Creates or updates the relation record linking a User and a Job
 */
export function buildUserJobRelation(
  userId: string,
  job: JobListing,
  options?: Partial<UserJobRelation>
): UserJobRelation {
  const relationId = `rel_${userId}_${job.id}`;
  const now = new Date().toISOString();
  const existing = dbUserJobs[relationId];

  return {
    id: relationId,
    user_id: userId,
    job_id: job.id,
    status: options?.status || existing?.status || job.status || 'discovered',
    fit: options?.fit || existing?.fit || job.fit,
    tailored: options?.tailored || existing?.tailored || job.tailored,
    tailored_resume: options?.tailored_resume || existing?.tailored_resume || job.tailored_resume,
    cover_letter: options?.cover_letter || existing?.cover_letter || job.cover_letter,
    notes: options?.notes || existing?.notes || job.notes,
    notified_telegram: options?.notified_telegram !== undefined ? options.notified_telegram : (existing?.notified_telegram || false),
    seen: options?.seen !== undefined ? options.seen : (existing?.seen || true),
    deleted: options?.deleted !== undefined ? options.deleted : (existing?.deleted || false),
    applied_at: options?.applied_at || existing?.applied_at || (job.status === 'applied' ? now : undefined),
    created_at: existing?.created_at || now,
    updated_at: now,
  };
}

/**
 * Joins a global JobEntity with a UserJobRelation to build a full frontend JobListing
 */
export function hydrateJobListing(job: JobEntity, relation?: UserJobRelation): JobListing {
  return {
    id: job.id,
    title: job.title,
    company_name: job.company_name,
    location: job.location,
    salary_range_lpa: job.salary_range_lpa,
    salary_is_estimated: job.salary_is_estimated,
    salary_source: job.salary_source,
    experience_range_years: job.experience_range_years,
    experience_is_inferred: job.experience_is_inferred,
    description: job.description,
    apply_link: job.apply_link,
    ats_source: job.ats_source,
    is_direct_posting: job.is_direct_posting,
    verification_status: job.verification_status,
    verification_notes: job.verification_notes,
    verified_at: job.verified_at,
    posted_date: job.posted_date,
    posted_days_ago: job.posted_days_ago,
    discovered_at: job.discovered_at,
    status: relation?.status || 'discovered',
    fit: relation?.fit,
    tailored: relation?.tailored,
    tailored_resume: relation?.tailored_resume,
    cover_letter: relation?.cover_letter,
    notes: relation?.notes,
  };
}

/**
 * Retrieves all hydrated JobListing records for a specific candidate
 */
export function getHydratedJobsForUser(userId: string): JobListing[] {
  const result: JobListing[] = [];
  const candidateRelations = Object.values(dbUserJobs).filter(
    (rel) => rel.user_id === userId && !rel.deleted
  );

  for (const rel of candidateRelations) {
    const jobEntity = dbJobs[rel.job_id];
    if (jobEntity) {
      result.push(hydrateJobListing(jobEntity, rel));
    }
  }

  return result;
}

/**
 * Upserts a job in the master catalog and establishes the candidate-job relationship
 */
export function upsertCandidateJob(userId: string, job: JobListing, statusOverride?: JobStatus): void {
  // 1. Upsert into master jobs catalog
  const jobEntity = normalizeToJobEntity(job);
  dbJobs[job.id] = { ...dbJobs[job.id], ...jobEntity };

  // 2. Establish relational join
  const relation = buildUserJobRelation(userId, job, statusOverride ? { status: statusOverride } : undefined);
  dbUserJobs[relation.id] = relation;
}

/**
 * Updates a candidate's relationship with a job (e.g. status changed to applied, tailored resume generated)
 */
export function updateCandidateJobRelation(
  userId: string,
  jobId: string,
  updates: Partial<Omit<UserJobRelation, 'id' | 'user_id' | 'job_id'>>
): UserJobRelation | null {
  const relationId = `rel_${userId}_${jobId}`;
  const existing = dbUserJobs[relationId];
  const now = new Date().toISOString();

  if (!existing) {
    const jobEntity = dbJobs[jobId];
    if (!jobEntity) return null;
    const rel = buildUserJobRelation(userId, hydrateJobListing(jobEntity), updates);
    dbUserJobs[rel.id] = rel;
    return rel;
  }

  const updated: UserJobRelation = {
    ...existing,
    ...updates,
    updated_at: now,
  };

  if (updates.status === 'applied' && !updated.applied_at) {
    updated.applied_at = now;
  }

  dbUserJobs[relationId] = updated;
  return updated;
}

/**
 * Deconstructs an in-memory UserPartitionData into relational tables
 */
export function decomposePartitionToDb(userId: string, partition: UserPartitionData): void {
  const now = new Date().toISOString();

  // 1. Profile
  if (partition.currentProfile) {
    dbUserProfiles[userId] = { ...partition.currentProfile };
  }

  // 2. Settings
  if (partition.appSettings) {
    dbUserSettings[userId] = { ...partition.appSettings };
  }

  // 3. Workflow State
  if (partition.workflowState) {
    dbUserWorkflows[userId] = { ...partition.workflowState };
  }

  // 4. Registry
  dbUserRegistries[userId] = {
    user_id: userId,
    seen_jobs: partition.seenJobs || {},
    searched_registry: partition.searchedRegistry || {},
    deleted_job_ids: partition.deletedJobIds || [],
    notified_job_ids: partition.notifiedJobIds || [],
    updated_at: now,
  };

  // 5. Jobs & Relations
  if (Array.isArray(partition.jobListings)) {
    const deletedSet = new Set(partition.deletedJobIds || []);
    const notifiedSet = new Set(partition.notifiedJobIds || []);

    for (const job of partition.jobListings) {
      if (!job || !job.id) continue;
      // Master Job catalog
      if (!dbJobs[job.id]) {
        dbJobs[job.id] = normalizeToJobEntity(job);
      }
      // Candidate relation
      const relId = `rel_${userId}_${job.id}`;
      const existingRel = dbUserJobs[relId];
      dbUserJobs[relId] = buildUserJobRelation(userId, job, {
        status: job.status || existingRel?.status || 'discovered',
        fit: job.fit || existingRel?.fit,
        tailored: job.tailored || existingRel?.tailored,
        tailored_resume: job.tailored_resume || existingRel?.tailored_resume,
        cover_letter: job.cover_letter || existingRel?.cover_letter,
        notes: job.notes !== undefined ? job.notes : existingRel?.notes,
        deleted: deletedSet.has(job.id),
        notified_telegram: notifiedSet.has(job.id),
      });
    }
  }
}

/**
 * Recomposes a candidate partition from relational tables
 */
export function recomposePartitionFromDb(userId: string): UserPartitionData {
  const profile = dbUserProfiles[userId] || INITIAL_PROFILE;
  const settings = dbUserSettings[userId] || INITIAL_SETTINGS;
  const workflow = dbUserWorkflows[userId] || {
    enabled: true,
    interval_hours: 4,
    last_run: null,
    next_run: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    is_running: false,
    total_runs: 0,
    auto_notify_telegram: true,
    runs: [],
  };
  const registry = dbUserRegistries[userId] || {
    user_id: userId,
    seen_jobs: {},
    searched_registry: {},
    deleted_job_ids: [],
    notified_job_ids: [],
    updated_at: new Date().toISOString(),
  };

  const jobListings = getHydratedJobsForUser(userId);

  return {
    currentProfile: profile,
    jobListings,
    notifiedJobIds: registry.notified_job_ids || [],
    deletedJobIds: registry.deleted_job_ids || [],
    seenJobs: registry.seen_jobs || {},
    searchedRegistry: registry.searched_registry || {},
    appSettings: settings,
    workflowState: workflow,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Initializes relational database from individual JSON files or migrates legacy store
 */
export function initRelationalDatabase(legacyStore?: any): void {
  ensureDbDirectory();

  // Load individual JSON tables
  const loadedUsers = readJsonFile<UserAccountRecord>(TABLES.users);
  const loadedSessions = readJsonFile<UserSessionRecord>(TABLES.sessions);
  const loadedJobs = readJsonFile<JobEntity>(TABLES.jobs);
  const loadedUserJobs = readJsonFile<UserJobRelation>(TABLES.user_jobs);
  const loadedProfiles = readJsonFile<UserProfile>(TABLES.user_profiles);
  const loadedSettings = readJsonFile<AppSettings & { serpapi_key?: string }>(TABLES.user_settings);
  const loadedWorkflows = readJsonFile<WorkflowState>(TABLES.user_workflows);
  const loadedRegistries = readJsonFile<UserRegistryRecord>(TABLES.user_registries);

  if (loadedUsers) Object.assign(dbUsers, loadedUsers);
  if (loadedSessions) Object.assign(dbSessions, loadedSessions);
  if (loadedJobs) Object.assign(dbJobs, loadedJobs);
  if (loadedUserJobs) Object.assign(dbUserJobs, loadedUserJobs);
  if (loadedProfiles) Object.assign(dbUserProfiles, loadedProfiles);
  if (loadedSettings) Object.assign(dbUserSettings, loadedSettings);
  if (loadedWorkflows) Object.assign(dbUserWorkflows, loadedWorkflows);
  if (loadedRegistries) Object.assign(dbUserRegistries, loadedRegistries);

  const hasUsers = Object.keys(dbUsers).length > 0;
  const hasJobs = Object.keys(dbJobs).length > 0;

  // If tables are empty and legacy data is provided, run migration
  if ((!hasUsers || !hasJobs) && legacyStore) {
    console.log('[DB] Migrating monolithic store into relational JSON database tables...');
    migrateLegacyStoreToRelational(legacyStore);
    saveRelationalDatabase();
  }

  console.log(
    `[DB] Relational database ready: ${Object.keys(dbUsers).length} users, ${Object.keys(dbJobs).length} jobs, ${Object.keys(dbUserJobs).length} candidate-job relations.`
  );
}

/**
 * Migrates monolithic store into the normalized relational tables
 */
export function migrateLegacyStoreToRelational(legacy: any): void {
  if (!legacy) return;

  // 1. Users
  if (legacy.users && typeof legacy.users === 'object') {
    Object.assign(dbUsers, legacy.users);
  }

  // 2. Sessions
  if (legacy.sessions && typeof legacy.sessions === 'object') {
    Object.assign(dbSessions, legacy.sessions);
  }

  // 3. User partitions
  if (legacy.userPartitions && typeof legacy.userPartitions === 'object') {
    for (const [userId, partition] of Object.entries(legacy.userPartitions)) {
      if (partition) {
        decomposePartitionToDb(userId, partition as UserPartitionData);
      }
    }
  }

  // 4. Primary user fallback from legacy root properties
  if (Array.isArray(legacy.jobListings) && legacy.jobListings.length > 0) {
    decomposePartitionToDb(PRIMARY_USER_ID, {
      currentProfile: legacy.currentProfile || INITIAL_PROFILE,
      jobListings: legacy.jobListings,
      notifiedJobIds: legacy.notifiedJobIds || [],
      deletedJobIds: legacy.deletedJobIds || [],
      seenJobs: legacy.seenJobs || {},
      searchedRegistry: legacy.searchedRegistry || {},
      appSettings: legacy.appSettings || INITIAL_SETTINGS,
      workflowState: legacy.workflowState || {
        enabled: true,
        interval_hours: 4,
        last_run: null,
        next_run: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
        is_running: false,
        total_runs: 0,
        auto_notify_telegram: true,
        runs: [],
      },
      lastUpdated: legacy.lastUpdated || new Date().toISOString(),
    });
  }

  // 5. Seed default sample jobs into global catalog if still empty
  if (Object.keys(dbJobs).length === 0) {
    for (const j of INITIAL_JOBS) {
      dbJobs[j.id] = normalizeToJobEntity(j);
      dbUserJobs[`rel_${PRIMARY_USER_ID}_${j.id}`] = buildUserJobRelation(PRIMARY_USER_ID, j);
      dbUserJobs[`rel_${DEMO_USER_ID}_${j.id}`] = buildUserJobRelation(DEMO_USER_ID, j);
    }
  }
}

/**
 * Persists all in-memory relational tables into individual JSON files in data/db/
 */
export function saveRelationalDatabase(): void {
  ensureDbDirectory();
  try {
    writeJsonFile(TABLES.users, dbUsers);
    writeJsonFile(TABLES.sessions, dbSessions);
    writeJsonFile(TABLES.jobs, dbJobs);
    writeJsonFile(TABLES.user_jobs, dbUserJobs);
    writeJsonFile(TABLES.user_profiles, dbUserProfiles);
    writeJsonFile(TABLES.user_settings, dbUserSettings);
    writeJsonFile(TABLES.user_workflows, dbUserWorkflows);
    writeJsonFile(TABLES.user_registries, dbUserRegistries);
  } catch (err: any) {
    console.error('[DB] Error saving relational database:', err.message);
  }
}

/**
 * Returns comprehensive statistics and relational health summary
 */
export function getRelationalStats() {
  const statusCounts: Record<string, number> = {
    discovered: 0,
    applied: 0,
    interviewing: 0,
    rejected: 0,
    expired: 0,
    new: 0,
    viable: 0,
    notified: 0,
    archived: 0,
  };

  for (const rel of Object.values(dbUserJobs)) {
    if (!rel.deleted) {
      statusCounts[rel.status] = (statusCounts[rel.status] || 0) + 1;
    }
  }

  const tableSummary: Record<string, { records: number; filename: string }> = {
    users: { records: Object.keys(dbUsers).length, filename: TABLES.users },
    sessions: { records: Object.keys(dbSessions).length, filename: TABLES.sessions },
    jobs: { records: Object.keys(dbJobs).length, filename: TABLES.jobs },
    user_jobs: { records: Object.keys(dbUserJobs).length, filename: TABLES.user_jobs },
    user_profiles: { records: Object.keys(dbUserProfiles).length, filename: TABLES.user_profiles },
    user_settings: { records: Object.keys(dbUserSettings).length, filename: TABLES.user_settings },
    user_workflows: { records: Object.keys(dbUserWorkflows).length, filename: TABLES.user_workflows },
    user_registries: { records: Object.keys(dbUserRegistries).length, filename: TABLES.user_registries },
  };

  return {
    database_type: 'modular_relational_json',
    storage_path: DB_DIR,
    counts: {
      total_users: Object.keys(dbUsers).length,
      total_active_sessions: Object.keys(dbSessions).length,
      total_master_jobs: Object.keys(dbJobs).length,
      total_relations: Object.keys(dbUserJobs).length,
    },
    relations_by_status: statusCounts,
    tables: tableSummary,
    last_synced: new Date().toISOString(),
  };
}
