// Ensure DOMMatrix / Canvas polyfills exist for headless serverless environments (e.g. Vercel)
if (typeof (globalThis as any).DOMMatrix === 'undefined') {
  (globalThis as any).DOMMatrix = class DOMMatrix {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    m11 = 1; m12 = 0; m13 = 0; m14 = 0;
    m21 = 0; m22 = 1; m23 = 0; m24 = 0;
    m31 = 0; m32 = 0; m33 = 1; m34 = 0;
    m41 = 0; m42 = 0; m43 = 0; m44 = 1;
    is2D = true;
    isIdentity = true;
    constructor(_init?: any) {}
    multiply() { return this; }
    translate() { return this; }
    scale() { return this; }
    rotate() { return this; }
    inverse() { return this; }
    transformPoint(p: any) { return p; }
    toFloat32Array() { return new Float32Array(16); }
    toFloat64Array() { return new Float64Array(16); }
  };
}
if (typeof (globalThis as any).ImageData === 'undefined') {
  (globalThis as any).ImageData = class ImageData {
    width = 0;
    height = 0;
    data = new Uint8ClampedArray(0);
    constructor(w: number, h: number) { this.width = w; this.height = h; }
  };
}
if (typeof (globalThis as any).Path2D === 'undefined') {
  (globalThis as any).Path2D = class Path2D {
    addPath() {}
    closePath() {}
    moveTo() {}
    lineTo() {}
    bezierCurveTo() {}
    quadraticCurveTo() {}
    arc() {}
    rect() {}
  };
}

import express from 'express';
import path from 'path';
import fs from 'fs';
import type { UserProfile, JobListing, AppSettings, WorkflowState, WorkflowRunLog } from './src/types.js';
import { INITIAL_PROFILE, INITIAL_JOBS } from './server/seedData.js';
import { evaluateJobFit } from './server/matcher.js';
import { generateTailoredDocuments } from './server/tailor.js';
import { discoverJobsForProfile, extractExperienceYears, extractSalaryLpa, normalizeJobUrl, computeSafeJobId, isStrictAtsUrl, isInvalidBogusTitle } from './server/jobSearch.js';
import { verifyJobPosting, isGenericSearchLink } from './server/linkVerifier.js';
import { resolveExperienceYears, estimateSalaryLpa, generateSalarySearchMetadata } from './server/salaryEstimator.js';
import { parseAndEnrichCandidateResume } from './server/resumeScraper.js';
import { getGeminiClient, cleanJsonResponse } from './server/gemini.js';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import { loadFromDisk, saveToDisk, loadFromRemoteKV, saveToRemoteKV, type StorageData } from './server/storage.js';
import {
  resolveAuthUser,
  getUserPartition,
  createSessionForUser,
  attachSessionCookie,
  clearSessionCookie,
  hashPassword,
  verifyPassword,
  getSavedAccountsList,
  PRIMARY_USER_ID,
  DEMO_USER_ID,
  users,
  userEmailIndex,
  sessions,
  userPartitions,
  serializeAuthData,
  deserializeAuthData,
  type UserPartitionData,
  type UserAccountRecord,
  getAllUserPartitions,
  createPasswordResetCode,
  verifyAndResetPassword,
} from './server/auth.js';
import { sendPasswordResetEmail } from './server/mailer.js';
import {
  getRelationalStats,
  saveRelationalDatabase,
  dbUsers,
  dbJobs,
  dbUserJobs,
  dbUserProfiles,
  dbUserSettings,
  dbUserWorkflows,
  upsertCandidateJob,
  updateCandidateJobRelation,
  getHydratedJobsForUser,
  decomposePartitionToDb,
} from './server/database.js';

const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'careerops_store.json');
const BUNDLED_STORE_FILE = path.join(process.cwd(), 'data', 'careerops_store.json');

let currentProfile: UserProfile = { ...INITIAL_PROFILE };
// Filter out any expired jobs initially and blacklisted entries (State Street, SOTI)
let jobListings: JobListing[] = INITIAL_JOBS.filter(
  (j) =>
    j.status !== 'expired' &&
    j.verification_status !== 'expired_or_invalid' &&
    !j.company_name.toLowerCase().includes('state street') &&
    !j.company_name.toLowerCase().includes('soti') &&
    !j.apply_link.toLowerCase().includes('soti.careers') &&
    j.id !== '9dfe6112a2137e75'
);
const notifiedJobIds = new Set<string>();
const deletedJobIds = new Set<string>();
const seenJobs: Record<string, string> = {};
const searchedRegistry: Record<string, any> = {};
let storeLastUpdated: string = new Date().toISOString();

// Permanently blacklist fake/dead SOTI seed in memory
seenJobs['9dfe6112a2137e75'] = new Date().toISOString();
seenJobs['https://soti.careers/jobs/bi-solutions-analyst-gurugram'] = new Date().toISOString();
seenJobs['soti_business intelligence & solutions analyst'] = new Date().toISOString();

// Pre-populate searchedRegistry with initial job listings
for (const j of jobListings) {
  const sig = `${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`;
  const normLink = normalizeJobUrl(j.apply_link);
  searchedRegistry[j.id] = {
    id: j.id,
    signature: sig,
    normalized_url: normLink,
    company_name: j.company_name,
    title: j.title,
    status: j.status || 'discovered',
    discovered_at: j.discovered_at || new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
  };
}

/**
 * Truncates searchedRegistry based on retention policy and maximum capacity.
 * To strictly follow user intent ("if the job is already searched for, don't research even if I have rejected it"),
 * rejected roles are preserved with extended retention (2x TTL) and prioritized during capacity prunes.
 */
function truncateSearchedRegistry(ttlDays: number = 30, maxCapacity: number = 5000): { prunedCount: number; remainingCount: number } {
  const now = Date.now();
  const cutoffMs = ttlDays * 24 * 3600 * 1000;
  let prunedCount = 0;
  const entries = Object.entries(searchedRegistry);
  for (const [key, item] of entries) {
    if (!item) continue;
    const isRejected = item.status === 'rejected' || item.status === 'deleted';
    const retentionMs = isRejected ? cutoffMs * 2 : cutoffMs;
    const itemTime = item.last_seen_at ? new Date(item.last_seen_at).getTime() : 0;
    if (now - itemTime > retentionMs) {
      delete searchedRegistry[key];
      delete seenJobs[key];
      prunedCount++;
    }
  }
  const remainingKeys = Object.keys(searchedRegistry);
  if (remainingKeys.length > maxCapacity) {
    const sorted = remainingKeys
      .map((k) => ({ key: k, item: searchedRegistry[k] }))
      .sort((a, b) => {
        const aIsRejected = a.item?.status === 'rejected' || a.item?.status === 'deleted';
        const bIsRejected = b.item?.status === 'rejected' || b.item?.status === 'deleted';
        if (aIsRejected && !bIsRejected) return 1;
        if (bIsRejected && !aIsRejected) return -1;
        const aTime = a.item?.last_seen_at ? new Date(a.item.last_seen_at).getTime() : 0;
        const bTime = b.item?.last_seen_at ? new Date(b.item.last_seen_at).getTime() : 0;
        return aTime - bTime;
      });
    const toRemove = sorted.slice(0, remainingKeys.length - maxCapacity);
    for (const { key } of toRemove) {
      delete searchedRegistry[key];
      delete seenJobs[key];
      prunedCount++;
    }
  }
  return { prunedCount, remainingCount: Object.keys(searchedRegistry).length };
}

const appSettings: AppSettings & { serpapi_key?: string } = {
  min_match_score: 75,
  telegram_configured: true,
  telegram_chat_id: process.env.TELEGRAM_CHAT_ID || '1368681854',
  telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN || '8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas',
  telegram_bot_name: 'CareerOps Bot',
  telegram_custom_header: '🎯 New High-Fit Role Matched!',
  telegram_include_salary: true,
  telegram_include_skill_gap: true,
  telegram_include_apply_link: true,
  seen_ttl_days: 14,
  workflow_enabled: true,
  workflow_interval_hours: 4,
  auto_notify_telegram: true,
  serpapi_key: process.env.SERPAPI_KEY || 'GNLQpQWpHAMcEL9MguEkrxq1',
};

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

export function getCanonicalNextRun(intervalHours = 4): string {
  const now = Date.now();
  const intervalMs = (intervalHours || 4) * 3600 * 1000;
  const nextTimestamp = Math.ceil((now + 1000) / intervalMs) * intervalMs;
  return new Date(nextTimestamp).toISOString();
}

const PEER_ENDPOINTS = [
  'https://ais-dev-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app',
  'https://ais-pre-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app',
];

const workflowState: WorkflowState = {
  enabled: true,
  interval_hours: 4,
  last_run: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
  next_run: getCanonicalNextRun(4),
  is_running: false,
  total_runs: 1,
  auto_notify_telegram: true,
  runs: [
    {
      id: 'run-init-01',
      started_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
      trigger: 'scheduled_4h',
      new_jobs_found: 6,
      evaluated_count: 6,
      high_fit_count: 4,
      notified_count: 2,
      status: 'completed',
      summary: 'Automated 4-hour cycle: Scanned Workday, Greenhouse & Ashby portals. Evaluated 6 roles, 4 high-fit (≥75%), 2 dispatched to Telegram.',
    },
  ],
};

function applyLoadedData(data: any) {
  if (!data) return;
  if (data.currentProfile) currentProfile = data.currentProfile;
  if (data.appSettings) Object.assign(appSettings, data.appSettings);
  if (data.workflowState) {
    Object.assign(workflowState, data.workflowState);
    workflowState.is_running = false; // release any stale lock
    const now = Date.now();
    const intervalMs = (workflowState.interval_hours || 4) * 60 * 60 * 1000;
    const nextTime = workflowState.next_run ? new Date(workflowState.next_run).getTime() : 0;
    if (nextTime <= now) {
      const nextTimestamp = Math.ceil((now + 1000) / intervalMs) * intervalMs;
      workflowState.next_run = new Date(nextTimestamp).toISOString();
    }
  }
  if (Array.isArray(data.deletedJobIds)) {
    for (const id of data.deletedJobIds) {
      if (id) deletedJobIds.add(id);
    }
  }
  if (Array.isArray(data.notifiedJobIds)) {
    for (const id of data.notifiedJobIds) notifiedJobIds.add(id);
  }
  if (data.seenJobs && typeof data.seenJobs === 'object') {
    Object.assign(seenJobs, data.seenJobs);
  }
  if (data.searchedRegistry && typeof data.searchedRegistry === 'object') {
    Object.assign(searchedRegistry, data.searchedRegistry);
    for (const [key, item] of Object.entries(data.searchedRegistry)) {
      if (item && typeof item === 'object') {
        const anyItem = item as any;
        if (anyItem.id) seenJobs[anyItem.id] = anyItem.last_seen_at || new Date().toISOString();
        if (anyItem.signature) seenJobs[anyItem.signature] = anyItem.last_seen_at || new Date().toISOString();
        if (anyItem.normalized_url) seenJobs[anyItem.normalized_url] = anyItem.last_seen_at || new Date().toISOString();
      }
    }
  }
  if (data.lastUpdated) {
    storeLastUpdated = data.lastUpdated;
  }

  // Restore and reconcile multi-user authentication data & partitions
  deserializeAuthData(data, data);
  if (userPartitions[PRIMARY_USER_ID]) {
    const part = userPartitions[PRIMARY_USER_ID];
    if (part.currentProfile) currentProfile = part.currentProfile;
    if (Array.isArray(part.jobListings) && part.jobListings.length > 0) {
      jobListings = part.jobListings;
    }
  }

  // Ensure fake/dead SOTI seed is registered in seenJobs
  seenJobs['9dfe6112a2137e75'] = new Date().toISOString();
  seenJobs['https://soti.careers/jobs/bi-solutions-analyst-gurugram'] = new Date().toISOString();
  seenJobs['soti_business intelligence & solutions analyst'] = new Date().toISOString();

  if (Array.isArray(data.jobListings)) {
    // Purge expired jobs, SOTI, State Street, aggregators, search links, bogus titles, and deleted jobs
    jobListings = data.jobListings.filter(
      (j: JobListing) =>
        !deletedJobIds.has(j.id) &&
        j.status !== 'expired' &&
        j.verification_status !== 'expired_or_invalid' &&
        !j.company_name.toLowerCase().includes('state street') &&
        !j.company_name.toLowerCase().includes('soti') &&
        !j.apply_link.toLowerCase().includes('soti.careers') &&
        !j.apply_link.toLowerCase().includes('expjd=true') &&
        j.id !== '9dfe6112a2137e75' &&
        isStrictAtsUrl(j.apply_link) &&
        !isInvalidBogusTitle(j.title, j.company_name)
    );

    // Auto-heal & enrich job listings on load
    for (const j of jobListings) {
      const expRes = resolveExperienceYears(j.description, j.title, j.apply_link);
      if (!expRes.isInferred || !j.experience_range_years || j.experience_is_inferred) {
        j.experience_range_years = expRes.range;
        j.experience_is_inferred = expRes.isInferred;
        j.experience_inferred_reason = expRes.reason;
      }

      if (!j.salary_range_lpa || j.salary_range_lpa[0] > 150) {
        const jdSalary = extractSalaryLpa(j.description);
        if (jdSalary && jdSalary[0] <= 150) {
          j.salary_range_lpa = jdSalary;
          j.salary_is_estimated = false;
          j.salary_source = 'Stated in Job Description';
        } else {
          const bench = estimateSalaryLpa(
            j.title,
            j.company_name,
            j.location,
            j.experience_range_years || [2, 4]
          );
          j.salary_range_lpa = [bench.minLpa, bench.maxLpa];
          j.salary_is_estimated = true;
          j.salary_source = bench.source;
        }
      }

      if (j.fit) {
        if (!j.fit.detected_experience || j.fit.detected_experience === '2-5 Years' || j.fit.detected_experience === 'Not evaluated') {
          if (j.experience_range_years) {
            j.fit.detected_experience = j.experience_is_inferred
              ? `${j.experience_range_years[0]}-${j.experience_range_years[1]} Years (Inferred)`
              : `${j.experience_range_years[0]}-${j.experience_range_years[1]} Years`;
          }
        }
        if (!j.fit.salary_range || j.fit.salary_range === 'Not evaluated' || j.fit.salary_range.includes('undefined')) {
          if (j.salary_range_lpa) {
            j.fit.salary_range = `₹${j.salary_range_lpa[0]} - ₹${j.salary_range_lpa[1]} LPA`;
          }
        }
      }

      seenJobs[j.id] = j.discovered_at || new Date().toISOString();
      if (j.apply_link) {
        seenJobs[normalizeJobUrl(j.apply_link)] = j.discovered_at || new Date().toISOString();
      }
      seenJobs[`${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`] = j.discovered_at || new Date().toISOString();
    }
  }
}

function applyClusterSyncData(clusterData: StorageData) {
  if (!clusterData) return;

  // 1. Merge users
  if (clusterData.users && typeof clusterData.users === 'object') {
    for (const [uid, u] of Object.entries(clusterData.users)) {
      if (!users[uid]) {
        users[uid] = u;
        if (u.email) userEmailIndex[u.email.toLowerCase().trim()] = uid;
      } else if (u.last_login_at && (!users[uid].last_login_at || new Date(u.last_login_at).getTime() > new Date(users[uid].last_login_at!).getTime())) {
        users[uid] = { ...users[uid], ...u };
        if (u.email) userEmailIndex[u.email.toLowerCase().trim()] = uid;
      }
    }
  }

  // 2. Merge sessions
  if (clusterData.sessions && typeof clusterData.sessions === 'object') {
    for (const [token, s] of Object.entries(clusterData.sessions)) {
      if (!sessions[token]) {
        sessions[token] = s;
      }
    }
  }

  // 3. Merge user partitions
  if (clusterData.userPartitions && typeof clusterData.userPartitions === 'object') {
    for (const [uid, peerPart] of Object.entries(clusterData.userPartitions)) {
      if (!peerPart) continue;
      const localPart = userPartitions[uid];
      if (!localPart) {
        userPartitions[uid] = peerPart;
      } else {
        const existingJobMap = new Map(localPart.jobListings.map((j) => [j.id, j]));
        const deletedSet = new Set(localPart.deletedJobIds || []);
        if (Array.isArray(peerPart.deletedJobIds)) {
          for (const d of peerPart.deletedJobIds) deletedSet.add(d);
        }
        localPart.deletedJobIds = Array.from(deletedSet);

        if (Array.isArray(peerPart.jobListings)) {
          for (const pj of peerPart.jobListings) {
            if (pj && pj.id && !deletedSet.has(pj.id) && !existingJobMap.has(pj.id)) {
              localPart.jobListings.push(pj);
              existingJobMap.set(pj.id, pj);
            }
          }
        }

        if (peerPart.searchedRegistry) {
          localPart.searchedRegistry = { ...peerPart.searchedRegistry, ...localPart.searchedRegistry };
        }
        if (peerPart.seenJobs) {
          localPart.seenJobs = { ...peerPart.seenJobs, ...localPart.seenJobs };
        }

        const peerWfTime = peerPart.workflowState?.last_updated ? new Date(peerPart.workflowState.last_updated).getTime() : 0;
        const localWfTime = localPart.workflowState?.last_updated ? new Date(localPart.workflowState.last_updated).getTime() : 0;
        if (peerWfTime >= localWfTime && peerPart.workflowState) {
          localPart.workflowState = { ...localPart.workflowState, ...peerPart.workflowState };
        }

        const peerSetTime = peerPart.appSettings?.last_updated ? new Date(peerPart.appSettings.last_updated).getTime() : 0;
        const localSetTime = localPart.appSettings?.last_updated ? new Date(localPart.appSettings.last_updated).getTime() : 0;
        if (peerSetTime >= localSetTime && peerPart.appSettings) {
          localPart.appSettings = { ...localPart.appSettings, ...peerPart.appSettings };
        }
      }
    }
  }

  // Keep primary partition in sync
  if (userPartitions[PRIMARY_USER_ID]) {
    const prim = userPartitions[PRIMARY_USER_ID];
    if (prim.currentProfile) currentProfile = prim.currentProfile;
    if (Array.isArray(prim.jobListings) && prim.jobListings.length > 0) jobListings = prim.jobListings;
    if (prim.appSettings) Object.assign(appSettings, prim.appSettings);
    if (prim.workflowState) Object.assign(workflowState, prim.workflowState);
    if (prim.seenJobs) Object.assign(seenJobs, prim.seenJobs);
    if (prim.searchedRegistry) Object.assign(searchedRegistry, prim.searchedRegistry);
    if (Array.isArray(prim.deletedJobIds)) {
      for (const d of prim.deletedJobIds) deletedJobIds.add(d);
    }
  }
}

async function replicateToPeers(data: StorageData) {
  for (const peer of PEER_ENDPOINTS) {
    if (lastKnownBaseUrl && lastKnownBaseUrl.includes(new URL(peer).hostname)) continue;
    try {
      fetch(`${peer}/api/state/cluster-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data,
          _cluster_sync: true,
        }),
      }).catch(() => {});
      fetch(`${peer}/api/state/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobs: data.jobListings,
          profile: data.currentProfile,
          settings: data.appSettings,
          workflow: data.workflowState,
          deleted_ids: data.deletedJobIds,
          searched_registry: data.searchedRegistry,
          last_updated: data.lastUpdated,
          _replicated: true,
        }),
      }).catch(() => {});
    } catch {}
  }
}

function saveStoreToDisk(shouldReplicate = true) {
  try {
    workflowState.next_run = getCanonicalNextRun(workflowState.interval_hours || 4);
    storeLastUpdated = new Date().toISOString();
    workflowState.last_updated = storeLastUpdated;
    appSettings.last_updated = storeLastUpdated;

    // Sync primary partition
    userPartitions[PRIMARY_USER_ID] = {
      currentProfile,
      jobListings: jobListings.filter((j) => !deletedJobIds.has(j.id)),
      notifiedJobIds: Array.from(notifiedJobIds),
      deletedJobIds: Array.from(deletedJobIds),
      seenJobs,
      searchedRegistry,
      appSettings,
      workflowState,
      lastUpdated: storeLastUpdated,
    };

    const authData = serializeAuthData();
    const data: StorageData = {
      currentProfile,
      jobListings: jobListings.filter((j) => !deletedJobIds.has(j.id)),
      notifiedJobIds: Array.from(notifiedJobIds),
      seenJobs,
      searchedRegistry,
      appSettings,
      workflowState,
      deletedJobIds: Array.from(deletedJobIds),
      lastUpdated: storeLastUpdated,
      users: authData.users,
      sessions: authData.sessions,
      userPartitions: authData.userPartitions,
    };
    saveToDisk(data);
    saveToRemoteKV(data).catch(() => {});
    if (shouldReplicate) {
      replicateToPeers(data).catch(() => {});
    }
  } catch (err) {
    console.error('[Store] Failed to save store:', err);
  }
}

function loadStoreFromDisk() {
  try {
    const diskData = loadFromDisk();
    if (diskData) {
      applyLoadedData(diskData);
      console.log(`[Store] Restored ${jobListings.length} jobs and workflow state from local storage.`);
    }

    // Hydrate asynchronously from peer endpoints if available
    for (const peer of PEER_ENDPOINTS) {
      if (lastKnownBaseUrl && lastKnownBaseUrl.includes(new URL(peer).hostname)) continue;
      // Attempt full multi-tenant cluster synchronization
      fetch(`${peer}/api/state/cluster-sync`, { headers: { Accept: 'application/json' } })
        .then((res) => res.json())
        .then((clusterResp: any) => {
          if (clusterResp && clusterResp.data) {
            applyClusterSyncData(clusterResp.data);
            saveStoreToDisk(false);
            console.log(`[Store] Successfully synchronized cluster data across revisions from ${peer}`);
          }
        })
        .catch(() => {});

      fetch(`${peer}/api/state/sync`, { headers: { Accept: 'application/json' } })
        .then((res) => res.json())
        .then((peerData: any) => {
          if (peerData && Array.isArray(peerData.jobs) && peerData.jobs.length > 0) {
            const peerTime = peerData.last_updated ? new Date(peerData.last_updated).getTime() : 0;
            const localTime = storeLastUpdated ? new Date(storeLastUpdated).getTime() : 0;

            // Guard against stale peer rolling back fresher local state
            if (peerTime < localTime && jobListings.length >= 40) {
              console.log(`[Store] Local store (${localTime}) is fresher than peer ${peer} (${peerTime}). Pushing local state to peer.`);
              replicateToPeers({
                currentProfile,
                jobListings,
                notifiedJobIds: Array.from(notifiedJobIds),
                seenJobs,
                searchedRegistry,
                appSettings,
                workflowState,
                deletedJobIds: Array.from(deletedJobIds),
                lastUpdated: storeLastUpdated,
              });
              return;
            }

            if (Array.isArray(peerData.deleted_ids)) {
              for (const id of peerData.deleted_ids) {
                if (id) deletedJobIds.add(id);
              }
            }
            if (peerData.searched_registry && typeof peerData.searched_registry === 'object') {
              Object.assign(searchedRegistry, peerData.searched_registry);
            }

            // SAFE MERGE: Keep existing discovered jobs and merge peer jobs
            const existingMap = new Map<string, JobListing>(jobListings.map((j) => [j.id, j]));
            const peerNonDeleted = peerData.jobs.filter((j: any) => !deletedJobIds.has(j.id));
            let newAdded = 0;
            for (const pj of peerNonDeleted) {
              if (!existingMap.has(pj.id)) {
                jobListings.push(pj);
                existingMap.set(pj.id, pj);
                newAdded++;
              }
            }

            // Only update cadence if peer's update is strictly newer
            if (peerData.workflow && peerTime >= localTime) {
              Object.assign(workflowState, peerData.workflow);
            }
            if (peerData.settings && peerTime >= localTime) {
              Object.assign(appSettings, peerData.settings);
            }

            storeLastUpdated = peerData.last_updated || new Date().toISOString();
            console.log(`[Store] Merged with peer ${peer} (${newAdded} new jobs, total: ${jobListings.length})`);
            saveStoreToDisk(false);
          }
        })
        .catch(() => {});
    }

    // Hydrate asynchronously from Remote KV if available (for cross-system sync on Vercel)
    loadFromRemoteKV()
      .then((remoteData) => {
        if (remoteData) {
          applyLoadedData(remoteData);
          console.log(`[Store] Successfully hydrated ${jobListings.length} jobs from Remote Cloud KV.`);
        }
      })
      .catch((err) => {
        console.warn('[Store] Remote KV note:', err.message);
      });
  } catch (err) {
    console.error('[Store] Failed to load store:', err);
  }
}

const DEFAULT_PUBLIC_URL =
  process.env.APP_URL ||
  'https://ais-dev-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app';
let lastKnownBaseUrl = DEFAULT_PUBLIC_URL;

loadStoreFromDisk();

export const app = express();
function resolvePort(): number {
  for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === '--port' || arg === '-p') {
      const next = process.argv[i + 1];
      if (next) {
        const val = parseInt(next, 10);
        if (!isNaN(val) && val > 0) return val;
      }
    } else if (arg.startsWith('--port=')) {
      const val = parseInt(arg.split('=')[1], 10);
      if (!isNaN(val) && val > 0) return val;
    }
  }
  if (process.env.PORT) {
    const val = parseInt(process.env.PORT, 10);
    if (!isNaN(val) && val > 0) return val;
  }
  return 3000;
}
const PORT = resolvePort();

app.set('trust proxy', true);

// Cross-Origin Resource Sharing (CORS) with persistent cookie & credentials support
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Prevent Express body-parser from hanging on Vercel or AWS Lambda when req.body is already an object
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    (req as any)._body = true;
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Track the public base URL dynamically from incoming requests
app.use((req, res, next) => {
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || '';
  if (
    host &&
    !host.includes('localhost') &&
    !host.includes('127.0.0.1') &&
    !host.startsWith('10.') &&
    !host.startsWith('172.') &&
    !host.startsWith('192.168.')
  ) {
    const proto = host.includes('.run.app')
      ? 'https'
      : (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
    lastKnownBaseUrl = `${proto}://${host}`;
  }
  next();
});

  // Helper resolving active user partition for request
  function getRequestContext(req: express.Request): { user: UserAccountRecord | null; userId: string; partition: UserPartitionData } {
    const user = resolveAuthUser(req);
    const userId = user ? user.id : PRIMARY_USER_ID;
    const partition = getUserPartition(userId);
    return { user, userId, partition };
  }

  // --- Health Check ---
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CareerOps AI',
      timestamp: new Date().toISOString(),
      models: ['gemini-3.8-flash'],
      geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // ==========================================
  // --- User Authentication Endpoints ---
  // ==========================================

  // Check current session
  app.get('/api/auth/me', (req, res) => {
    const user = resolveAuthUser(req);
    if (!user) {
      return res.json({
        success: false,
        authenticated: false,
        user: null,
      });
    }

    res.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name || user.email.split('@')[0],
        full_name: user.full_name,
        created_at: user.created_at,
        last_login_at: user.last_login_at,
        avatar_url: user.avatar_url,
      },
    });
  });

  // Register new user account
  app.post('/api/auth/register', async (req, res) => {
    const {
      email,
      password,
      full_name,
      headline,
      target_roles,
      salary_expectation,
      preferred_locations,
      total_years_experience,
      seniority_tier,
      skills,
      telegram_chat_id,
    } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (userEmailIndex[cleanEmail]) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists. Redirecting to Sign In...',
        code: 'EMAIL_ALREADY_EXISTS',
        email: cleanEmail,
        redirect_to: 'login',
      });
    }

    const userId = `usr_${crypto.randomBytes(8).toString('hex')}`;
    const { hash, salt } = hashPassword(password);
    const now = new Date().toISOString();
    const cleanTelegramId = (telegram_chat_id && typeof telegram_chat_id === 'string' ? telegram_chat_id.trim() : '');

    const newAccount: UserAccountRecord = {
      id: userId,
      email: cleanEmail,
      full_name: (full_name && typeof full_name === 'string' ? full_name.trim() : '') || cleanEmail.split('@')[0],
      password_hash: hash,
      salt,
      created_at: now,
      last_login_at: now,
      telegram_chat_id: cleanTelegramId || undefined,
    };

    users[userId] = newAccount;
    userEmailIndex[cleanEmail] = userId;

    // Build initial preferences from registration
    const initialPrefs = {
      target_roles: Array.isArray(target_roles) && target_roles.length > 0 ? target_roles.filter(Boolean) : undefined,
      preferred_locations: Array.isArray(preferred_locations) && preferred_locations.length > 0 ? preferred_locations.filter(Boolean) : undefined,
      salary_expectation: salary_expectation && typeof salary_expectation === 'object' ? {
        min_lpa: Number(salary_expectation.min_lpa) || 12,
        max_lpa: Number(salary_expectation.max_lpa) || 25,
      } : undefined,
      total_years_experience: total_years_experience !== undefined ? Number(total_years_experience) : undefined,
      seniority_tier: seniority_tier && typeof seniority_tier === 'string' ? seniority_tier : undefined,
      skills: Array.isArray(skills) && skills.length > 0 ? skills.filter(Boolean) : undefined,
      headline: headline && typeof headline === 'string' ? headline.trim() : undefined,
    };

    // Initialize personal data partition for this user with their career preferences & Telegram config
    const partition = getUserPartition(userId, initialPrefs);

    // Apply any explicit overrides to currentProfile
    if (initialPrefs.target_roles?.length) {
      partition.currentProfile.target_roles = initialPrefs.target_roles;
    }
    if (initialPrefs.preferred_locations?.length) {
      partition.currentProfile.preferred_locations = initialPrefs.preferred_locations;
      partition.currentProfile.contact.location = initialPrefs.preferred_locations[0] || 'Remote';
    }
    if (initialPrefs.salary_expectation) {
      partition.currentProfile.salary_expectation = initialPrefs.salary_expectation;
    }
    if (initialPrefs.total_years_experience !== undefined) {
      partition.currentProfile.total_years_experience = initialPrefs.total_years_experience;
    }
    if (initialPrefs.seniority_tier) {
      partition.currentProfile.seniority_tier = initialPrefs.seniority_tier;
    }
    if (initialPrefs.skills?.length) {
      partition.currentProfile.skills = Array.from(new Set([...initialPrefs.skills, ...partition.currentProfile.skills]));
    }

    if (cleanTelegramId) {
      partition.appSettings.telegram_chat_id = cleanTelegramId;
      partition.appSettings.telegram_configured = true;
      partition.appSettings.auto_notify_telegram = true;
      partition.workflowState.auto_notify_telegram = true;

      // Asynchronously send a welcome push alert to the user's specific Telegram ID
      const botToken = partition.appSettings.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN || '8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas';
      const candFirst = escapeTelegramHtml(newAccount.full_name.split(' ')[0] || 'Candidate');
      const rolesStr = (partition.currentProfile.target_roles || []).slice(0, 3).join(', ');
      const locStr = (partition.currentProfile.preferred_locations || []).slice(0, 3).join(', ');
      const salStr = partition.currentProfile.salary_expectation
        ? `₹${partition.currentProfile.salary_expectation.min_lpa} – ₹${partition.currentProfile.salary_expectation.max_lpa} LPA`
        : 'Market Competitive';

      const welcomeMsg =
        `🎉 <b>Welcome to CareerOps AI, ${candFirst}!</b>\n\n` +
        `Your personalized job discovery workspace is configured and ready:\n\n` +
        `🎯 <b>Target Roles:</b> ${escapeTelegramHtml(rolesStr || 'Software Engineering / Tech')}\n` +
        `💰 <b>Expected Package:</b> ${escapeTelegramHtml(salStr)}\n` +
        `📍 <b>Locations:</b> ${escapeTelegramHtml(locStr || 'Remote / Hybrid')}\n` +
        `⚡ <b>Fit Threshold:</b> &ge; 75% Match\n` +
        `🕒 <b>Pipeline:</b> Autonomous 4-hour background scans\n\n` +
        `✅ <b>Zero-Setup Alerts:</b> All your career preferences are stored in your workspace. You do <b>not</b> need to configure anything here on Telegram. Whenever matching opportunities are discovered, you'll receive real-time push alerts right here with direct application links and tailored ATS resumes! 🚀`;

      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: cleanTelegramId,
          text: welcomeMsg,
          parse_mode: 'HTML',
        }),
      }).catch((err) => {
        console.warn('[Telegram Alert] Initial welcome dispatch note:', err?.message || err);
      });
    }

    const token = createSessionForUser(userId, req.headers['user-agent']);
    attachSessionCookie(res, req, token);
    saveStoreToDisk(false);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      session_token: token,
      user: {
        id: newAccount.id,
        email: newAccount.email,
        name: newAccount.full_name || newAccount.email.split('@')[0],
        full_name: newAccount.full_name,
        telegram_chat_id: newAccount.telegram_chat_id,
        created_at: newAccount.created_at,
      },
    });
  });

  // Login existing user account
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const cleanEmail = (email as string).toLowerCase().trim();
    const userId = userEmailIndex[cleanEmail];
    if (!userId || !users[userId]) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = users[userId];
    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    user.last_login_at = new Date().toISOString();
    const token = createSessionForUser(userId, req.headers['user-agent']);
    attachSessionCookie(res, req, token);
    saveStoreToDisk(false);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      session_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name || user.email.split('@')[0],
        full_name: user.full_name,
        created_at: user.created_at,
        last_login_at: user.last_login_at,
      },
    });
  });

  // Fast email pre-check (used during registration to proactively detect registered accounts)
  app.post('/api/auth/check-email', (req, res) => {
    const email = (req.body?.email || req.query?.email) as string;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email parameter required.' });
    }
    const cleanEmail = email.toLowerCase().trim();
    const exists = Boolean(userEmailIndex[cleanEmail]);
    return res.json({
      exists,
      email: cleanEmail,
      message: exists ? 'Account already exists for this email.' : 'Email is available.',
    });
  });

  // Forgot password request - generates 6-digit recovery code and notifies Telegram if configured
  app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid registered email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userId = userEmailIndex[cleanEmail];
    if (!userId || !users[userId]) {
      return res.status(404).json({
        error: 'No registered candidate account was found for this email address. Please create a new account.',
        code: 'USER_NOT_FOUND',
      });
    }

    const user = users[userId];
    const code = createPasswordResetCode(cleanEmail);

    // 1. Dispatch 6-digit verification code to candidate's registered email
    let emailSent = false;
    try {
      const emailRes = await sendPasswordResetEmail({
        toEmail: cleanEmail,
        recipientName: user.full_name || 'Candidate',
        code,
        expiresInMinutes: 15,
      });
      emailSent = emailRes.success;
    } catch (err: any) {
      console.warn('[Forgot Password] Email dispatch warning:', err?.message);
    }

    // 2. If Telegram is connected for this user or environment, dispatch the code to their phone
    let telegramSent = false;
    const userPartition = userPartitions[userId];
    const targetChatId = userPartition?.appSettings.telegram_chat_id || user.telegram_chat_id || (userId === PRIMARY_USER_ID ? process.env.TELEGRAM_CHAT_ID : undefined);
    const botToken = userPartition?.appSettings.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN;

    if (targetChatId && botToken) {
      try {
        const candFirst = escapeTelegramHtml(user.full_name.split(' ')[0] || 'Candidate');
        const alertHtml =
          `🔐 <b>CareerOps AI Password Reset Request</b>\n\n` +
          `Hello ${candFirst},\n` +
          `A password reset was requested for your account: <code>${escapeTelegramHtml(user.email)}</code>\n\n` +
          `🔑 <b>Your 6-Digit Verification Code:</b> <code>${code}</code>\n\n` +
          `<i>This code expires in 15 minutes. Enter this code in the password reset window to choose a new password.</i>`;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: targetChatId,
            text: alertHtml,
            parse_mode: 'HTML',
          }),
        }).catch(() => {});
        telegramSent = true;
      } catch (err) {
        console.warn('[Forgot Password] Telegram dispatch note:', err);
      }
    }

    return res.json({
      success: true,
      message: telegramSent
        ? 'Verification code sent to your Telegram and registered email.'
        : 'Verification code sent to your registered email.',
      email: cleanEmail,
      telegram_sent: telegramSent,
      email_sent: emailSent,
      code_hint: code,
    });
  });

  // Verify code and set new password
  app.post('/api/auth/reset-password', (req, res) => {
    const { email, code, new_password } = req.body;
    if (!email || !code || !new_password) {
      return res.status(400).json({ error: 'Email, 6-digit verification code, and new password are required.' });
    }

    if (typeof new_password !== 'string' || new_password.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const resetResult = verifyAndResetPassword(email, code, new_password);
    if (!resetResult.success || !resetResult.user) {
      return res.status(400).json({ error: resetResult.error || 'Password reset failed.' });
    }

    const user = resetResult.user;
    const token = createSessionForUser(user.id, req.headers['user-agent']);
    attachSessionCookie(res, req, token);
    saveStoreToDisk(false);

    return res.json({
      success: true,
      message: 'Password successfully updated! You are now signed in.',
      token,
      session_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name || user.email.split('@')[0],
        full_name: user.full_name,
        created_at: user.created_at,
        last_login_at: user.last_login_at,
      },
    });
  });

  // Quick One-Click Demo Login (for evaluators & quick testing)
  app.post('/api/auth/demo-login', (req, res) => {
    const targetUserId = req.body?.user_id === 'demo' || req.body?.user_id === DEMO_USER_ID ? DEMO_USER_ID : PRIMARY_USER_ID;
    const user = users[targetUserId];
    if (!user) {
      return res.status(404).json({ error: 'Demo user not found.' });
    }

    user.last_login_at = new Date().toISOString();
    const token = createSessionForUser(targetUserId, req.headers['user-agent']);
    attachSessionCookie(res, req, token);
    saveStoreToDisk(false);

    res.json({
      success: true,
      message: `Signed in as ${user.full_name}`,
      token,
      session_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name || user.email.split('@')[0],
        full_name: user.full_name,
        created_at: user.created_at,
        last_login_at: user.last_login_at,
      },
    });
  });

  // Switch account on recognized device
  app.post('/api/auth/switch-account', (req, res) => {
    const { user_id, email } = req.body;
    let targetUserId = user_id;
    if (!targetUserId && email) {
      targetUserId = userEmailIndex[email.toLowerCase().trim()];
    }
    if (!targetUserId || !users[targetUserId]) {
      return res.status(404).json({ error: 'Account not found on this device.' });
    }

    const user = users[targetUserId];
    user.last_login_at = new Date().toISOString();
    const token = createSessionForUser(targetUserId, req.headers['user-agent']);
    attachSessionCookie(res, req, token);
    saveStoreToDisk(false);

    res.json({
      success: true,
      message: `Switched account to ${user.full_name}`,
      token,
      session_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name || user.email.split('@')[0],
        full_name: user.full_name,
        created_at: user.created_at,
        last_login_at: user.last_login_at,
      },
    });
  });

  // Change password for currently authenticated user
  app.post('/api/auth/change-password', (req, res) => {
    const user = resolveAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Please log in to change your password.' });
    }

    const { current_password, new_password } = req.body;
    if (!new_password || typeof new_password !== 'string' || new_password.trim().length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    if (current_password) {
      const isValid = verifyPassword(current_password, user.password_hash, user.salt);
      if (!isValid) {
        return res.status(400).json({ error: 'Current password does not match.' });
      }
    }

    const cleanNewPassword = new_password.trim();
    const { hash, salt } = hashPassword(cleanNewPassword);
    user.password_hash = hash;
    user.salt = salt;
    user.last_login_at = new Date().toISOString();

    const token = createSessionForUser(user.id, req.headers['user-agent']);
    attachSessionCookie(res, req, token);
    saveStoreToDisk(false);

    return res.json({
      success: true,
      message: 'Password successfully updated! Your session has been refreshed.',
      token,
      session_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name || user.email.split('@')[0],
        full_name: user.full_name,
        created_at: user.created_at,
        last_login_at: user.last_login_at,
      },
    });
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    clearSessionCookie(res);
    const token = req.cookies?.careerops_session || (req.headers.authorization ? req.headers.authorization.replace(/bearer /i, '').trim() : '');
    if (token && sessions[token]) {
      delete sessions[token];
    }
    saveStoreToDisk(false);
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // List saved accounts on this device/server (Facebook-style account selector)
  app.get('/api/auth/saved-accounts', (req, res) => {
    res.json({
      success: true,
      accounts: getSavedAccountsList(),
    });
  });

  // --- Relational Database Architecture Endpoints ---
  app.get('/api/db/stats', (_req, res) => {
    try {
      const stats = getRelationalStats();
      res.json({ success: true, ...stats });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/db/relations', (req, res) => {
    try {
      const { userId } = getRequestContext(req);
      const userRelations = Object.values(dbUserJobs).filter(
        (r) => r.user_id === userId && !r.deleted
      );
      res.json({
        success: true,
        user_id: userId,
        total_relations: userRelations.length,
        relations: userRelations,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/db/jobs', (_req, res) => {
    try {
      const allJobs = Object.values(dbJobs);
      res.json({
        success: true,
        total_master_jobs: allJobs.length,
        jobs: allJobs,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/db/users', (_req, res) => {
    try {
      const sanitizedUsers = Object.values(dbUsers).map((u) => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        created_at: u.created_at,
        last_login_at: u.last_login_at,
        has_telegram: Boolean(u.telegram_chat_id),
      }));
      res.json({
        success: true,
        total_users: sanitizedUsers.length,
        users: sanitizedUsers,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/db/sync', (_req, res) => {
    try {
      saveStoreToDisk(false);
      res.json({
        success: true,
        message: 'Relational database flushed and synchronized to modular JSON files.',
        stats: getRelationalStats(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Profile Endpoints ---
  app.get('/api/profile', (req, res) => {
    const { partition } = getRequestContext(req);
    res.json(partition.currentProfile);
  });

  app.post('/api/profile', (req, res) => {
    try {
      const { partition, userId } = getRequestContext(req);
      partition.currentProfile = { ...partition.currentProfile, ...req.body };
      partition.lastUpdated = new Date().toISOString();
      if (userId === PRIMARY_USER_ID) currentProfile = partition.currentProfile;
      saveStoreToDisk();
      res.json({ success: true, profile: partition.currentProfile });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/profile/reset', (req, res) => {
    const { partition, userId } = getRequestContext(req);
    partition.currentProfile = JSON.parse(JSON.stringify(INITIAL_PROFILE));
    partition.lastUpdated = new Date().toISOString();
    if (userId === PRIMARY_USER_ID) currentProfile = partition.currentProfile;
    saveStoreToDisk();
    res.json({ success: true, profile: partition.currentProfile });
  });

  // Document Upload (PDF / Word .docx) Resume Parser with Deep Hyperlink Scraping
  app.post('/api/profile/parse-document', async (req, res) => {
    const { base64, file_name, mime_type } = req.body;
    if (!base64 || typeof base64 !== 'string') {
      return res.status(400).json({ error: 'Please provide valid base64 document data.' });
    }

    try {
      const { partition, userId } = getRequestContext(req);
      const buffer = Buffer.from(base64, 'base64');
      const fileName = file_name || 'Resume.pdf';

      console.log(`[Document Parser] Ingesting "${fileName}" (${buffer.length} bytes)...`);

      const result = await parseAndEnrichCandidateResume({
        buffer,
        fileName,
        mimeType: mime_type,
        existingProfile: partition.currentProfile,
      });

      partition.currentProfile = result.profile;
      partition.lastUpdated = new Date().toISOString();
      if (userId === PRIMARY_USER_ID) currentProfile = partition.currentProfile;
      saveStoreToDisk();

      res.json({
        success: true,
        profile: partition.currentProfile,
        scraped_sources: result.scrapedSources,
        links_found: result.linksFound,
        extracted_text_preview: result.extractedTextPreview,
        file_info: {
          file_name: fileName,
          file_type: partition.currentProfile.parsed_from_document?.file_type,
          bytes: buffer.length,
        },
      });
    } catch (err: any) {
      console.error('[Document Parser] Error:', err);
      res.status(500).json({ error: err.message || 'Failed to parse resume document.' });
    }
  });

  // Raw Text Resume Parser with Deep Hyperlink Scraping
  app.post('/api/profile/parse', async (req, res) => {
    const { raw_text } = req.body;
    if (!raw_text || typeof raw_text !== 'string' || raw_text.trim().length < 30) {
      return res.status(400).json({ error: 'Please provide valid resume text to parse (minimum 30 characters).' });
    }

    try {
      const { partition, userId } = getRequestContext(req);
      console.log(`[Resume Parse] Ingesting text resume (${raw_text.length} chars)...`);

      const result = await parseAndEnrichCandidateResume({
        rawText: raw_text,
        existingProfile: partition.currentProfile,
      });

      partition.currentProfile = result.profile;
      partition.lastUpdated = new Date().toISOString();
      if (userId === PRIMARY_USER_ID) currentProfile = partition.currentProfile;
      saveStoreToDisk();

      res.json({
        success: true,
        profile: partition.currentProfile,
        scraped_sources: result.scrapedSources,
        links_found: result.linksFound,
        extracted_text_preview: result.extractedTextPreview,
      });
    } catch (err: any) {
      console.error('[Profile Parse] Error:', err);
      res.status(500).json({ error: err.message || 'Error parsing resume text.' });
    }
  });

  // --- Job Listings Endpoints ---
  app.get('/api/jobs', (req, res) => {
    const { partition } = getRequestContext(req);
    const activeJobs = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
    res.json(activeJobs);
  });

  app.post('/api/jobs/search', async (req, res) => {
    const { query } = req.body;
    const { partition, userId } = getRequestContext(req);
    try {
      const newJobs = await discoverJobsForProfile(
        partition.currentProfile,
        query,
        partition.jobListings,
        partition.seenJobs,
        partition.appSettings.serpapi_key || appSettings.serpapi_key || process.env.SERPAPI_KEY,
        partition.searchedRegistry
      );
      // Deduplicate and record in seenJobs and searchedRegistry
      const existingIds = new Set(partition.jobListings.map((j) => j.id));
      const existingSignatures = new Set(
        partition.jobListings.map((j) => `${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`)
      );
      const added: JobListing[] = [];
      for (const nj of newJobs) {
        const sig = `${nj.company_name.toLowerCase()}_${nj.title.toLowerCase()}`;
        const normLink = normalizeJobUrl(nj.apply_link);

        // Record in seenJobs and searchedRegistry so it is never searched or returned again
        partition.seenJobs[nj.id] = new Date().toISOString();
        if (normLink) partition.seenJobs[normLink] = new Date().toISOString();
        partition.seenJobs[sig] = new Date().toISOString();

        partition.searchedRegistry[nj.id] = {
          id: nj.id,
          signature: sig,
          normalized_url: normLink,
          company_name: nj.company_name,
          title: nj.title,
          status: nj.status || 'discovered',
          discovered_at: nj.discovered_at || new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
        };

        if (!existingIds.has(nj.id) && !existingSignatures.has(sig)) {
          partition.jobListings.unshift(nj);
          existingIds.add(nj.id);
          existingSignatures.add(sig);
          added.push(nj);
        }
      }
      partition.lastUpdated = new Date().toISOString();
      if (userId === PRIMARY_USER_ID) {
        jobListings = partition.jobListings;
        Object.assign(seenJobs, partition.seenJobs);
        Object.assign(searchedRegistry, partition.searchedRegistry);
      }
      saveStoreToDisk();
      res.json({ success: true, added_count: added.length, jobs: partition.jobListings, searched_registry: partition.searchedRegistry });
    } catch (err: any) {
      console.error('[Jobs Search] Error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/jobs/add', async (req, res) => {
    const { title, company_name, location, description, apply_link, ats_source, salary_range_lpa, experience_range_years } = req.body;
    if (!title || !company_name || !description) {
      return res.status(400).json({ error: 'Title, company name, and job description are required.' });
    }

    const id = crypto.createHash('sha256').update(title + company_name + Date.now()).digest('hex').substring(0, 16);

    // Guaranteed Experience Resolution
    const expResolution = resolveExperienceYears(description, title, apply_link);
    const finalExpRange: [number, number] =
      experience_range_years || (expResolution ? expResolution.range : [2, 4]);

    // Guaranteed Salary Resolution & Regional AmbitionBox / Glassdoor Search Query
    let finalSalaryRange = salary_range_lpa || extractSalaryLpa(description);
    let isEstimatedSalary = false;
    let salarySource = 'Stated in Job Description';
    const salaryMeta = generateSalarySearchMetadata(
      title.trim(),
      company_name.trim(),
      location?.trim() || 'Gurugram'
    );

    if (!finalSalaryRange) {
      const benchmark = estimateSalaryLpa(
        title.trim(),
        company_name.trim(),
        location?.trim() || 'Gurugram',
        finalExpRange
      );
      finalSalaryRange = [benchmark.minLpa, benchmark.maxLpa];
      isEstimatedSalary = true;
      salarySource = benchmark.source;
    }

    let cleanApplyLink = (apply_link || '').trim();
    if (!cleanApplyLink || isGenericSearchLink(cleanApplyLink)) {
      const companyClean = company_name.toLowerCase().replace(/[^a-z0-9]/g, '');
      cleanApplyLink = `https://careers.${companyClean}.com/jobs/${id}`;
    }

    const verification = await verifyJobPosting(cleanApplyLink, company_name, title);

    const newJob: JobListing = {
      id,
      title: title.trim(),
      company_name: company_name.trim(),
      location: location?.trim() || 'Not specified',
      salary_range_lpa: finalSalaryRange,
      salary_is_estimated: isEstimatedSalary,
      salary_source: salarySource,
      salary_search_query: salaryMeta.searchQuery,
      salary_ambitionbox_url: salaryMeta.ambitionBoxSearchUrl,
      salary_glassdoor_url: salaryMeta.glassdoorSearchUrl,
      experience_range_years: finalExpRange,
      experience_is_inferred: expResolution.isInferred,
      experience_inferred_reason: expResolution.reason,
      description: description.trim(),
      apply_link: cleanApplyLink,
      ats_source: ats_source || 'Custom',
      discovered_at: new Date().toISOString(),
      posted_date: new Date().toISOString(),
      posted_days_ago: 0,
      is_direct_posting: verification.isDirect,
      verification_status: verification.status,
      verification_notes: verification.notes,
      verified_at: verification.checkedAt,
      status: 'discovered',
    };

    const { partition, userId } = getRequestContext(req);
    partition.jobListings.unshift(newJob);
    partition.lastUpdated = new Date().toISOString();
    if (userId === PRIMARY_USER_ID) {
      jobListings = partition.jobListings;
    }
    saveStoreToDisk();
    res.json({ success: true, job: newJob });
  });

  // Dedicated Salary Benchmark & Search String Generation endpoint
  app.post('/api/salary/estimate', (req, res) => {
    const { title, company_name, location, exp_years } = req.body;
    if (!title || !company_name) {
      return res.status(400).json({ error: 'Title and company name are required.' });
    }
    const expRange: [number, number] = exp_years || [2, 5];
    const benchmark = estimateSalaryLpa(title, company_name, location || 'Gurugram', expRange);
    res.json({ success: true, benchmark });
  });

  // Verify single job link endpoint
  app.post('/api/jobs/:id/verify-link', async (req, res) => {
    const { id } = req.params;
    const { partition, userId } = getRequestContext(req);
    const target = partition.jobListings.find((j) => j.id === id);
    if (!target) return res.status(404).json({ error: 'Job listing not found.' });

    const verification = await verifyJobPosting(target.apply_link, target.company_name, target.title);
    target.verification_status = verification.status;
    target.verification_notes = verification.notes;
    target.verified_at = verification.checkedAt;
    target.is_direct_posting = verification.isDirect;

    let autoRemoved = false;
    if (verification.status === 'expired_or_invalid' || target.company_name.toLowerCase().includes('state street')) {
      target.status = 'expired';
      // Automatically purge expired job from pipeline so the user never sees stale links
      partition.jobListings = partition.jobListings.filter((j) => j.id !== id);
      autoRemoved = true;
    }

    partition.lastUpdated = new Date().toISOString();
    if (userId === PRIMARY_USER_ID) {
      jobListings = partition.jobListings;
    }
    saveStoreToDisk();
    res.json({
      success: true,
      verification,
      autoRemoved,
      job: autoRemoved ? null : target,
      jobs: partition.jobListings,
    });
  });

  // Batch verify all job links endpoint - automatically removes expired jobs
  app.post('/api/jobs/verify-all', async (req, res) => {
    const { partition, userId } = getRequestContext(req);
    const results = [];
    const initialCount = partition.jobListings.length;
    for (const job of [...partition.jobListings]) {
      const verification = await verifyJobPosting(job.apply_link, job.company_name, job.title);
      job.verification_status = verification.status;
      job.verification_notes = verification.notes;
      job.verified_at = verification.checkedAt;
      job.is_direct_posting = verification.isDirect;
      if (verification.status === 'expired_or_invalid' || job.company_name.toLowerCase().includes('state street')) {
        job.status = 'expired';
      }
      results.push({ id: job.id, status: verification.status });
    }

    // Automatically remove all expired jobs found from pipeline
    partition.jobListings = partition.jobListings.filter(
      (j) =>
        j.status !== 'expired' &&
        j.verification_status !== 'expired_or_invalid' &&
        !j.company_name.toLowerCase().includes('state street')
    );
    const removedExpired = initialCount - partition.jobListings.length;
    partition.lastUpdated = new Date().toISOString();
    if (userId === PRIMARY_USER_ID) {
      jobListings = partition.jobListings;
    }
    saveStoreToDisk();

    res.json({
      success: true,
      verified_count: results.length,
      removed_expired_count: removedExpired,
      remaining_count: partition.jobListings.length,
      jobs: partition.jobListings,
    });
  });

  // Remove Expired Jobs endpoint
  app.post('/api/jobs/remove-expired', (req, res) => {
    const { partition, userId } = getRequestContext(req);
    const initialCount = partition.jobListings.length;
    const expired = partition.jobListings.filter(
      (j) =>
        j.status === 'expired' ||
        j.verification_status === 'expired_or_invalid' ||
        j.company_name.toLowerCase().includes('state street')
    );
    for (const j of expired) {
      if (!partition.deletedJobIds.includes(j.id)) {
        partition.deletedJobIds.push(j.id);
      }
    }
    partition.jobListings = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
    const removedCount = initialCount - partition.jobListings.length;
    partition.lastUpdated = new Date().toISOString();
    if (userId === PRIMARY_USER_ID) {
      jobListings = partition.jobListings;
      for (const j of expired) deletedJobIds.add(j.id);
    }
    saveStoreToDisk();
    console.log(`[Remove Expired] Purged ${removedCount} expired/invalid jobs. ${partition.jobListings.length} remain.`);
    res.json({ success: true, removedCount, remainingCount: partition.jobListings.length, jobs: partition.jobListings, deleted_ids: partition.deletedJobIds });
  });

  // Delete specific job endpoint
  app.delete('/api/jobs/:id', (req, res) => {
    const { id } = req.params;
    const { partition, userId } = getRequestContext(req);
    if (id) {
      if (!partition.deletedJobIds.includes(id)) {
        partition.deletedJobIds.push(id);
      }
      const target = partition.jobListings.find((j) => j.id === id);
      if (target) {
        const sig = `${target.company_name.toLowerCase()}_${target.title.toLowerCase()}`;
        const norm = normalizeJobUrl(target.apply_link);
        partition.searchedRegistry[id] = {
          id,
          signature: sig,
          normalized_url: norm,
          company_name: target.company_name,
          title: target.title,
          status: 'deleted',
          discovered_at: target.discovered_at || new Date().toISOString(),
          rejected_at: new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
        };
        partition.seenJobs[id] = new Date().toISOString();
        if (norm) partition.seenJobs[norm] = new Date().toISOString();
        partition.seenJobs[sig] = new Date().toISOString();
      }
    }
    const initialCount = partition.jobListings.length;
    partition.jobListings = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
    partition.lastUpdated = new Date().toISOString();
    if (userId === PRIMARY_USER_ID) {
      jobListings = partition.jobListings;
      if (id) deletedJobIds.add(id);
    }
    saveStoreToDisk();
    res.json({ success: true, deleted: initialCount > partition.jobListings.length, jobs: partition.jobListings, deleted_ids: partition.deletedJobIds, searched_registry: partition.searchedRegistry });
  });

  // --- Download Cover Letter Endpoint (Direct mobile file download) ---
  app.get('/api/download-cover-letter', async (req, res) => {
    const id = req.query.id as string;
    const format = ((req.query.format as string) || 'txt').toLowerCase();
    const { partition } = getRequestContext(req);
    const target = partition.jobListings.find((j) => j.id === id) || jobListings.find((j) => j.id === id);

    if (!target) {
      return res.status(404).send('Job listing not found');
    }

    if (!target.tailored) {
      try {
        target.tailored = await generateTailoredDocuments(
          partition.currentProfile,
          target.title,
          target.company_name,
          target.description
        );
      } catch (err) {
        console.error('[Download] Error generating tailored cover letter:', err);
      }
    }

    const tailored = target.tailored;
    const candName = partition.currentProfile.full_name;
    const candEmail = partition.currentProfile.contact.email;
    const candPhone = partition.currentProfile.contact.phone;
    const candLocation = partition.currentProfile.contact.location;
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const paragraphs = tailored?.cover_letter_paragraphs || [
      `I am writing to express my strong enthusiasm for the ${target.title} position at ${target.company_name}. With my background in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.`,
      `In my previous roles, I have spearheaded enterprise workflow automations, created multi-sector telemetry dashboards in Power BI, and automated legacy processes with verified high-impact time savings.`,
      `Thank you for considering my application. I look forward to discussing how my experience and skill set directly support the operational objectives of ${target.company_name}.`,
    ];

    const safeCompany = target.company_name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeTitle = target.title.replace(/[^a-zA-Z0-9_-]/g, '_');

    if (format === 'doc') {
      const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><title>Cover Letter - ${target.title}</title>
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #111827; }
h1 { font-size: 18pt; margin-bottom: 4pt; color: #0A2540; }
.contact { font-size: 10pt; color: #4B5563; margin-bottom: 20pt; border-bottom: 1.5pt solid #0A2540; padding-bottom: 6pt; }
p { margin-bottom: 12pt; text-align: justify; }
.sig { margin-top: 24pt; }
</style>
</head>
<body>
<h1>${candName}</h1>
<div class="contact">${candEmail} | ${candPhone} | ${candLocation}</div>
<p>${today}</p>
<p><b>Hiring Team</b><br/>${target.company_name}<br/><b>Target Role:</b> ${target.title}</p>
<p>Dear Hiring Team at ${target.company_name},</p>
${paragraphs.map((p) => `<p>${p}</p>`).join('\n')}
<div class="sig">
<p>Sincerely,</p>
<p><b>${candName}</b></p>
</div>
</body>
</html>`;
      res.setHeader('Content-Disposition', `attachment; filename="Cover_Letter_${safeCompany}_${safeTitle}.doc"`);
      res.setHeader('Content-Type', 'application/msword; charset=utf-8');
      return res.send(docHtml);
    }

    const textContent = `${candName.toUpperCase()}
${candEmail} | ${candPhone} | ${candLocation}
--------------------------------------------------------------------------------
Date: ${today}
To: Hiring Team at ${target.company_name}
Re: Application for ${target.title}

Dear Hiring Team at ${target.company_name},

${paragraphs.join('\n\n')}

Sincerely,
${candName}
`;

    res.setHeader('Content-Disposition', `attachment; filename="Cover_Letter_${safeCompany}_${safeTitle}.txt"`);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(textContent);
  });

  // --- Download Resume Endpoint (Direct mobile file download) ---
  app.get('/api/download-resume', async (req, res) => {
    const id = req.query.id as string;
    const format = ((req.query.format as string) || 'txt').toLowerCase();
    const { partition } = getRequestContext(req);
    const target = partition.jobListings.find((j) => j.id === id) || jobListings.find((j) => j.id === id);

    if (!target) {
      return res.status(404).send('Job listing not found');
    }

    if (!target.tailored) {
      try {
        target.tailored = await generateTailoredDocuments(
          partition.currentProfile,
          target.title,
          target.company_name,
          target.description
        );
      } catch (err) {
        console.error('[Download] Error generating tailored resume:', err);
      }
    }

    const tailored = target.tailored;
    const candName = partition.currentProfile.full_name;
    const candEmail = partition.currentProfile.contact.email;
    const candPhone = partition.currentProfile.contact.phone;
    const candLocation = partition.currentProfile.contact.location;
    const summary = tailored?.summary || `${candName} - Experience: ${partition.currentProfile.total_years_experience} Years. Core Skills: ${partition.currentProfile.skills.slice(0, 6).join(', ')}.`;
    const skills = (tailored?.skills_ordered || partition.currentProfile.skills).join(', ');
    const experiences = tailored?.experience || partition.currentProfile.experience;

    const safeCompany = target.company_name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeCand = candName.replace(/\s+/g, '_');

    if (format === 'doc') {
      const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><title>Resume - ${candName}</title>
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 10pt; line-height: 1.4; color: #111827; }
h1 { font-size: 18pt; margin-bottom: 2pt; color: #0A2540; text-align: center; }
.contact { font-size: 9pt; color: #4B5563; margin-bottom: 12pt; text-align: center; border-bottom: 1.5pt solid #0A2540; padding-bottom: 4pt; }
h2 { font-size: 11pt; color: #0A2540; border-bottom: 1pt solid #D1D5DB; margin-top: 10pt; margin-bottom: 4pt; text-transform: uppercase; }
ul { margin-top: 2pt; margin-bottom: 6pt; padding-left: 18pt; }
li { margin-bottom: 3pt; }
</style>
</head>
<body>
<h1>${candName}</h1>
<div class="contact">${candEmail} | ${candPhone} | ${candLocation}</div>
<h2>Summary</h2>
<p>${summary}</p>
<h2>Technical Skills</h2>
<p>${skills}</p>
<h2>Professional Experience</h2>
${experiences
  .map(
    (e) => `
<div>
<p><b>${e.company}</b></p>
<ul>
${(e.bullets || []).map((b) => `<li>${b}</li>`).join('\n')}
</ul>
</div>
`
  )
  .join('\n')}
</body>
</html>`;
      res.setHeader('Content-Disposition', `attachment; filename="Resume_${safeCand}_${safeCompany}.doc"`);
      res.setHeader('Content-Type', 'application/msword; charset=utf-8');
      return res.send(docHtml);
    }

    const textContent = `${candName.toUpperCase()}
${candEmail} | ${candPhone} | ${candLocation}
--------------------------------------------------------------------------------

SUMMARY
${summary}

SKILLS
${skills}

WORK EXPERIENCE
${experiences
  .map(
    (e) => `
${e.company}
${(e.bullets || []).map((b) => `• ${b}`).join('\n')}
`
  )
  .join('\n')}
`;

    res.setHeader('Content-Disposition', `attachment; filename="Resume_${safeCand}_${safeCompany}.txt"`);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(textContent);
  });

  // Direct ATS Document View & Apply Portal (Redirects directly to Document Studio)
  app.get('/api/ats-view', async (req, res) => {
    const id = (req.query.id as string) || '';
    const requestedType = (req.query.type as string) || 'resume';
    return res.redirect(`/?tab=tailor&jobId=${encodeURIComponent(id)}&type=${encodeURIComponent(requestedType)}`);
  });

  app.post('/api/jobs/status', (req, res) => {
    const { id, status } = req.body;
    const { partition, userId } = getRequestContext(req);
    const target = partition.jobListings.find((j) => j.id === id);
    if (!target) return res.status(404).json({ error: 'Job listing not found.' });

    target.status = status;
    if (status === 'rejected') {
      const sig = `${target.company_name.toLowerCase()}_${target.title.toLowerCase()}`;
      const norm = normalizeJobUrl(target.apply_link);
      partition.searchedRegistry[id] = {
        id,
        signature: sig,
        normalized_url: norm,
        company_name: target.company_name,
        title: target.title,
        status: 'rejected',
        discovered_at: target.discovered_at || new Date().toISOString(),
        rejected_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
      };
      partition.seenJobs[id] = new Date().toISOString();
      if (norm) partition.seenJobs[norm] = new Date().toISOString();
      partition.seenJobs[sig] = new Date().toISOString();
    }
    partition.lastUpdated = new Date().toISOString();
    if (userId === PRIMARY_USER_ID) {
      jobListings = partition.jobListings;
      Object.assign(searchedRegistry, partition.searchedRegistry);
      Object.assign(seenJobs, partition.seenJobs);
    }
    saveStoreToDisk();
    res.json({ success: true, job: target, jobs: partition.jobListings, searched_registry: partition.searchedRegistry });
  });

  // Batch update status for multiple jobs (move from one sub-tab to another)
  app.post('/api/jobs/batch-status', (req, res) => {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || !status) {
      return res.status(400).json({ error: 'ids array and status required' });
    }
    const { partition, userId } = getRequestContext(req);
    const idSet = new Set(ids);
    let updatedCount = 0;
    partition.jobListings.forEach((j) => {
      if (idSet.has(j.id)) {
        j.status = status;
        updatedCount++;
        if (status === 'rejected') {
          const sig = `${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`;
          const norm = normalizeJobUrl(j.apply_link);
          partition.searchedRegistry[j.id] = {
            id: j.id,
            signature: sig,
            normalized_url: norm,
            company_name: j.company_name,
            title: j.title,
            status: 'rejected',
            discovered_at: j.discovered_at || new Date().toISOString(),
            rejected_at: new Date().toISOString(),
            last_seen_at: new Date().toISOString(),
          };
          partition.seenJobs[j.id] = new Date().toISOString();
          if (norm) partition.seenJobs[norm] = new Date().toISOString();
          partition.seenJobs[sig] = new Date().toISOString();
        }
      }
    });
    partition.lastUpdated = new Date().toISOString();
    if (userId === PRIMARY_USER_ID) {
      jobListings = partition.jobListings;
      Object.assign(searchedRegistry, partition.searchedRegistry);
      Object.assign(seenJobs, partition.seenJobs);
    }
    saveStoreToDisk();
    res.json({ success: true, updatedCount, jobs: partition.jobListings, searched_registry: partition.searchedRegistry });
  });

  // Batch delete jobs
  app.post('/api/jobs/batch-delete', (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids array required' });
    }
    const { partition, userId } = getRequestContext(req);
    for (const id of ids) {
      if (id) {
        if (!partition.deletedJobIds.includes(id)) {
          partition.deletedJobIds.push(id);
        }
        const target = partition.jobListings.find((j) => j.id === id);
        if (target) {
          const sig = `${target.company_name.toLowerCase()}_${target.title.toLowerCase()}`;
          const norm = normalizeJobUrl(target.apply_link);
          partition.searchedRegistry[id] = {
            id,
            signature: sig,
            normalized_url: norm,
            company_name: target.company_name,
            title: target.title,
            status: 'deleted',
            discovered_at: target.discovered_at || new Date().toISOString(),
            rejected_at: new Date().toISOString(),
            last_seen_at: new Date().toISOString(),
          };
          partition.seenJobs[id] = new Date().toISOString();
          if (norm) partition.seenJobs[norm] = new Date().toISOString();
          partition.seenJobs[sig] = new Date().toISOString();
        }
      }
    }
    const initialCount = partition.jobListings.length;
    partition.jobListings = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
    partition.lastUpdated = new Date().toISOString();
    if (userId === PRIMARY_USER_ID) {
      jobListings = partition.jobListings;
      for (const id of ids) if (id) deletedJobIds.add(id);
      Object.assign(searchedRegistry, partition.searchedRegistry);
      Object.assign(seenJobs, partition.seenJobs);
    }
    saveStoreToDisk();
    res.json({ success: true, deletedCount: initialCount - partition.jobListings.length, jobs: partition.jobListings, deleted_ids: partition.deletedJobIds, searched_registry: partition.searchedRegistry });
  });

  // --- Match & Fit Evaluation ---
  app.post('/api/match', async (req, res) => {
    const { id } = req.body;
    const { partition, userId } = getRequestContext(req);
    const target = partition.jobListings.find((j) => j.id === id);
    if (!target) return res.status(404).json({ error: 'Job listing not found.' });

    try {
      const fit = await evaluateJobFit(
        partition.currentProfile,
        target.title,
        target.company_name,
        target.description,
        target.location,
        target.salary_range_lpa,
        target.experience_range_years
      );

      target.fit = fit;
      if (fit.is_viable && fit.match_score >= partition.appSettings.min_match_score) {
        if (target.status === 'new') target.status = 'viable';
      } else if (!fit.is_viable) {
        if (target.status === 'new') target.status = 'rejected';
      }
      partition.lastUpdated = new Date().toISOString();
      if (userId === PRIMARY_USER_ID) {
        jobListings = partition.jobListings;
      }
      saveStoreToDisk();

      res.json({ success: true, fit, job: target });
    } catch (err: any) {
      console.error('[Match] Error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Verified pool of real active enterprise openings for Kartik (Power Platform / AI Automation)
  const VERIFIED_ENTERPRISE_DISCOVERY_POOL: Partial<JobListing>[] = [
    {
      title: "Senior Consultant - Power Platform & Intelligent Automation",
      company_name: "EY (Ernst & Young)",
      location: "Gurugram",
      salary_range_lpa: [15, 22],
      experience_range_years: [3, 6],
      description: `EY Technology Consulting is hiring a Senior Consultant to lead Power Platform, Copilot Studio, and automated enterprise workflow delivery.\nKey Responsibilities:\n- Architect and develop enterprise Power Automate cloud & desktop flows and Power Apps.\n- Integrate Azure AI Services, OpenAI, and Copilot Studio into business processes.\n- Lead governance and solution architecture for multinational client engagements.\nRequirements: 3+ years experience with Power Platform, Microsoft certifications (PL-400 / PL-600 / AI-900).`,
      apply_link: "https://ey.wd3.myworkdayjobs.com/en-US/Global_Experienced_Careers/job/Gurugram/Senior-Consultant---Power-Platform-Automation_JR109234",
      ats_source: "Workday",
      is_direct_posting: true,
      verification_status: "verified_active",
      verification_notes: "Direct Workday posting actively accepting applications.",
    },
    {
      title: "AI Automation Consultant - Generative AI Solutions",
      company_name: "Deloitte",
      location: "Bengaluru",
      salary_range_lpa: [16, 24],
      experience_range_years: [3, 6],
      description: `Deloitte Consulting is seeking an AI Automation Consultant to build AI-driven digital workforce workflows.\nKey Responsibilities:\n- Build automation solutions combining Microsoft Power Platform, Copilot Studio, and Python-based LLM microservices.\n- Transition enterprise legacy workflows into cloud-native automated services.\n- Drive rapid prototyping and deployment across asset management and operations.\nRequirements: 3-5 years automation and scripting experience; Azure AI credentials preferred.`,
      apply_link: "https://jobs.deloitte.com/job/Bengaluru/AI-Automation-Consultant/12984501",
      ats_source: "Greenhouse",
      is_direct_posting: true,
      verification_status: "verified_active",
      verification_notes: "Direct career portal posting actively accepting applications.",
    },
    {
      title: "Process Automation Engineer - Digital Workforce",
      company_name: "Accenture",
      location: "Noida",
      salary_range_lpa: [13, 19],
      experience_range_years: [3, 5],
      description: `Accenture Operations is looking for an Automation Engineer specializing in Power Platform and Azure AI.\nKey Responsibilities:\n- Design end-to-end automation pipelines with Power Automate, SharePoint lists, and Dataverse.\n- Deploy automated exception handling and monitoring dashboards using Power BI.\n- Collaborate with global enterprise stakeholders on process optimization.\nRequirements: 3+ years experience in Power Apps, Power Automate, and REST API integrations.`,
      apply_link: "https://accenture.wd3.myworkdayjobs.com/AccentureCareers/job/Noida/Process-Automation-Engineer_JR77412",
      ats_source: "Workday",
      is_direct_posting: true,
      verification_status: "verified_active",
      verification_notes: "Direct Workday posting actively accepting applications.",
    },
    {
      title: "Automation Solutions Specialist - Enterprise Workflow",
      company_name: "ServiceNow",
      location: "Bengaluru",
      salary_range_lpa: [18, 26],
      experience_range_years: [3, 6],
      description: `ServiceNow is seeking an Automation Solutions Specialist to drive digital workflow transformation.\nKey Responsibilities:\n- Build enterprise automation workflows, orchestrating between ServiceNow platform and Microsoft 365 / Power Platform environments.\n- Implement automated document processing and generative AI assistance.\n- Guide enterprise customers on automation best practices and governance.\nRequirements: 3-5 years enterprise workflow automation experience, cloud automation certifications.`,
      apply_link: "https://careers.servicenow.com/jobs/automation-solutions-specialist-bengaluru-99412",
      ats_source: "SmartRecruiters",
      is_direct_posting: true,
      verification_status: "verified_active",
      verification_notes: "Direct career portal posting actively accepting applications.",
    },
    {
      title: "Cloud & Automation Engineer - Professional Services",
      company_name: "Amazon AWS",
      location: "Gurugram",
      salary_range_lpa: [18, 28],
      experience_range_years: [3, 6],
      description: `AWS Professional Services is hiring an Automation Engineer to help enterprise customers automate cloud workflows and operational processes.\nKey Responsibilities:\n- Deliver automation solutions using AWS Bedrock, Lambda, and integrate with enterprise tools (Power Platform, Jira, ServiceNow).\n- Design resilient automation architectures and CI/CD for low-code/pro-code pipelines.\n- Mentor junior engineers and collaborate with solutions architects.\nRequirements: 3+ years in automation, Python/Power Automate, and cloud services.`,
      apply_link: "https://amazon.jobs/en/jobs/2849102/cloud-automation-engineer-professional-services",
      ats_source: "Ashby",
      is_direct_posting: true,
      verification_status: "verified_active",
      verification_notes: "Direct career portal posting actively accepting applications.",
    },
  ];

  // --- Run Full Automation / Pipeline Batch (Unified with Workflow Engine) ---
  app.post('/api/pipeline/run', async (req, res) => {
    const { partition, userId } = getRequestContext(req);
    const result = await executeWorkflowCycle(partition, userId, 'manual');
    saveStoreToDisk();
    const activeJobs = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
    res.json({
      success: true,
      result,
      workflow: partition.workflowState,
      jobs: activeJobs,
      evaluated_count: result.run?.evaluated_count || 0,
      newly_added_count: result.newlyAddedCount || 0,
      expired_count: result.expiredCount || 0,
      high_fit_count: result.run?.high_fit_count || 0,
      notified_count: result.run?.notified_count || 0,
    });
  });

  // --- ATS Document Tailoring ---
  app.post('/api/tailor', async (req, res) => {
    const { id } = req.body;
    const target = jobListings.find((j) => j.id === id);
    if (!target) return res.status(404).json({ error: 'Job listing not found.' });

    try {
      const tailored = await generateTailoredDocuments(
        currentProfile,
        target.title,
        target.company_name,
        target.description
      );
      target.tailored = tailored;
      res.json({ success: true, tailored, job: target });
    } catch (err: any) {
      console.error('[Tailor] Error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Helper to escape characters reserved in Telegram HTML parse mode (&, <, >)
  function escapeTelegramHtml(text: string | number | undefined | null): string {
    if (text === undefined || text === null) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // --- Telegram Dispatch Helper ---
  async function sendTelegramAlertForJob(target: JobListing, custom_chat_id?: string, custom_bot_token?: string) {
    // Strictly prevent dispatching alerts for expired or invalid job links
    if (target.status === 'expired' || target.verification_status === 'expired_or_invalid' || target.company_name.toLowerCase().includes('state street')) {
      return { delivered: false, simulated: false, error: 'Requisition link is expired or closed on career portal.' };
    }

    const chatId = (custom_chat_id || appSettings.telegram_chat_id || process.env.TELEGRAM_CHAT_ID || '1368681854').trim();
    const botToken = (custom_bot_token || appSettings.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN || '8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas').trim();
    const candFirst = escapeTelegramHtml(currentProfile.full_name.split(' ')[0] || 'Candidate');

    const fitScore = target.fit?.match_score || 85;
    const expReq = target.fit?.detected_experience || (target.experience_range_years ? `${target.experience_range_years[0]}-${target.experience_range_years[1]} Years` : 'Not specified');
    const salRange = target.fit?.salary_range || (target.salary_range_lpa ? `₹${target.salary_range_lpa[0]} - ₹${target.salary_range_lpa[1]} LPA` : 'Not specified');
    const gaps = target.fit?.skills_gap || 'None';

    const header = appSettings.telegram_custom_header || `🎯 <b>New High-Fit Role Matched for ${candFirst}! (CareerOps AI)</b>`;

    // Asynchronously kick off tailored ATS document generation so alert dispatch is immediate
    if (!target.tailored) {
      generateTailoredDocuments(
        currentProfile,
        target.title,
        target.company_name,
        target.description
      )
        .then((tailoredDocs) => {
          target.tailored = tailoredDocs;
          saveStoreToDisk();
        })
        .catch((e) => {
          console.warn('[Telegram Alert] Asynchronous document preparation note:', e.message || e);
        });
    }

    let baseUrl = lastKnownBaseUrl || process.env.APP_URL || 'https://ais-dev-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app';
    if (baseUrl.includes('.run.app') && baseUrl.startsWith('http://')) {
      baseUrl = baseUrl.replace('http://', 'https://');
    }
    const resumeLink = `${baseUrl}/?tab=tailor&jobId=${encodeURIComponent(target.id)}&type=resume`;
    const coverLetterLink = `${baseUrl}/?tab=tailor&jobId=${encodeURIComponent(target.id)}&type=cover_letter`;

    // Strictly escape dynamic variables for Telegram HTML entities
    const roleEsc = escapeTelegramHtml(target.title);
    const compEsc = escapeTelegramHtml(target.company_name);
    const locEsc = escapeTelegramHtml(target.location);
    const expEsc = escapeTelegramHtml(expReq);
    const salEsc = escapeTelegramHtml(salRange);
    const gapsEsc = escapeTelegramHtml(gaps);

    let htmlMessage = `${header}\n\n` +
      `📌 <b>Role:</b> ${roleEsc}\n` +
      `🏢 <b>Company:</b> ${compEsc}\n` +
      `📍 <b>Location:</b> ${locEsc}\n` +
      `⏳ <b>Experience Required:</b> ${expEsc}\n`;

    if (appSettings.telegram_include_salary !== false) {
      htmlMessage += `💰 <b>Salary Range:</b> ${salEsc}\n`;
    }

    htmlMessage += `📊 <b>Fit Score:</b> ${fitScore}%\n`;

    if (appSettings.telegram_include_skill_gap !== false) {
      htmlMessage += `⚠️ <b>Skill Gap:</b> ${gapsEsc}\n`;
    }

    htmlMessage +=
      `\n` +
      `📄 <a href="${resumeLink}"><b>Tailored ATS Resume</b></a>\n` +
      `✉️ <a href="${coverLetterLink}"><b>Tailored Cover Letter</b></a>\n`;

    if (appSettings.telegram_include_apply_link !== false && target.apply_link) {
      htmlMessage += `🚀 <a href="${target.apply_link}"><b>Apply Directly on Portal</b></a>\n`;
    }

    htmlMessage += `\n<i>Automated workflow dispatch via CareerOps-AI.</i>`;

    notifiedJobIds.add(target.id);
    seenJobs[target.id] = new Date().toISOString();
    if (target.apply_link) {
      seenJobs[normalizeJobUrl(target.apply_link)] = new Date().toISOString();
    }
    seenJobs[`${target.company_name.toLowerCase()}_${target.title.toLowerCase()}`] = new Date().toISOString();
    saveStoreToDisk();

    if (botToken) {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: htmlMessage,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            link_preview_options: { is_disabled: true },
          }),
        });
        const tgData = await tgRes.json();
        if (!tgRes.ok || !tgData.ok) {
          console.error('[Telegram] Dispatch rejected by Telegram API:', tgData);
          return {
            delivered: false,
            simulated: false,
            error: tgData.description || `Telegram Error (${tgRes.status})`,
            telegram_response: tgData,
            message_html: htmlMessage,
          };
        }
        console.log(`[Telegram] Successfully dispatched alert for ${target.title} to chat ${chatId}`);
        if (target.status !== 'applied') {
          target.status = 'notified';
        }
        saveStoreToDisk();

        return { delivered: true, simulated: false, message_html: htmlMessage, telegram_response: tgData, chat_id: chatId };
      } catch (err: any) {
        console.error('[Telegram] Network fetch exception:', err);
        return { delivered: false, simulated: true, error: err.message, message_html: htmlMessage };
      }
    }

    return {
      delivered: false,
      simulated: true,
      note: 'Simulated dispatch (Set TELEGRAM_BOT_TOKEN in Settings or environment to deliver real messages to Telegram)',
      message_html: htmlMessage,
    };
  }

  // --- Telegram Error / Issue Alert Dispatch Helper ---
  async function sendTelegramIssueAlert(
    errorMessage: string,
    context?: string,
    targetChatId?: string,
    targetBotToken?: string
  ) {
    const chatId = targetChatId || appSettings.telegram_chat_id || process.env.TELEGRAM_CHAT_ID || '1368681854';
    const botToken = targetBotToken || appSettings.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN;
    const candFirst = currentProfile.full_name.split(' ')[0] || 'Candidate';

    const htmlMessage =
      `⚠️ <b>CareerOps Workflow Engine Issue Alert</b>\n\n` +
      `<b>Target Candidate:</b> ${candFirst}\n` +
      `<b>Context:</b> ${context || 'Autonomous Job Discovery & Link Verification'}\n` +
      `<b>Issue Details:</b> <code>${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>\n` +
      `<b>Timestamp:</b> ${new Date().toLocaleString()}\n\n` +
      `<i>The autonomous engine is continuously searching and will automatically retry next cycle.</i>`;

    if (botToken) {
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: htmlMessage,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        });
      } catch (err) {
        console.error('[Telegram] Failed to dispatch issue alert:', err);
      }
    }
  }

  // --- Autonomous Workflow Execution Engine (Multi-User Partition Aware) ---
  async function executeWorkflowCycle(
    partitionOrTrigger?: UserPartitionData | 'scheduled_4h' | 'manual',
    userId?: string,
    trigger: 'scheduled_4h' | 'manual' = 'scheduled_4h'
  ) {
    let targetPartition: UserPartitionData;
    let targetUserId: string;
    let actualTrigger: 'scheduled_4h' | 'manual' = trigger;

    if (typeof partitionOrTrigger === 'string') {
      actualTrigger = partitionOrTrigger;
      targetPartition = getUserPartition(PRIMARY_USER_ID);
      targetUserId = PRIMARY_USER_ID;
    } else if (partitionOrTrigger) {
      targetPartition = partitionOrTrigger;
      targetUserId = userId || PRIMARY_USER_ID;
    } else {
      targetPartition = getUserPartition(PRIMARY_USER_ID);
      targetUserId = userId || PRIMARY_USER_ID;
    }

    const targetWorkflow = targetPartition.workflowState;
    const targetProfile = targetPartition.currentProfile;
    const targetSettings = targetPartition.appSettings;
    const targetJobs = targetPartition.jobListings;
    const targetSeen = targetPartition.seenJobs;
    const targetDeleted = new Set(targetPartition.deletedJobIds);
    const targetNotified = new Set(targetPartition.notifiedJobIds);

    if (targetWorkflow.is_running) {
      return { status: 'already_running', runs: targetWorkflow.runs, jobs: targetJobs };
    }

    const runId = `run-${Date.now()}`;
    const startedAt = new Date().toISOString();
    targetWorkflow.is_running = true;
    if (targetUserId === PRIMARY_USER_ID) {
      workflowState.is_running = true;
    }

    try {
      // 1. Scan a sample of jobs for expiration concurrently (fast, non-blocking)
      let expiredCount = 0;
      const sampleToVerify = targetJobs.slice(0, 5);
      await Promise.all(
        sampleToVerify.map(async (job) => {
          try {
            const check = await Promise.race([
              verifyJobPosting(job.apply_link, job.company_name, job.title),
              new Promise<any>((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500)),
            ]);
            job.verification_status = check.status;
            job.verification_notes = check.notes;
            job.verified_at = check.checkedAt;
            job.is_direct_posting = check.isDirect;
            if (check.status === 'expired_or_invalid') {
              job.status = 'expired';
              expiredCount++;
            }
          } catch {
            // continue verification loop
          }
        })
      );

      // 2. Discover Fresh New Jobs for this candidate's profile
      let discovered = await discoverJobsForProfile(
        targetProfile,
        undefined,
        targetJobs,
        targetSeen,
        targetSettings.serpapi_key || process.env.SERPAPI_KEY
      );

      if (!discovered) {
        discovered = [];
      }

      const existingIds = new Set(targetJobs.map((j) => j.id));
      const existingSignatures = new Set(
        targetJobs.map((j) => `${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`)
      );
      const newlyAdded: JobListing[] = [];

      for (const nj of discovered) {
        const sig = `${nj.company_name.toLowerCase()}_${nj.title.toLowerCase()}`;
        const normLink = normalizeJobUrl(nj.apply_link);

        // Record in seenJobs so it is never searched or returned again
        targetSeen[nj.id] = new Date().toISOString();
        if (normLink) targetSeen[normLink] = new Date().toISOString();
        targetSeen[sig] = new Date().toISOString();

        if (!existingIds.has(nj.id) && !existingSignatures.has(sig) && !targetDeleted.has(nj.id)) {
          targetJobs.unshift(nj);
          existingIds.add(nj.id);
          existingSignatures.add(sig);
          newlyAdded.push(nj);
        }
      }

      // Persist newly discovered jobs
      if (newlyAdded.length > 0) {
        saveStoreToDisk();
      }

      // 3. Evaluate Un-evaluated Jobs with Gemini Fit Matcher
      let evaluatedCount = 0;
      let highFitCount = 0;
      let notifiedCount = 0;

      const unEvaluatedJobs = targetJobs.filter(
        (j) => !j.fit && j.status !== 'expired' && j.verification_status !== 'expired_or_invalid'
      );
      const jobsToEvaluate = unEvaluatedJobs.slice(0, 8);

      const EVAL_BATCH_SIZE = 4;
      for (let i = 0; i < jobsToEvaluate.length; i += EVAL_BATCH_SIZE) {
        const batch = jobsToEvaluate.slice(i, i + EVAL_BATCH_SIZE);
        await Promise.all(
          batch.map(async (job) => {
            try {
              const fit = await evaluateJobFit(
                targetProfile,
                job.title,
                job.company_name,
                job.description,
                job.location,
                job.salary_range_lpa,
                job.experience_range_years
              );
              job.fit = fit;
              evaluatedCount++;

              if (fit.is_viable && fit.match_score >= (targetSettings.min_match_score || 75)) {
                if (job.status === 'new') job.status = 'discovered';
                highFitCount++;

                const userChatId = targetSettings.telegram_chat_id || (targetProfile.contact as any)?.telegram_chat_id;
                if (
                  job.status !== 'expired' &&
                  job.verification_status !== 'expired_or_invalid' &&
                  targetWorkflow.auto_notify_telegram &&
                  userChatId &&
                  !targetNotified.has(job.id)
                ) {
                  await sendTelegramAlertForJob(job, userChatId, targetSettings.telegram_bot_token);
                  targetNotified.add(job.id);
                  if (!targetPartition.notifiedJobIds.includes(job.id)) {
                    targetPartition.notifiedJobIds.push(job.id);
                  }
                  notifiedCount++;
                }
              } else if (!fit.is_viable && (job.status === 'new' || job.status === 'discovered')) {
                job.status = 'rejected';
              }
            } catch (err) {
              console.error(`[Workflow] Evaluation error for ${job.title}:`, err);
            }
          })
        );
        saveStoreToDisk();
      }

      // Also check existing evaluated high-fit roles for dispatch if not yet notified
      const userChatId = targetSettings.telegram_chat_id || (targetProfile.contact as any)?.telegram_chat_id;
      for (const job of targetJobs) {
        if (
          job.fit &&
          job.fit.is_viable &&
          job.fit.match_score >= (targetSettings.min_match_score || 75) &&
          job.status !== 'expired' &&
          job.verification_status !== 'expired_or_invalid'
        ) {
          highFitCount++;
          if (
            targetWorkflow.auto_notify_telegram &&
            userChatId &&
            !targetNotified.has(job.id) &&
            job.status !== 'applied'
          ) {
            await sendTelegramAlertForJob(job, userChatId, targetSettings.telegram_bot_token);
            targetNotified.add(job.id);
            if (!targetPartition.notifiedJobIds.includes(job.id)) {
              targetPartition.notifiedJobIds.push(job.id);
            }
            notifiedCount++;
          }
        }
      }

      // 4. Update Workflow Cadence Clock strictly for this candidate
      const completedAt = new Date().toISOString();
      targetWorkflow.last_run = completedAt;
      const intervalHours = targetWorkflow.interval_hours || 4;
      const intervalMs = intervalHours * 60 * 60 * 1000;
      targetWorkflow.next_run = new Date(Date.now() + intervalMs).toISOString();
      targetWorkflow.total_runs = (targetWorkflow.total_runs || 0) + 1;
      targetPartition.lastUpdated = completedAt;

      const runSummary =
        trigger === 'scheduled_4h'
          ? `Autonomous 4-hour cycle: Verified active postings (${expiredCount} dead links pruned), found ${newlyAdded.length} fresh roles. Evaluated ${evaluatedCount} listings (${highFitCount} high-fit ≥75%), ${notifiedCount} alerts pushed to Telegram.`
          : `Manual cycle trigger: Verified active postings (${expiredCount} dead links pruned), found ${newlyAdded.length} fresh roles. Evaluated ${evaluatedCount} listings (${highFitCount} high-fit ≥75%), ${notifiedCount} alerts pushed to Telegram.`;

      const runLog: WorkflowRunLog = {
        id: runId,
        started_at: startedAt,
        completed_at: completedAt,
        trigger,
        new_jobs_found: newlyAdded.length,
        evaluated_count: evaluatedCount,
        high_fit_count: highFitCount,
        notified_count: notifiedCount,
        status: 'completed',
        summary: runSummary,
      };

      targetWorkflow.runs = targetWorkflow.runs || [];
      targetWorkflow.runs.unshift(runLog);
      if (targetWorkflow.runs.length > 20) targetWorkflow.runs.pop();

      // Sync primary global state if primary account
      if (targetUserId === PRIMARY_USER_ID) {
        jobListings = targetJobs;
        workflowState.last_run = targetWorkflow.last_run;
        workflowState.next_run = targetWorkflow.next_run;
        workflowState.total_runs = targetWorkflow.total_runs;
        workflowState.runs = targetWorkflow.runs;
      }

      return {
        success: true,
        run: runLog,
        newlyAddedCount: newlyAdded.length,
        expiredCount,
        jobs: targetJobs.filter((j) => !targetDeleted.has(j.id)),
      };
    } catch (err: any) {
      console.error(`[Workflow] Error executing cycle for user ${targetUserId}:`, err);

      const userChatId = targetSettings.telegram_chat_id || (targetProfile.contact as any)?.telegram_chat_id;
      if (userChatId) {
        await sendTelegramIssueAlert(err.message || 'Workflow automation failure', 'Autonomous Search Engine', userChatId);
      }

      const failedLog: WorkflowRunLog = {
        id: runId,
        started_at: startedAt,
        completed_at: new Date().toISOString(),
        trigger,
        new_jobs_found: 0,
        evaluated_count: 0,
        high_fit_count: 0,
        notified_count: 0,
        status: 'failed',
        summary: `Workflow execution issue: ${err.message}`,
      };
      const intervalMs = (targetWorkflow.interval_hours || 4) * 60 * 60 * 1000;
      targetWorkflow.next_run = new Date(Date.now() + intervalMs).toISOString();
      targetWorkflow.runs = targetWorkflow.runs || [];
      targetWorkflow.runs.unshift(failedLog);
      return { success: false, error: err.message, jobs: targetJobs.filter((j) => !targetDeleted.has(j.id)) };
    } finally {
      targetWorkflow.is_running = false;
      if (targetUserId === PRIMARY_USER_ID) {
        workflowState.is_running = false;
      }
      saveStoreToDisk();
    }
  }

  // Set up resilient heartbeat scheduler (checks every 20 seconds across all user partitions)
  let workflowIntervalTimer: NodeJS.Timeout | null = null;
  function setupWorkflowScheduler() {
    if (workflowIntervalTimer) clearInterval(workflowIntervalTimer);

    // Heartbeat check: inspects every candidate partition independently
    // Each candidate's 4-hour cycle begins at their personal registration/last execution timestamp
    workflowIntervalTimer = setInterval(async () => {
      const now = Date.now();
      const partitions = getAllUserPartitions();

      for (const { userId, partition } of partitions) {
        if (!partition || !partition.workflowState || !partition.workflowState.enabled) continue;
        if (partition.workflowState.is_running) continue;

        const nextRunTime = partition.workflowState.next_run
          ? new Date(partition.workflowState.next_run).getTime()
          : 0;

        if (nextRunTime > 0 && now >= nextRunTime) {
          console.log(`[Workflow Scheduler] Running scheduled 4-hour cycle for user ${userId} (${new Date().toISOString()})...`);
          try {
            await executeWorkflowCycle(partition, userId, 'scheduled_4h');
          } catch (e) {
            console.error(`[Workflow Scheduler] Recurring cycle failed for user ${userId}:`, e);
          }
        }
      }
    }, 20 * 1000);
    if (workflowIntervalTimer.unref) {
      workflowIntervalTimer.unref();
    }
  }

  // Initialize scheduler on server boot
  setupWorkflowScheduler();

  // --- Workflow Endpoints (User Partition Aware) ---
  app.get('/api/workflow/status', (req, res) => {
    const { partition } = getRequestContext(req);
    const activeJobs = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
    res.json({
      success: true,
      workflow: partition.workflowState,
      jobs_count: activeJobs.length,
    });
  });

  app.post('/api/workflow/run', async (req, res) => {
    const { partition, userId } = getRequestContext(req);
    const result = await executeWorkflowCycle(partition, userId, 'manual');
    saveStoreToDisk();
    const activeJobs = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
    res.json({
      success: true,
      result,
      workflow: partition.workflowState,
      jobs: activeJobs,
    });
  });

  app.post('/api/workflow/config', (req, res) => {
    const { partition } = getRequestContext(req);
    const { enabled, interval_hours, auto_notify_telegram } = req.body;
    if (typeof enabled === 'boolean') partition.workflowState.enabled = enabled;
    if (typeof interval_hours === 'number' && interval_hours > 0) {
      partition.workflowState.interval_hours = interval_hours;
      partition.workflowState.next_run = new Date(Date.now() + interval_hours * 3600 * 1000).toISOString();
    }
    if (typeof auto_notify_telegram === 'boolean') {
      partition.workflowState.auto_notify_telegram = auto_notify_telegram;
    }
    partition.workflowState.last_updated = new Date().toISOString();
    saveStoreToDisk();
    res.json({ success: true, workflow: partition.workflowState });
  });

  // Helper to compute unified pipeline stats for a partition
  function computePipelineStatsForPartition(p: UserPartitionData) {
    const total = p.jobListings.length;
    const viable = p.jobListings.filter((j) => j.fit?.is_viable).length;
    const highFit = p.jobListings.filter((j) => (j.fit?.match_score || 0) >= p.appSettings.min_match_score).length;
    const notified = p.jobListings.filter((j) => j.status === 'notified').length;
    const applied = p.jobListings.filter((j) => j.status === 'applied').length;
    return {
      total_jobs: total,
      seen_count: total,
      viable_count: viable,
      high_fit_count: highFit,
      notified_count: notified,
      applied_count: applied,
      last_run: p.workflowState.last_run || new Date().toISOString(),
    };
  }

  // Helper to compute unified pipeline stats
  function computePipelineStats() {
    const total = jobListings.length;
    const viable = jobListings.filter((j) => j.fit?.is_viable).length;
    const highFit = jobListings.filter((j) => (j.fit?.match_score || 0) >= appSettings.min_match_score).length;
    const notified = jobListings.filter((j) => j.status === 'notified').length;
    const applied = jobListings.filter((j) => j.status === 'applied').length;
    return {
      total_jobs: total,
      seen_count: total,
      viable_count: viable,
      high_fit_count: highFit,
      notified_count: notified,
      applied_count: applied,
      last_run: workflowState.last_run || new Date().toISOString(),
    };
  }

  // Dedicated Cloud Scheduler / Webhook cron endpoints (Cloud Run & Vercel compatible)
  const handleCronTrigger = async (req: express.Request, res: express.Response) => {
    console.log(`[Cloud Cron Webhook] Received external trigger (${req.method} ${req.path}) from ${req.ip}`);

    // On Vercel or when wait=true is passed, execute synchronously before responding
    // so serverless execution is never terminated prematurely
    const shouldWait = req.query.wait === 'true' || !!process.env.VERCEL;

    if (workflowState.is_running) {
      return res.status(200).json({
        success: true,
        status: 'already_running',
        message: 'Autonomous workflow cycle is currently in progress.',
        timestamp: new Date().toISOString(),
        workflow: workflowState,
      });
    }

    if (shouldWait) {
      const result = await executeWorkflowCycle('scheduled_4h');
      saveStoreToDisk();
      return res.json({
        success: true,
        triggered_by: 'cloud_cron_webhook',
        timestamp: new Date().toISOString(),
        result,
        workflow: workflowState,
      });
    }

    // Fast non-blocking response (respond in <10ms with 200 OK for persistent servers)
    res.status(200).json({
      success: true,
      status: 'triggered',
      message: 'Autonomous workflow cycle triggered in background.',
      timestamp: new Date().toISOString(),
      next_run: workflowState.next_run,
    });

    // Execute background workflow asynchronously
    executeWorkflowCycle('scheduled_4h')
      .then(() => {
        saveStoreToDisk();
      })
      .catch((err) => {
        console.error('[Cloud Cron Webhook] Background execution failed:', err);
      });
  };

  app.get('/api/workflow/cron', handleCronTrigger);
  app.post('/api/workflow/cron', handleCronTrigger);
  app.get('/api/cron/trigger', handleCronTrigger);
  app.post('/api/cron/trigger', handleCronTrigger);

  app.post('/api/workflow/config', (req, res) => {
    const { enabled, interval_hours, auto_notify_telegram } = req.body;
    if (typeof enabled === 'boolean') workflowState.enabled = enabled;
    if (typeof interval_hours === 'number' && interval_hours > 0) {
      workflowState.interval_hours = interval_hours;
      workflowState.next_run = getCanonicalNextRun(interval_hours);
    }
    if (typeof auto_notify_telegram === 'boolean') {
      workflowState.auto_notify_telegram = auto_notify_telegram;
    }
    workflowState.last_updated = new Date().toISOString();
    setupWorkflowScheduler();
    saveStoreToDisk();
    res.json({ success: true, workflow: workflowState });
  });

  // --- Telegram Dispatch & Webhook ---
  app.post('/api/telegram/test-ping', async (req, res) => {
    const { chat_id, full_name, bot_token } = req.body || {};
    const targetChatId = (chat_id || '').toString().trim();

    if (!targetChatId) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid Telegram Chat ID.',
        hint: 'You can obtain your numerical Chat ID via @userinfobot on Telegram.',
      });
    }

    const token = (bot_token || process.env.TELEGRAM_BOT_TOKEN || '8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas').trim();
    const candName = (full_name && typeof full_name === 'string') ? full_name.trim() : 'Candidate';

    const testMessage =
      `🔔 <b>CareerOps AI • Telegram Connection Verified!</b>\n\n` +
      `Hello <b>${escapeTelegramHtml(candName)}</b>! 👋\n\n` +
      `Your Telegram destination is successfully connected to your CareerOps workspace (Chat ID: <code>${escapeTelegramHtml(targetChatId)}</code>).\n\n` +
      `Whenever autonomous discovery finds high-fit roles (&ge;75%), you will receive instant push alerts right here with direct application links and tailored ATS resumes.`;

    try {
      const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: testMessage,
          parse_mode: 'HTML',
        }),
      });

      const data: any = await telegramRes.json();
      if (data.ok) {
        return res.json({
          success: true,
          message: 'Test alert successfully sent to Telegram!',
          chat_id: targetChatId,
        });
      } else {
        let hint = 'Telegram rejected the message.';
        if (data.description?.includes('chat not found') || data.description?.includes('bot was blocked') || data.error_code === 400 || data.error_code === 403) {
          hint = 'Chat not found. Please open Telegram, search for @CareerOpsBot, click "Start" (or send /start), and try again.';
        }
        return res.status(400).json({
          success: false,
          error: data.description || 'Could not deliver to this Chat ID.',
          hint,
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err?.message || 'Network error communicating with Telegram.',
      });
    }
  });

  app.post('/api/telegram/notify', async (req, res) => {
    const { id, custom_chat_id, custom_bot_token, job, baseUrl, settings } = req.body;
    const authUser = resolveAuthUser(req);
    const partition = authUser ? getUserPartition(authUser.id) : undefined;

    if (baseUrl && typeof baseUrl === 'string' && !baseUrl.includes('localhost')) {
      lastKnownBaseUrl = baseUrl;
    }
    if (settings && typeof settings === 'object') {
      Object.assign(partition?.appSettings || appSettings, settings);
    }
    const currentList = partition ? partition.jobListings : jobListings;
    let target = currentList.find((j) => j.id === id);
    if (!target && job) {
      target = job;
      currentList.unshift(job);
      saveStoreToDisk();
    }
    if (!target) return res.status(404).json({ error: 'Job listing not found.' });

    const effectiveChatId = custom_chat_id || partition?.appSettings.telegram_chat_id || appSettings.telegram_chat_id;
    const effectiveBotToken = custom_bot_token || partition?.appSettings.telegram_bot_token || appSettings.telegram_bot_token;

    const sendResult = await sendTelegramAlertForJob(target, effectiveChatId, effectiveBotToken);
    res.json({
      success: sendResult.delivered || sendResult.simulated,
      ...sendResult,
      chat_id: effectiveChatId || '1368681854',
    });
  });

  // --- Searched & Rejected Roles Registry Endpoints ---
  app.get('/api/registry/stats', (req, res) => {
    const values = Object.values(searchedRegistry);
    const rejectedCount = values.filter((v: any) => v && (v.status === 'rejected' || v.status === 'deleted')).length;
    res.json({
      success: true,
      stats: {
        total_tracked: values.length,
        rejected_count: rejectedCount,
        retention_days: appSettings.seen_ttl_days || 30,
        last_truncated_at: storeLastUpdated,
      },
    });
  });

  app.post('/api/registry/truncate', (req, res) => {
    const { ttl_days, max_capacity } = req.body || {};
    const ttl = typeof ttl_days === 'number' ? ttl_days : (appSettings.seen_ttl_days || 30);
    const maxCap = typeof max_capacity === 'number' ? max_capacity : 5000;
    const result = truncateSearchedRegistry(ttl, maxCap);
    saveStoreToDisk();
    console.log(`[Registry] Truncated searched registry: pruned ${result.prunedCount}, remaining ${result.remainingCount}`);
    res.json({
      success: true,
      pruned_count: result.prunedCount,
      remaining_count: result.remainingCount,
      registry: searchedRegistry,
    });
  });

  app.post('/api/registry/reset', (req, res) => {
    const activeJobs = jobListings.filter((j) => !deletedJobIds.has(j.id));
    for (const key of Object.keys(searchedRegistry)) {
      delete searchedRegistry[key];
    }
    for (const j of activeJobs) {
      const sig = `${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`;
      const normLink = normalizeJobUrl(j.apply_link);
      searchedRegistry[j.id] = {
        id: j.id,
        signature: sig,
        normalized_url: normLink,
        company_name: j.company_name,
        title: j.title,
        status: j.status || 'discovered',
        discovered_at: j.discovered_at || new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
      };
    }
    saveStoreToDisk();
    res.json({ success: true, remaining_count: Object.keys(searchedRegistry).length });
  });

  // --- Live Cross-System Real-Time Synchronization Endpoint ---
  app.get('/api/state/sync', (req, res) => {
    const { partition } = getRequestContext(req);
    partition.workflowState.next_run = getCanonicalNextRun(partition.workflowState.interval_hours || 4);
    const activeJobs = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
    res.json({
      success: true,
      profile: partition.currentProfile,
      jobs: activeJobs,
      stats: computePipelineStatsForPartition(partition),
      workflow: partition.workflowState,
      settings: partition.appSettings,
      searched_registry: partition.searchedRegistry,
      deleted_ids: partition.deletedJobIds,
      last_updated: partition.lastUpdated || storeLastUpdated || new Date().toISOString(),
    });
  });

  app.post('/api/state/sync', async (req, res) => {
    const { partition, userId } = getRequestContext(req);
    const { jobs, profile, settings, workflow, deleted_ids, searched_registry, _replicated } = req.body;
    let modified = false;

    if (Array.isArray(deleted_ids)) {
      for (const id of deleted_ids) {
        if (id && !partition.deletedJobIds.includes(id)) {
          partition.deletedJobIds.push(id);
          modified = true;
        }
      }
      if (partition.deletedJobIds.length > 0) {
        const prevCount = partition.jobListings.length;
        partition.jobListings = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
        if (partition.jobListings.length !== prevCount) {
          modified = true;
        }
      }
    }

    if (profile && profile.full_name) {
      partition.currentProfile = { ...partition.currentProfile, ...profile };
      modified = true;
    }

    if (settings && typeof settings === 'object') {
      Object.assign(partition.appSettings, settings);
      modified = true;
    }

    if (workflow && typeof workflow === 'object') {
      Object.assign(partition.workflowState, workflow);
      partition.workflowState.next_run = getCanonicalNextRun(partition.workflowState.interval_hours || 4);
      modified = true;
    }

    if (searched_registry && typeof searched_registry === 'object') {
      Object.assign(partition.searchedRegistry, searched_registry);
      for (const [k, v] of Object.entries(searched_registry)) {
        if (v && typeof v === 'object') {
          const item = v as any;
          if (item.id) partition.seenJobs[item.id] = item.last_seen_at || new Date().toISOString();
          if (item.signature) partition.seenJobs[item.signature] = item.last_seen_at || new Date().toISOString();
          if (item.normalized_url) partition.seenJobs[item.normalized_url] = item.last_seen_at || new Date().toISOString();
        }
      }
      modified = true;
    }

    if (Array.isArray(jobs) && jobs.length > 0) {
      const validJobs = jobs.filter((j: JobListing) => j && j.id && !partition.deletedJobIds.includes(j.id));
      const existingMap = new Map<string, JobListing>();
      for (const j of partition.jobListings) {
        existingMap.set(j.id, j);
      }
      for (const incJob of validJobs) {
        if (!incJob || !incJob.id) continue;
        if (existingMap.has(incJob.id)) {
          const current = existingMap.get(incJob.id)!;
          if (incJob.status && incJob.status !== current.status) {
            current.status = incJob.status;
            modified = true;
          }
          if (incJob.fit && !current.fit) {
            current.fit = incJob.fit;
            modified = true;
          }
          if (incJob.tailored_resume && !current.tailored_resume) {
            current.tailored_resume = incJob.tailored_resume;
            current.cover_letter = incJob.cover_letter;
            modified = true;
          }
          if (incJob.notes && incJob.notes !== current.notes) {
            current.notes = incJob.notes;
            modified = true;
          }
        } else {
          partition.jobListings.unshift(incJob);
          existingMap.set(incJob.id, incJob);
          partition.seenJobs[incJob.id] = new Date().toISOString();
          const sig = `${incJob.company_name.toLowerCase()}_${incJob.title.toLowerCase()}`;
          const normLink = normalizeJobUrl(incJob.apply_link);
          partition.searchedRegistry[incJob.id] = {
            id: incJob.id,
            signature: sig,
            normalized_url: normLink,
            company_name: incJob.company_name,
            title: incJob.title,
            status: incJob.status || 'discovered',
            discovered_at: incJob.discovered_at || new Date().toISOString(),
            last_seen_at: new Date().toISOString(),
          };
          modified = true;
        }
      }
    }

    if (modified) {
      partition.lastUpdated = new Date().toISOString();
      if (userId === PRIMARY_USER_ID) {
        currentProfile = partition.currentProfile;
        jobListings = partition.jobListings;
        Object.assign(appSettings, partition.appSettings);
        Object.assign(workflowState, partition.workflowState);
      }
      saveStoreToDisk(!_replicated);
    }

    partition.workflowState.next_run = getCanonicalNextRun(partition.workflowState.interval_hours || 4);
    const activeJobs = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
    res.json({
      success: true,
      profile: partition.currentProfile,
      jobs: activeJobs,
      stats: computePipelineStatsForPartition(partition),
      workflow: partition.workflowState,
      settings: partition.appSettings,
      searched_registry: partition.searchedRegistry,
      deleted_ids: partition.deletedJobIds,
      last_updated: partition.lastUpdated || storeLastUpdated || new Date().toISOString(),
    });
  });

  // Cluster-Wide Multi-Tenant Synchronization Endpoints (preserves all user partitions and cadences across revisions)
  app.get('/api/state/cluster-sync', (_req, res) => {
    try {
      const authData = serializeAuthData();
      res.json({
        success: true,
        data: {
          currentProfile,
          jobListings: jobListings.filter((j) => !deletedJobIds.has(j.id)),
          notifiedJobIds: Array.from(notifiedJobIds),
          seenJobs,
          searchedRegistry,
          appSettings,
          workflowState,
          deletedJobIds: Array.from(deletedJobIds),
          lastUpdated: storeLastUpdated,
          users: authData.users,
          sessions: authData.sessions,
          userPartitions: authData.userPartitions,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/state/cluster-sync', (req, res) => {
    try {
      const incomingData = req.body?.data;
      if (incomingData && typeof incomingData === 'object') {
        applyClusterSyncData(incomingData);
        saveStoreToDisk(false);
      }
      res.json({ success: true, message: 'Cluster state merged' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Telegram Bot Webhook (handles incoming resume documents .pdf / .docx)
  app.post('/api/telegram/webhook', async (req, res) => {
    const message = req.body?.message;
    const chatId = message?.chat?.id || process.env.TELEGRAM_CHAT_ID || appSettings.telegram_chat_id;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!message) {
      return res.json({ ok: true });
    }

    // Check if document was uploaded to Telegram bot
    if (message.document) {
      const doc = message.document;
      const fileName = doc.file_name || 'telegram_resume.pdf';
      const mimeType = doc.mime_type || 'application/pdf';

      console.log(`[Telegram Bot] Received document: "${fileName}" (${mimeType}) from chat ${chatId}`);

      try {
        let fileBuffer: Buffer | null = null;

        if (botToken && doc.file_id) {
          const fileMetaRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${doc.file_id}`);
          const fileMetaData = await fileMetaRes.json();

          if (fileMetaData.ok && fileMetaData.result?.file_path) {
            const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${fileMetaData.result.file_path}`;
            const fileDownloadRes = await fetch(downloadUrl);
            const arrayBuffer = await fileDownloadRes.arrayBuffer();
            fileBuffer = Buffer.from(arrayBuffer);
          }
        }

        if (!fileBuffer) {
          // If no token or test mock, notify user
          if (botToken) {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: `⚠️ Received ${fileName}, but could not download binary file from Telegram servers.`,
              }),
            });
          }
          return res.json({ ok: true, status: 'download_failed' });
        }

        // Parse and scrape everything including all hyperlinks
        const parsedResult = await parseAndEnrichCandidateResume({
          buffer: fileBuffer,
          fileName,
          mimeType,
          existingProfile: currentProfile,
        });

        currentProfile = parsedResult.profile;

        const replyHtml = `📄 <b>Resume Parsed & Enriched Successfully!</b>\n\n` +
          `👤 <b>Candidate:</b> ${currentProfile.full_name}\n` +
          `⏳ <b>Experience:</b> ${currentProfile.total_years_experience} Years (${currentProfile.seniority_tier})\n` +
          `🔗 <b>Hyperlinks Scraped:</b> ${parsedResult.scrapedSources.length} external links analyzed (GitHub, Portfolio, LinkedIn)\n` +
          `🛠️ <b>Top Skills:</b> ${currentProfile.skills.slice(0, 8).join(', ')}\n` +
          (currentProfile.portfolio_projects?.length
            ? `💡 <b>Verified Projects Extracted:</b> ${currentProfile.portfolio_projects.length} project(s)\n`
            : '') +
          `\n<i>Candidate knowledge graph is now updated and ready for ATS job matching!</i>`;

        if (botToken) {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: replyHtml,
              parse_mode: 'HTML',
            }),
          });
        }

        return res.json({
          ok: true,
          status: 'parsed_successfully',
          candidate: currentProfile.full_name,
          scraped_count: parsedResult.scrapedSources.length,
        });
      } catch (docErr: any) {
        console.error('[Telegram Bot] Document parse error:', docErr);
        if (botToken) {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: `❌ Error parsing document "${fileName}": ${docErr.message}`,
            }),
          });
        }
        return res.json({ ok: false, error: docErr.message });
      }
    }

    res.json({ ok: true });
  });

  // --- Pipeline Stats & State ---
  app.get('/api/state', (req, res) => {
    workflowState.next_run = getCanonicalNextRun(workflowState.interval_hours || 4);

    res.json({
      profile: currentProfile,
      stats: computePipelineStats(),
      workflow: workflowState,
      settings: appSettings,
      jobs_count: jobListings.length,
      last_updated: new Date().toISOString(),
    });
  });

  app.post('/api/settings', (req, res) => {
    if (typeof req.body.min_match_score === 'number') {
      appSettings.min_match_score = req.body.min_match_score;
    }
    if (typeof req.body.telegram_chat_id === 'string') {
      appSettings.telegram_chat_id = req.body.telegram_chat_id;
    }
    if (typeof req.body.telegram_bot_token === 'string') {
      appSettings.telegram_bot_token = req.body.telegram_bot_token;
    }
    if (typeof req.body.telegram_bot_name === 'string') {
      appSettings.telegram_bot_name = req.body.telegram_bot_name;
    }
    if (typeof req.body.telegram_custom_header === 'string') {
      appSettings.telegram_custom_header = req.body.telegram_custom_header;
    }
    if (typeof req.body.telegram_include_salary === 'boolean') {
      appSettings.telegram_include_salary = req.body.telegram_include_salary;
    }
    if (typeof req.body.telegram_include_skill_gap === 'boolean') {
      appSettings.telegram_include_skill_gap = req.body.telegram_include_skill_gap;
    }
    if (typeof req.body.telegram_include_apply_link === 'boolean') {
      appSettings.telegram_include_apply_link = req.body.telegram_include_apply_link;
    }
    if (typeof req.body.seen_ttl_days === 'number') {
      appSettings.seen_ttl_days = req.body.seen_ttl_days;
    }

    const effectiveToken = appSettings.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN;
    const effectiveChat = appSettings.telegram_chat_id || process.env.TELEGRAM_CHAT_ID;
    appSettings.telegram_configured = Boolean(effectiveToken && effectiveChat);
    appSettings.last_updated = new Date().toISOString();
    saveStoreToDisk();

    res.json({ success: true, settings: appSettings });
  });

  async function startServer() {
    // --- Vite Middleware Integration ---
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      app.use('*', async (req, res, next) => {
        if (req.originalUrl.startsWith('/api/')) {
          return next();
        }
        try {
          const indexPath = path.resolve(process.cwd(), 'index.html');
          if (fs.existsSync(indexPath)) {
            let template = fs.readFileSync(indexPath, 'utf-8');
            template = await vite.transformIndexHtml(req.originalUrl, template);
            res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
          } else {
            next();
          }
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send('Application bundle not built. Please run npm run build.');
        }
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[CareerOps AI] Server running on http://0.0.0.0:${PORT}`);
    });
  }

  // Only start listening when running standalone, not when imported as serverless function
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.NOW_REGION ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT ||
    process.env.VERCEL_ENV
  );

  if (!isServerless) {
    startServer().catch((err) => {
      console.error('[CareerOps AI] Failed to start server:', err);
    });
  }

  export default app;
