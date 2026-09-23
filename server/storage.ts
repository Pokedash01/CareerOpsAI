import fs from 'fs';
import path from 'path';

export interface StorageData {
  currentProfile?: any;
  jobListings?: any[];
  notifiedJobIds?: string[];
  seenJobs?: Record<string, string>;
  searchedRegistry?: Record<string, any>;
  appSettings?: any;
  workflowState?: any;
  deletedJobIds?: string[];
  lastUpdated?: string;

  // Multi-user authentication & data partitions
  users?: Record<string, any>;
  sessions?: Record<string, any>;
  userPartitions?: Record<string, any>;
}

const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'careerops_store.json');
const BUNDLED_STORE_FILE = path.join(process.cwd(), 'data', 'careerops_store.json');

// Upstash / Vercel KV REST configuration
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KV_KEY = 'careerops_store_v1';

/**
 * Attempts to load store from Upstash / Vercel KV if configured
 */
export async function loadFromRemoteKV(): Promise<StorageData | null> {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${KV_URL}/get/${KV_KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const json: any = await res.json();
    if (json && json.result) {
      const parsed = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
      if (parsed && Array.isArray(parsed.jobListings)) {
        console.log(`[Storage] Successfully loaded state from Cloud KV (${parsed.jobListings.length} jobs)`);
        return parsed;
      }
    }
  } catch (err: any) {
    console.warn('[Storage] Remote KV load warning:', err.message);
  }
  return null;
}

/**
 * Saves store to Upstash / Vercel KV if configured
 */
export async function saveToRemoteKV(data: StorageData): Promise<boolean> {
  if (!KV_URL || !KV_TOKEN) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${KV_URL}/set/${KV_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok;
  } catch (err: any) {
    console.warn('[Storage] Remote KV save warning:', err.message);
    return false;
  }
}

/**
 * Loads store synchronously from local disk / tmp / bundled files
 */
const candidatePaths = [
  STORE_FILE,
  BUNDLED_STORE_FILE,
  path.join(process.cwd(), 'careerops_store.json'),
  path.join('/tmp', 'careerops_store.json'),
];

export function loadFromDisk(): StorageData | null {
  try {
    let bestData: StorageData | null = null;
    let latestTime = -1;
    for (const filePath of candidatePaths) {
      if (fs.existsSync(filePath)) {
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          const data = JSON.parse(raw);
          if (data && ((Array.isArray(data.jobListings) && data.jobListings.length > 0) || (data.users && Object.keys(data.users).length > 0))) {
            const fileTime = data.lastUpdated ? new Date(data.lastUpdated).getTime() : 0;
            if (!bestData || fileTime > latestTime) {
              bestData = data;
              latestTime = fileTime;
            }
          }
        } catch {}
      }
    }
    if (bestData) {
      return bestData;
    }
  } catch (err) {
    console.error('[Storage] Error reading disk store:', err);
  }
  return null;
}

/**
 * Saves store synchronously to local disk (/tmp in serverless, data/ in dev)
 */
export function saveToDisk(data: StorageData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage] Failed to save store to disk:', err);
  }

  // Also write to data/careerops_store.json if it's different and parent dir exists/writable
  try {
    if (STORE_FILE !== BUNDLED_STORE_FILE && fs.existsSync(path.dirname(BUNDLED_STORE_FILE))) {
      fs.writeFileSync(BUNDLED_STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
  } catch {}
}
