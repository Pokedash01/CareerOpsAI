import fs from "fs";
import path from "path";
import {
  initRelationalDatabase,
  saveRelationalDatabase,
  decomposePartitionToDb,
  recomposePartitionFromDb,
  dbUsers,
  dbSessions,
  dbJobs,
  dbUserJobs,
  DB_DIR,
  BUNDLED_DB_DIR
} from "./database.js";
const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "careerops_store.json");
const BUNDLED_STORE_FILE = path.join(process.cwd(), "data", "careerops_store.json");
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KV_KEY = "careerops_store_v1";
async function loadFromRemoteKV() {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4e3);
    const res = await fetch(`${KV_URL}/get/${KV_KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.result) {
      const parsed = typeof json.result === "string" ? JSON.parse(json.result) : json.result;
      if (parsed && Array.isArray(parsed.jobListings)) {
        console.log(`[Storage] Successfully loaded state from Cloud KV (${parsed.jobListings.length} jobs)`);
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[Storage] Remote KV load warning:", err.message);
  }
  return null;
}
async function saveToRemoteKV(data) {
  if (!KV_URL || !KV_TOKEN) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5e3);
    const res = await fetch(`${KV_URL}/set/${KV_KEY}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      signal: controller.signal
    });
    clearTimeout(timeout);
    return res.ok;
  } catch (err) {
    console.warn("[Storage] Remote KV save warning:", err.message);
    return false;
  }
}
const candidatePaths = [
  STORE_FILE,
  BUNDLED_STORE_FILE,
  path.join(process.cwd(), "careerops_store.json"),
  path.join("/tmp", "careerops_store.json")
];
function loadFromDisk() {
  try {
    const usersPath = path.join(DB_DIR, "users.json");
    const jobsPath = path.join(DB_DIR, "jobs.json");
    const bundledUsersPath = path.join(BUNDLED_DB_DIR, "users.json");
    const hasRelationalDb = fs.existsSync(usersPath) || fs.existsSync(bundledUsersPath) || fs.existsSync(jobsPath);
    let legacyStore = null;
    let latestTime = -1;
    for (const filePath of candidatePaths) {
      if (fs.existsSync(filePath)) {
        try {
          const raw = fs.readFileSync(filePath, "utf-8");
          const data = JSON.parse(raw);
          if (data && (Array.isArray(data.jobListings) && data.jobListings.length > 0 || data.users && Object.keys(data.users).length > 0)) {
            const fileTime = data.lastUpdated ? new Date(data.lastUpdated).getTime() : 0;
            if (!legacyStore || fileTime > latestTime) {
              legacyStore = data;
              latestTime = fileTime;
            }
          }
        } catch {
        }
      }
    }
    initRelationalDatabase(legacyStore);
    if (Object.keys(dbUsers).length > 0 || Object.keys(dbJobs).length > 0) {
      const reconstructedPartitions = {};
      for (const userId of Object.keys(dbUsers)) {
        reconstructedPartitions[userId] = recomposePartitionFromDb(userId);
      }
      const primaryPartition = reconstructedPartitions["usr_kb270102"] || recomposePartitionFromDb("usr_kb270102");
      const reconstructedStore = {
        users: { ...dbUsers },
        sessions: { ...dbSessions },
        userPartitions: reconstructedPartitions,
        currentProfile: primaryPartition.currentProfile,
        jobListings: primaryPartition.jobListings,
        notifiedJobIds: primaryPartition.notifiedJobIds,
        deletedJobIds: primaryPartition.deletedJobIds,
        seenJobs: primaryPartition.seenJobs,
        searchedRegistry: primaryPartition.searchedRegistry,
        appSettings: primaryPartition.appSettings,
        workflowState: primaryPartition.workflowState,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
      console.log(`[Storage] Hydrated from relational JSON DB (${Object.keys(dbUsers).length} users, ${Object.keys(dbJobs).length} jobs, ${Object.keys(dbUserJobs).length} relations)`);
      return reconstructedStore;
    }
    if (legacyStore) {
      return legacyStore;
    }
  } catch (err) {
    console.error("[Storage] Error reading disk store:", err);
  }
  return null;
}
function saveToDisk(data) {
  try {
    if (data.users && typeof data.users === "object") {
      Object.assign(dbUsers, data.users);
    }
    if (data.sessions && typeof data.sessions === "object") {
      Object.assign(dbSessions, data.sessions);
    }
    if (data.userPartitions && typeof data.userPartitions === "object") {
      for (const [userId, partition] of Object.entries(data.userPartitions)) {
        if (partition) {
          decomposePartitionToDb(userId, partition);
        }
      }
    }
    saveRelationalDatabase();
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
    if (STORE_FILE !== BUNDLED_STORE_FILE && fs.existsSync(path.dirname(BUNDLED_STORE_FILE))) {
      fs.writeFileSync(BUNDLED_STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("[Storage] Failed to save store to disk:", err);
  }
}
export {
  loadFromDisk,
  loadFromRemoteKV,
  saveToDisk,
  saveToRemoteKV
};
