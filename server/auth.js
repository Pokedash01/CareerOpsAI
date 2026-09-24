import crypto from "crypto";
import { INITIAL_PROFILE, INITIAL_JOBS, INITIAL_SETTINGS } from "./seedData.js";
import { computeSafeJobId, normalizeJobUrl } from "./jobSearch.js";
const SESSION_COOKIE_NAME = "careerops_session";
const SESSION_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1e3;
const PRIMARY_USER_ID = "usr_kb270102";
const DEMO_USER_ID = "usr_demo";
const users = {};
const userEmailIndex = {};
const sessions = {};
const userPartitions = {};
const passwordResetCodes = {};
function createPasswordResetCode(email) {
  const cleanEmail = email.toLowerCase().trim();
  const code = Math.floor(1e5 + Math.random() * 9e5).toString();
  const now = Date.now();
  passwordResetCodes[cleanEmail] = {
    email: cleanEmail,
    code,
    created_at: new Date(now).toISOString(),
    expires_at: new Date(now + 15 * 60 * 1e3).toISOString()
    // 15 mins
  };
  return code;
}
function verifyAndResetPassword(email, code, newPassword) {
  const cleanEmail = email.toLowerCase().trim();
  const record = passwordResetCodes[cleanEmail];
  if (!record) {
    return { success: false, error: "No active password reset request found for this email. Please request a new code." };
  }
  if (new Date(record.expires_at).getTime() < Date.now()) {
    delete passwordResetCodes[cleanEmail];
    return { success: false, error: "The verification code has expired. Please request a new one." };
  }
  if (record.code.trim() !== code.trim()) {
    return { success: false, error: "Incorrect verification code. Please check and try again." };
  }
  const userId = userEmailIndex[cleanEmail];
  if (!userId || !users[userId]) {
    return { success: false, error: "User account not found." };
  }
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "New password must be at least 6 characters long." };
  }
  const { hash, salt } = hashPassword(newPassword);
  users[userId].password_hash = hash;
  users[userId].salt = salt;
  users[userId].last_login_at = (/* @__PURE__ */ new Date()).toISOString();
  for (const [token, sess] of Object.entries(sessions)) {
    if (sess.user_id === userId) {
      delete sessions[token];
    }
  }
  delete passwordResetCodes[cleanEmail];
  return { success: true, user: users[userId] };
}
function hashPassword(password, customSalt) {
  const salt = customSalt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}
function verifyPassword(password, storedHash, salt) {
  try {
    const derived = crypto.scryptSync(password, salt, 64).toString("hex");
    const a = Buffer.from(derived, "hex");
    const b = Buffer.from(storedHash, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}
function getCanonicalNextRun(intervalHours = 4) {
  const now = Date.now();
  const intervalMs = (intervalHours || 4) * 3600 * 1e3;
  const nextTimestamp = Math.ceil((now + 1e3) / intervalMs) * intervalMs;
  return new Date(nextTimestamp).toISOString();
}
function createDefaultPartitionForUser(user, preferences) {
  const chosenRoles = preferences?.target_roles?.length ? preferences.target_roles : ["Software Engineer", "Full Stack Developer", "Data Analyst", "Solutions Architect"];
  const chosenLocations = preferences?.preferred_locations?.length ? preferences.preferred_locations : ["Remote", "Bengaluru", "Delhi NCR", "Hybrid"];
  const chosenSalary = preferences?.salary_expectation || { min_lpa: 12, max_lpa: 25 };
  const chosenExp = preferences?.total_years_experience !== void 0 ? preferences.total_years_experience : 2.5;
  const chosenTier = preferences?.seniority_tier || (chosenExp >= 5 ? "Senior" : chosenExp >= 2 ? "Mid" : "Entry");
  const userProfile = {
    full_name: user?.full_name || "Candidate",
    contact: {
      email: user?.email || "",
      phone: "",
      location: chosenLocations[0] || "Remote",
      links: ""
    },
    total_years_experience: chosenExp,
    seniority_tier: chosenTier,
    education: [
      {
        institution: "University / Institute",
        degree: "Bachelor of Science / Technology",
        details: "Engineering / Computer Science",
        dates: "2020 \u2013 2024"
      }
    ],
    experience: [],
    skills: preferences?.skills?.length ? preferences.skills : ["Python", "SQL", "TypeScript", "React", "Node.js", "System Design"],
    certifications: [],
    target_roles: chosenRoles,
    anti_targets: ["Telemarketing", "Cold Calling Sales", "Unpaid Internships"],
    preferred_locations: chosenLocations,
    salary_expectation: chosenSalary
  };
  const defaultChatId = user?.telegram_chat_id || (user?.id === PRIMARY_USER_ID ? process.env.TELEGRAM_CHAT_ID || "1368681854" : "");
  const defaultBotToken = process.env.TELEGRAM_BOT_TOKEN || "8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas";
  const hasTelegram = Boolean(defaultChatId);
  const partitionSettings = {
    min_match_score: 75,
    telegram_configured: hasTelegram,
    telegram_chat_id: defaultChatId,
    telegram_bot_token: defaultBotToken,
    telegram_bot_name: "CareerOps Bot",
    telegram_custom_header: `\u{1F3AF} ${user?.full_name || "CareerOps"} High-Fit Role!`,
    telegram_include_salary: true,
    telegram_include_skill_gap: true,
    telegram_include_apply_link: true,
    seen_ttl_days: 14,
    workflow_enabled: true,
    workflow_interval_hours: 4,
    auto_notify_telegram: hasTelegram
  };
  const partitionWorkflow = {
    enabled: true,
    interval_hours: 4,
    last_run: null,
    next_run: new Date(Date.now() + 4 * 3600 * 1e3).toISOString(),
    is_running: false,
    total_runs: 0,
    auto_notify_telegram: hasTelegram,
    runs: []
  };
  const isDemoAccount = (user?.id === PRIMARY_USER_ID || user?.email === "demo@careerops.ai") && !preferences;
  const sampleJobs = isDemoAccount ? INITIAL_JOBS.slice(0, 8).map((j, idx) => ({
    ...j,
    id: computeSafeJobId(j.title, `${j.company_name}_${user?.id || "sample"}_${idx}`),
    status: idx === 0 ? "discovered" : idx === 1 ? "notified" : "discovered"
  })) : [];
  const partitionRegistry = {};
  for (const j of sampleJobs) {
    const sig = `${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`;
    const normLink = normalizeJobUrl(j.apply_link);
    partitionRegistry[j.id] = {
      id: j.id,
      signature: sig,
      normalized_url: normLink,
      company_name: j.company_name,
      title: j.title,
      status: j.status || "discovered",
      discovered_at: (/* @__PURE__ */ new Date()).toISOString(),
      last_seen_at: (/* @__PURE__ */ new Date()).toISOString()
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
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function seedDefaultUsers() {
  if (!users[PRIMARY_USER_ID]) {
    const { hash, salt } = hashPassword("careerops123");
    const primaryAccount = {
      id: PRIMARY_USER_ID,
      email: "kb270102@gmail.com",
      full_name: "Kartik Bhatt",
      password_hash: hash,
      salt,
      created_at: "2026-01-01T00:00:00.000Z",
      last_login_at: (/* @__PURE__ */ new Date()).toISOString(),
      telegram_chat_id: process.env.TELEGRAM_CHAT_ID || "1368681854"
    };
    users[PRIMARY_USER_ID] = primaryAccount;
    userEmailIndex["kb270102@gmail.com"] = PRIMARY_USER_ID;
  }
  if (!users[DEMO_USER_ID]) {
    const { hash, salt } = hashPassword("demo123");
    const demoAccount = {
      id: DEMO_USER_ID,
      email: "demo@careerops.ai",
      full_name: "Demo Candidate",
      password_hash: hash,
      salt,
      created_at: "2026-01-01T00:00:00.000Z",
      last_login_at: (/* @__PURE__ */ new Date()).toISOString(),
      telegram_chat_id: "1368681854"
    };
    users[DEMO_USER_ID] = demoAccount;
    userEmailIndex["demo@careerops.ai"] = DEMO_USER_ID;
  }
}
seedDefaultUsers();
function resolveAuthUser(req) {
  let token = req.cookies?.[SESSION_COOKIE_NAME];
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      token = parts[1];
    }
  }
  if (!token && typeof req.query.auth_token === "string") {
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
function getUserPartition(userId, initialPreferences) {
  if (!userPartitions[userId]) {
    userPartitions[userId] = createDefaultPartitionForUser(users[userId], initialPreferences);
  }
  return userPartitions[userId];
}
function getAllUserPartitions() {
  const list = [];
  for (const [userId, partition] of Object.entries(userPartitions)) {
    if (partition) {
      list.push({ userId, user: users[userId], partition });
    }
  }
  return list;
}
function createSessionForUser(userId, userAgent) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS).toISOString();
  sessions[token] = {
    token,
    user_id: userId,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    expires_at: expiresAt,
    user_agent: userAgent
  };
  return token;
}
function attachSessionCookie(res, req, token) {
  const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https" || req.headers.host && !req.headers.host.includes("localhost");
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_MS,
    sameSite: "lax",
    secure: isHttps,
    path: "/"
  });
}
function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
}
function getSavedAccountsList() {
  return Object.values(users).map((u) => ({
    id: u.id,
    email: u.email,
    name: u.full_name || u.email.split("@")[0],
    full_name: u.full_name,
    telegram_chat_id: u.telegram_chat_id,
    last_active_at: u.last_login_at || (/* @__PURE__ */ new Date()).toISOString(),
    last_login_at: u.last_login_at
  }));
}
function serializeAuthData() {
  return {
    users,
    sessions,
    userPartitions
  };
}
function deserializeAuthData(data, legacyData) {
  if (data?.users && typeof data.users === "object") {
    Object.assign(users, data.users);
    for (const [id, u] of Object.entries(users)) {
      if (u?.email) {
        userEmailIndex[u.email.toLowerCase()] = id;
      }
    }
  }
  if (data?.sessions && typeof data.sessions === "object") {
    const now = Date.now();
    for (const [token, s] of Object.entries(data.sessions)) {
      if (s && new Date(s.expires_at).getTime() > now) {
        sessions[token] = s;
      }
    }
  }
  if (data?.userPartitions && typeof data.userPartitions === "object") {
    Object.assign(userPartitions, data.userPartitions);
  }
  seedDefaultUsers();
  if ((!userPartitions[PRIMARY_USER_ID] || userPartitions[PRIMARY_USER_ID].jobListings.length === 0) && legacyData && Array.isArray(legacyData.jobListings) && legacyData.jobListings.length > 0) {
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
        runs: []
      },
      lastUpdated: legacyData.lastUpdated || (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  if (!userPartitions[DEMO_USER_ID]) {
    userPartitions[DEMO_USER_ID] = createDefaultPartitionForUser(users[DEMO_USER_ID]);
  }
}
export {
  DEMO_USER_ID,
  PRIMARY_USER_ID,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
  attachSessionCookie,
  clearSessionCookie,
  createDefaultPartitionForUser,
  createPasswordResetCode,
  createSessionForUser,
  deserializeAuthData,
  generateSessionToken,
  getAllUserPartitions,
  getCanonicalNextRun,
  getSavedAccountsList,
  getUserPartition,
  hashPassword,
  passwordResetCodes,
  resolveAuthUser,
  seedDefaultUsers,
  serializeAuthData,
  sessions,
  userEmailIndex,
  userPartitions,
  users,
  verifyAndResetPassword,
  verifyPassword
};
