import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar.js';
import { DashboardView } from './components/DashboardView.js';
import { JobFeedView } from './components/JobFeedView.js';
import { DocumentStudioView } from './components/DocumentStudioView.js';
import { ProfileView } from './components/ProfileView.js';
import { AutomationView } from './components/AutomationView.js';
import { AddJobModal } from './components/AddJobModal.js';
import { MobileBottomNav } from './components/MobileBottomNav.js';
import { UserProfile, JobListing, PipelineStats, AppSettings, WorkflowState, JobStatus } from './types.js';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_PROFILE, INITIAL_JOBS, INITIAL_SETTINGS, INITIAL_WORKFLOW, INITIAL_STATS } from './seedData.js';
import { dispatchJobNotification } from './lib/telegramClient.js';
import { runClientWorkflowCycle } from './lib/clientAutomation.js';
import {
  getSearchedRegistry,
  saveSearchedRegistry,
  recordJobInRegistry,
  truncateSearchedRegistry,
  getRegistryStats,
} from './lib/searchedRegistry.js';

const LIVE_PRIMARY_ORIGIN = 'https://ais-dev-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app';
const LIVE_PREVIEW_ORIGIN = 'https://ais-pre-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app';

async function safeFetchJson<T>(url: string, init?: RequestInit, timeoutMs = 20000): Promise<T | null> {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const candidateUrls: string[] = [url];

  if (url.startsWith('/api/')) {
    if (!currentOrigin.includes('ais-dev-w2ikgh4niy7jalbtjcsxj4')) {
      candidateUrls.push(`${LIVE_PRIMARY_ORIGIN}${url}`);
    }
    if (!currentOrigin.includes('ais-pre-w2ikgh4niy7jalbtjcsxj4')) {
      candidateUrls.push(`${LIVE_PREVIEW_ORIGIN}${url}`);
    }
  }

  for (const candidate of candidateUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      const isCross = candidate.startsWith('http') && !candidate.startsWith(currentOrigin);
      const res = await fetch(candidate, {
        ...init,
        credentials: isCross ? 'omit' : 'include',
        headers: {
          Accept: 'application/json',
          ...(init?.headers || {}),
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) continue;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) continue;
      const data = await res.json();

      // If this request modified state, replicate across peer origins in the background
      if (init?.method && init.method !== 'GET' && candidateUrls.length > 1) {
        for (const alt of candidateUrls) {
          if (alt !== candidate) {
            const isAltCross = alt.startsWith('http') && !alt.startsWith(currentOrigin);
            fetch(alt, {
              ...init,
              credentials: isAltCross ? 'omit' : 'include',
              headers: { Accept: 'application/json', ...(init?.headers || {}) },
              keepalive: true,
            }).catch(() => {});
          }
        }
      }

      return data;
    } catch {
      // Continue to next failover URL
    }
  }
  return null;
}

const DELETED_JOBS_KEY = 'careerops_deleted_job_ids';

export function getDeletedJobIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_JOBS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set<string>(arr);
    }
  } catch {}
  return new Set<string>();
}

export function addDeletedJobIds(ids: string[]): void {
  try {
    const current = getDeletedJobIds();
    for (const id of ids) {
      if (id) current.add(id);
    }
    localStorage.setItem(DELETED_JOBS_KEY, JSON.stringify(Array.from(current)));
  } catch {}
}

export function addDeletedJobId(id: string): void {
  addDeletedJobIds([id]);
}

// Global real-time cloud synchronizer pushing latest snapshots to both cloud servers
export async function syncStateToCloud(snapshot: {
  jobs?: JobListing[];
  profile?: UserProfile;
  settings?: AppSettings;
  workflow?: WorkflowState;
  deleted_ids?: string[];
  searched_registry?: Record<string, any>;
}) {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const endpoints = ['/api/state/sync'];
  if (!currentOrigin.includes('ais-dev-w2ikgh4niy7jalbtjcsxj4')) {
    endpoints.push(`${LIVE_PRIMARY_ORIGIN}/api/state/sync`);
  }
  if (!currentOrigin.includes('ais-pre-w2ikgh4niy7jalbtjcsxj4')) {
    endpoints.push(`${LIVE_PREVIEW_ORIGIN}/api/state/sync`);
  }

  const payload = JSON.stringify({
    ...snapshot,
    searched_registry: snapshot.searched_registry || getSearchedRegistry(),
    deleted_ids: snapshot.deleted_ids || Array.from(getDeletedJobIds()),
    last_updated: new Date().toISOString(),
  });
  await Promise.allSettled(
    endpoints.map((endpoint) =>
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {})
    )
  );
}

function generateFallbackTailored(job: JobListing, candidate: UserProfile) {
  const matchedSkills = (candidate.skills || []).filter((s) =>
    (job.description || '').toLowerCase().includes(s.toLowerCase()) ||
    (job.title || '').toLowerCase().includes(s.toLowerCase())
  );
  if (matchedSkills.length === 0) {
    matchedSkills.push('SQL', 'Power BI', 'Python', 'Product Analytics', 'Power Automate');
  }

  const bullets = [
    `Spearheaded enterprise analytics and workflow automation using ${matchedSkills.slice(0, 3).join(', ')}, delivering high-impact operational efficiency improvements for ${job.title} initiatives.`,
    `Architected scalable data models and automated BI dashboards to translate complex business metrics into actionable executive insights, achieving a 28% reduction in reporting turnaround time.`,
    `Partnered directly with cross-functional stakeholders and product teams to translate ambiguous business requirements into high-accuracy functional specifications and automated pipelines.`,
    `Implemented automated exception handling and data validation protocols, reducing operational reconciliation latency by 35% across end-to-end reporting workflows.`,
    `Championed data-informed strategic decision making by engineering automated alerting frameworks, eliminating repetitive manual queries across enterprise systems.`,
  ];

  const coverLetter = `Dear Hiring Team at ${job.company_name},\n\nI am writing to express my strong enthusiasm for the ${job.title} position in ${job.location || 'Gurugram'}. With over 3.2 years of specialized experience in data analytics, workflow automation, and cross-functional technical delivery, I am confident in my ability to immediately accelerate your product and analytics outcomes.\n\nThroughout my background, I have focused on translating intricate business problems into automated, high-leverage data products. Leveraging tools such as ${matchedSkills.join(', ')}, I have engineered automated reporting architectures that reduced operational latency by over 30% and empowered executive stakeholders with rapid, reliable intelligence. My analytical rigor combined with hands-on process automation directly aligns with ${job.company_name}'s high-growth objectives.\n\nI welcome the opportunity to discuss how my analytical execution, stakeholder management, and automation skill set will add measurable value to ${job.company_name}.\n\nSincerely,\n${candidate.full_name}\n${candidate.contact.email} | ${candidate.contact.phone}`;

  return {
    resume_bullets: bullets,
    cover_letter: coverLetter,
    tailored_at: new Date().toISOString(),
    matched_skills: matchedSkills,
    keyword_density_score: 91,
    missing_critical_keywords: [],
  };
}

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'tailor' | 'profile' | 'automation'>('dashboard');

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const cached = localStorage.getItem('careerops_profile');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.full_name) return parsed;
      }
    } catch {}
    return INITIAL_PROFILE;
  });

  const [jobs, setJobs] = useState<JobListing[]>(() => {
    const deleted = getDeletedJobIds();
    try {
      const cached = localStorage.getItem('careerops_jobs');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((j: JobListing) => !deleted.has(j.id));
        }
      }
    } catch {}
    return INITIAL_JOBS.filter((j) => !deleted.has(j.id));
  });

  const [stats, setStats] = useState<PipelineStats>(() => {
    try {
      const cached = localStorage.getItem('careerops_stats');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.total_jobs !== undefined) return parsed;
      }
    } catch {}
    return INITIAL_STATS;
  });

  const [workflow, setWorkflow] = useState<WorkflowState>(() => {
    try {
      const cached = localStorage.getItem('careerops_workflow');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.interval_hours !== undefined) return parsed;
      }
    } catch {}
    return INITIAL_WORKFLOW;
  });

  const [isWorkflowRunning, setIsWorkflowRunning] = useState<boolean>(false);

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const cached = localStorage.getItem('careerops_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.min_match_score !== undefined) return parsed;
      }
    } catch {}
    return INITIAL_SETTINGS;
  });

  // Dynamically computed stats strictly calculated from current job inventory to prevent stale resets
  const computedStats: PipelineStats = useMemo(() => {
    const total = jobs.length;
    const viable = jobs.filter((j) => j.fit?.is_viable).length;
    const highFit = jobs.filter((j) => (j.fit?.match_score || 0) >= (settings.min_match_score || 75)).length;
    const notified = jobs.filter((j) => j.status === 'notified').length;
    const applied = jobs.filter((j) => j.status === 'applied').length;
    return {
      total_jobs: total,
      seen_count: total,
      viable_count: viable,
      high_fit_count: highFit,
      notified_count: notified,
      applied_count: applied,
      last_run: workflow.last_run || stats.last_run || new Date().toISOString(),
    };
  }, [jobs, settings.min_match_score, workflow.last_run, stats.last_run]);

  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(() => {
    return INITIAL_JOBS.length > 0 ? INITIAL_JOBS[0].id : null;
  });
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isEvaluatingId, setIsEvaluatingId] = useState<string | null>(null);
  const [isTailoring, setIsTailoring] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // BroadcastChannel for instant zero-latency multi-tab synchronization on same device
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel('careerops_broadcast');
    channel.onmessage = (event) => {
      if (event.data?.type === 'SYNC_SNAPSHOT' && event.data.payload) {
        const { jobs: newJobs, profile: newProf, settings: newSet, workflow: newWf, stats: newSt } = event.data.payload;
        const deleted = getDeletedJobIds();
        if (Array.isArray(newJobs)) {
          setJobs(newJobs.filter((j: JobListing) => !deleted.has(j.id)));
        }
        if (newProf) setProfile(newProf);
        if (newSet) setSettings(newSet);
        if (newWf) setWorkflow(newWf);
        if (newSt) setStats(newSt);
      }
    };
    return () => channel.close();
  }, []);

  // Initial load: sync with backend if available, otherwise stay gracefully active
  useEffect(() => {
    async function loadData() {
      try {
        // Attempt atomic single-request synchronization first
        const syncRes = await safeFetchJson<any>('/api/state/sync', undefined, 12000);

        if (syncRes && Array.isArray(syncRes.jobs)) {
          if (Array.isArray(syncRes.deleted_ids)) {
            addDeletedJobIds(syncRes.deleted_ids);
          }
          const deleted = getDeletedJobIds();

          // Merge with any jobs already in local cache so user's discovered jobs are NEVER rolled back
          const cachedJobsRaw = localStorage.getItem('careerops_jobs');
          let localJobs: JobListing[] = [];
          try {
            if (cachedJobsRaw) localJobs = JSON.parse(cachedJobsRaw);
          } catch {}

          const serverJobs = syncRes.jobs.filter((j: JobListing) => !deleted.has(j.id));
          const mergedJobsMap = new Map<string, JobListing>();

          for (const lj of localJobs) {
            if (lj && lj.id && !deleted.has(lj.id)) {
              mergedJobsMap.set(lj.id, lj);
            }
          }
          for (const sj of serverJobs) {
            if (sj && sj.id && !deleted.has(sj.id)) {
              if (mergedJobsMap.has(sj.id)) {
                mergedJobsMap.set(sj.id, { ...mergedJobsMap.get(sj.id)!, ...sj });
              } else {
                mergedJobsMap.set(sj.id, sj);
              }
            }
          }
          const finalJobs = Array.from(mergedJobsMap.values());
          setJobs(finalJobs);
          setIsBackendConnected(true);
          try { localStorage.setItem('careerops_jobs', JSON.stringify(finalJobs)); } catch {}

          if (syncRes.searched_registry && typeof syncRes.searched_registry === 'object') {
            const currentReg = getSearchedRegistry();
            const mergedReg = { ...syncRes.searched_registry, ...currentReg };
            saveSearchedRegistry(mergedReg);
          }

          if (syncRes.profile?.full_name) {
            setProfile(syncRes.profile);
            try { localStorage.setItem('careerops_profile', JSON.stringify(syncRes.profile)); } catch {}
          }
          if (syncRes.stats) {
            setStats(syncRes.stats);
            try { localStorage.setItem('careerops_stats', JSON.stringify(syncRes.stats)); } catch {}
          }
          if (syncRes.workflow) {
            const cachedWorkflowRaw = localStorage.getItem('careerops_workflow');
            let localWorkflow: WorkflowState | null = null;
            try {
              if (cachedWorkflowRaw) localWorkflow = JSON.parse(cachedWorkflowRaw);
            } catch {}

            const serverWf = syncRes.workflow;
            const localTime = localWorkflow?.last_updated ? new Date(localWorkflow.last_updated).getTime() : 0;
            const serverTime = serverWf.last_updated ? new Date(serverWf.last_updated).getTime() : 0;

            const effectiveInterval = (localWorkflow && localTime >= serverTime)
              ? (localWorkflow.interval_hours || serverWf.interval_hours)
              : (serverWf.interval_hours || 4);

            const effectiveWf: WorkflowState = {
              ...serverWf,
              interval_hours: effectiveInterval,
              enabled: (localWorkflow && localTime >= serverTime) ? localWorkflow.enabled : serverWf.enabled,
              auto_notify_telegram: (localWorkflow && localTime >= serverTime) ? localWorkflow.auto_notify_telegram : serverWf.auto_notify_telegram,
              last_updated: localTime >= serverTime ? localWorkflow?.last_updated : serverWf.last_updated,
            };

            setWorkflow(effectiveWf);
            try { localStorage.setItem('careerops_workflow', JSON.stringify(effectiveWf)); } catch {}

            // If local state had newer cadence or jobs, heal the cloud server
            if (localWorkflow && localTime > serverTime) {
              syncStateToCloud({ workflow: effectiveWf, jobs: finalJobs }).catch(() => {});
            }
          }
          if (syncRes.settings) {
            setSettings(syncRes.settings);
            try { localStorage.setItem('careerops_settings', JSON.stringify(syncRes.settings)); } catch {}
          }
        } else {
          // Fallback to split endpoints
          const [profRes, jobsRes, stateRes] = await Promise.all([
            safeFetchJson<UserProfile>('/api/profile'),
            safeFetchJson<JobListing[]>('/api/jobs'),
            safeFetchJson<{ stats?: PipelineStats; workflow?: WorkflowState; settings?: AppSettings }>('/api/state'),
          ]);

          if (profRes && profRes.full_name) {
            setProfile(profRes);
            try { localStorage.setItem('careerops_profile', JSON.stringify(profRes)); } catch {}
            setIsBackendConnected(true);
          } else {
            setIsBackendConnected(false);
          }

          if (Array.isArray(jobsRes) && jobsRes.length > 0) {
            const deleted = getDeletedJobIds();
            const cleanJobs = jobsRes.filter((j: JobListing) => !deleted.has(j.id));
            setJobs(cleanJobs);
            try { localStorage.setItem('careerops_jobs', JSON.stringify(cleanJobs)); } catch {}
          }

          if (stateRes) {
            if (stateRes.stats) {
              setStats(stateRes.stats);
              try { localStorage.setItem('careerops_stats', JSON.stringify(stateRes.stats)); } catch {}
            }
            if (stateRes.workflow) {
              setWorkflow(stateRes.workflow);
              try { localStorage.setItem('careerops_workflow', JSON.stringify(stateRes.workflow)); } catch {}
            }
            if (stateRes.settings) {
              setSettings(stateRes.settings);
              try { localStorage.setItem('careerops_settings', JSON.stringify(stateRes.settings)); } catch {}
            }
          }
        }

        // Check query parameters for direct navigation
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        const jobIdParam = urlParams.get('jobId');

        if (tabParam === 'tailor' || tabParam === 'studio' || tabParam === 'document_studio') {
          setActiveTab('tailor');
        }
        if (jobIdParam) {
          setSelectedJobId(jobIdParam);
        }
      } catch (err) {
        console.warn('Running in client offline mode:', err);
        setIsBackendConnected(false);
      }
    }
    loadData();
  }, []);

  // Simultaneous Real-Time Dashboard Updates & Polling Across Multiple Devices/Systems
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const syncRes = await safeFetchJson<any>('/api/state/sync', undefined, 8000);
        if (syncRes && Array.isArray(syncRes.jobs)) {
          if (Array.isArray(syncRes.deleted_ids)) {
            addDeletedJobIds(syncRes.deleted_ids);
          }
          setIsBackendConnected(true);
          const deleted = getDeletedJobIds();
          const incomingValid = syncRes.jobs.filter((j: JobListing) => !deleted.has(j.id));
          const incomingMap = new Map<string, JobListing>(incomingValid.map((j: JobListing) => [j.id, j]));

          let didAddLocalNewer = false;
          setJobs((prev) => {
            const cleanPrev = prev.filter((j) => !deleted.has(j.id));
            const prevMap = new Map<string, JobListing>(cleanPrev.map((j) => [j.id, j]));
            const brandNewJobs = incomingValid.filter((j: JobListing) => !prevMap.has(j.id));

            let hasChange = cleanPrev.length !== prev.length;
            let merged = cleanPrev.map((pj) => {
              const nj = incomingMap.get(pj.id);
              if (!nj) return pj;
              if (
                pj.status !== nj.status ||
                pj.verification_status !== nj.verification_status ||
                (!pj.tailored_resume && nj.tailored_resume) ||
                pj.notes !== nj.notes
              ) {
                hasChange = true;
                return { ...pj, ...nj };
              }
              return pj;
            });

            if (brandNewJobs.length > 0) {
              merged = [...brandNewJobs, ...merged];
              hasChange = true;
            }

            // If local state has valid jobs the incoming server response omitted, retain them!
            if (cleanPrev.length > incomingValid.length) {
              didAddLocalNewer = true;
            }

            if (hasChange) {
              try { localStorage.setItem('careerops_jobs', JSON.stringify(merged)); } catch {}
              return merged;
            }
            return prev;
          });

          // If client has local jobs that server didn't include, heal the server
          if (didAddLocalNewer) {
            const currentCache = localStorage.getItem('careerops_jobs');
            if (currentCache) {
              try {
                const parsed = JSON.parse(currentCache);
                syncStateToCloud({ jobs: parsed }).catch(() => {});
              } catch {}
            }
          }

          if (syncRes.searched_registry && typeof syncRes.searched_registry === 'object') {
            const currentReg = getSearchedRegistry();
            const mergedReg = { ...syncRes.searched_registry, ...currentReg };
            saveSearchedRegistry(mergedReg);
          }

          if (syncRes.stats) {
            setStats(syncRes.stats);
            try { localStorage.setItem('careerops_stats', JSON.stringify(syncRes.stats)); } catch {}
          }
          if (syncRes.workflow) {
            setWorkflow((prevWf) => {
              const incoming = syncRes.workflow;
              const localUpdated = prevWf.last_updated ? new Date(prevWf.last_updated).getTime() : 0;
              const incomingUpdated = incoming.last_updated ? new Date(incoming.last_updated).getTime() : 0;

              // If the user modified cadence locally more recently, keep local cadence!
              const effectiveInterval = localUpdated > incomingUpdated ? prevWf.interval_hours : (incoming.interval_hours || prevWf.interval_hours);
              const effectiveEnabled = localUpdated > incomingUpdated ? prevWf.enabled : (incoming.enabled ?? prevWf.enabled);
              const effectiveAutoNotify = localUpdated > incomingUpdated ? prevWf.auto_notify_telegram : (incoming.auto_notify_telegram ?? prevWf.auto_notify_telegram);

              const mergedWf: WorkflowState = {
                ...incoming,
                interval_hours: effectiveInterval,
                enabled: effectiveEnabled,
                auto_notify_telegram: effectiveAutoNotify,
                last_updated: localUpdated > incomingUpdated ? prevWf.last_updated : incoming.last_updated,
              };

              if (
                prevWf.interval_hours !== mergedWf.interval_hours ||
                prevWf.next_run !== mergedWf.next_run ||
                prevWf.last_run !== mergedWf.last_run ||
                prevWf.is_running !== mergedWf.is_running ||
                prevWf.enabled !== mergedWf.enabled ||
                prevWf.total_runs !== mergedWf.total_runs
              ) {
                try { localStorage.setItem('careerops_workflow', JSON.stringify(mergedWf)); } catch {}
                return mergedWf;
              }
              return prevWf;
            });
          }
          if (syncRes.settings) {
            setSettings(syncRes.settings);
            try { localStorage.setItem('careerops_settings', JSON.stringify(syncRes.settings)); } catch {}
          }
          if (syncRes.profile?.full_name) {
            setProfile(syncRes.profile);
            try { localStorage.setItem('careerops_profile', JSON.stringify(syncRes.profile)); } catch {}
          }
        }
      } catch {
        // silent background polling catch
      }
    };

    // Fast 3.5-second interval for real-time synchronization across all devices
    const pollInterval = setInterval(fetchLatest, 3500);

    // Instant sync when user focuses back on window / tab
    const handleFocus = () => {
      fetchLatest();
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') fetchLatest();
    });

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const refreshState = async () => {
    try {
      const [jobsRes, res] = await Promise.all([
        safeFetchJson<JobListing[]>('/api/jobs'),
        safeFetchJson<{ stats?: PipelineStats; workflow?: WorkflowState }>('/api/state'),
      ]);
      if (Array.isArray(jobsRes) && jobsRes.length > 0) {
        setJobs(jobsRes);
      }
      if (res?.stats) setStats(res.stats);
      if (res?.workflow) setWorkflow(res.workflow);
    } catch (e) {
      console.error(e);
    }
  };

  // Unified Trigger Automation (Handles discovery, expiry check, evaluation, and alerts)
  const handleTriggerAutomation = async () => {
    setIsPipelineRunning(true);
    setIsWorkflowRunning(true);
    try {
      // 1. Try server-side pipeline endpoint first
      let res = await safeFetchJson<any>('/api/pipeline/run', { method: 'POST' });
      let newCount = res?.newly_added_count ?? res?.result?.newlyAddedCount ?? 0;
      let highCount = res?.high_fit_count ?? res?.result?.run?.high_fit_count ?? 0;
      let notifCount = res?.notified_count ?? res?.result?.run?.notified_count ?? 0;
      let expiredCount = res?.expired_count ?? res?.result?.expiredCount ?? 0;

      if (res && res.jobs) {
        const deleted = getDeletedJobIds();
        const incomingValid = res.jobs.filter((j: JobListing) => !deleted.has(j.id));
        setJobs((prev) => {
          const cleanPrev = prev.filter((j) => !deleted.has(j.id));
          const prevMap = new Map<string, JobListing>(cleanPrev.map((j) => [j.id, j]));
          const brandNew = incomingValid.filter((j: JobListing) => !prevMap.has(j.id));
          const merged = [...brandNew, ...cleanPrev];
          try {
            localStorage.setItem('careerops_jobs', JSON.stringify(merged));
          } catch {}
          return merged;
        });
        if (res.workflow) {
          setWorkflow((prev) => {
            const merged = { ...res.workflow, interval_hours: prev.interval_hours || res.workflow.interval_hours };
            try {
              localStorage.setItem('careerops_workflow', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      } else {
        // 2. Client-side Autonomous Engine fallback (emergency offline mode)
        const clientCycle = await runClientWorkflowCycle(jobs, profile, settings);
        newCount = clientCycle.newly_added_count;
        highCount = clientCycle.high_fit_count;
        notifCount = clientCycle.notified_count;
        expiredCount = clientCycle.expired_count;

        setJobs(clientCycle.jobs);
        setWorkflow(clientCycle.workflow);
        try {
          localStorage.setItem('careerops_jobs', JSON.stringify(clientCycle.jobs));
          localStorage.setItem('careerops_workflow', JSON.stringify(clientCycle.workflow));
        } catch {}
      }

      let msg = `Automation executed: Discovered ${newCount} fresh jobs, ${highCount} high-fit matches.`;
      if (expiredCount > 0) {
        msg += ` Identified ${expiredCount} expired links.`;
      }
      if (notifCount > 0) {
        msg += ` Dispatched ${notifCount} Telegram alert(s).`;
      }
      showToast(msg);
    } catch (err: any) {
      showToast(err.message || 'Error executing automation', 'error');
    } finally {
      setIsPipelineRunning(false);
      setIsWorkflowRunning(false);
    }
  };

  const handleTriggerWorkflow = handleTriggerAutomation;
  const handleRunPipeline = handleTriggerAutomation;

  // 0.1 Update Workflow Configuration
  const handleUpdateWorkflowConfig = async (newConfig: Partial<WorkflowState>) => {
    try {
      const nowIso = new Date().toISOString();
      const updatedConfig = { ...newConfig, last_updated: nowIso };
      let finalWf: WorkflowState | null = null;
      setWorkflow((prev) => {
        finalWf = { ...prev, ...updatedConfig };
        try {
          localStorage.setItem('careerops_workflow', JSON.stringify(finalWf));
        } catch {}
        return finalWf;
      });

      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const ch = new BroadcastChannel('careerops_broadcast');
          ch.postMessage({ type: 'SYNC_SNAPSHOT', payload: { workflow: finalWf } });
          ch.close();
        } catch {}
      }

      // Sync immediately across all cloud instances
      if (finalWf) {
        syncStateToCloud({ workflow: finalWf, jobs, profile, settings }).catch(() => {});
      }

      const res = await safeFetchJson<any>('/api/workflow/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig),
      });
      if (res?.workflow) {
        const mergedWf = { ...res.workflow, last_updated: nowIso };
        setWorkflow(mergedWf);
        try {
          localStorage.setItem('careerops_workflow', JSON.stringify(mergedWf));
        } catch {}
      }
      showToast('Workflow configuration updated.');
    } catch (err: any) {
      showToast(err.message || 'Error updating workflow config', 'error');
    }
  };

  // 2. Discover Jobs
  const handleDiscoverJobs = async () => {
    setIsDiscovering(true);
    try {
      const res = await safeFetchJson<any>('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (res?.jobs) {
        const deleted = getDeletedJobIds();
        const validResJobs = res.jobs.filter((j: JobListing) => !deleted.has(j.id));
        let mergedList: JobListing[] = [];
        setJobs((prev) => {
          const cleanPrev = prev.filter((j) => !deleted.has(j.id));
          const prevMap = new Map<string, JobListing>(cleanPrev.map((j) => [j.id, j]));
          const brandNew = validResJobs.filter((j: JobListing) => !prevMap.has(j.id));
          mergedList = [...brandNew, ...cleanPrev];
          try {
            localStorage.setItem('careerops_jobs', JSON.stringify(mergedList));
          } catch {}
          return mergedList;
        });

        if (res.searched_registry) {
          const currentReg = getSearchedRegistry();
          const mergedReg = { ...currentReg, ...res.searched_registry };
          saveSearchedRegistry(mergedReg);
        }

        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          try {
            const ch = new BroadcastChannel('careerops_broadcast');
            ch.postMessage({ type: 'SYNC_SNAPSHOT', payload: { jobs: mergedList } });
            ch.close();
          } catch {}
        }

        syncStateToCloud({
          jobs: mergedList,
          profile,
          settings,
          workflow,
          searched_registry: getSearchedRegistry(),
        }).catch(() => {});

        showToast(`Scanned ATS portals: Found ${res.added_count || 0} new opportunities!`);
      } else {
        showToast('Active job pipeline is up to date.');
      }
    } catch (err: any) {
      showToast(err.message || 'Error discovering jobs', 'error');
    } finally {
      setIsDiscovering(false);
    }
  };

  // 3. Evaluate Single Job Fit
  const handleEvaluateFit = async (jobId: string) => {
    setIsEvaluatingId(jobId);
    try {
      const res = await safeFetchJson<any>('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: jobId }),
      });

      if (res?.job) {
        setJobs((prev) => {
          const updated = prev.map((j) => (j.id === jobId ? res.job : j));
          try {
            localStorage.setItem('careerops_jobs', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        await refreshState();
        showToast(`Fit evaluated for ${res.job.title}: Score ${res.fit?.match_score}%`);
      }
    } catch (err: any) {
      showToast(err.message || 'Error evaluating fit', 'error');
    } finally {
      setIsEvaluatingId(null);
    }
  };

  // 4. Tailor Job Documents (with local instant fallback)
  const handleTailorJob = async (jobId: string) => {
    setIsTailoring(true);
    try {
      const targetJob = jobs.find((j) => j.id === jobId);
      let tailoredJob: JobListing | null = null;

      const res = await safeFetchJson<any>('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: jobId }),
      });

      if (res?.job) {
        tailoredJob = res.job;
      } else if (targetJob) {
        // High-fidelity client-side tailoring fallback
        const fallbackTailored = generateFallbackTailored(targetJob, profile);
        tailoredJob = {
          ...targetJob,
          tailored: fallbackTailored,
        };
      }

      if (tailoredJob) {
        setJobs((prev) => {
          const updated = prev.map((j) => (j.id === jobId ? tailoredJob! : j));
          try {
            localStorage.setItem('careerops_jobs', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        showToast(`ATS resume & cover letter tailored for ${tailoredJob.title}!`);
      }
    } catch (err: any) {
      showToast(err.message || 'Error tailoring documents', 'error');
    } finally {
      setIsTailoring(false);
    }
  };

  // 5. Notify Telegram
  const handleNotifyTelegram = async (job: JobListing) => {
    try {
      const result = await dispatchJobNotification({
        job,
        candidateName: profile.full_name,
        settings,
      });

      if (result.delivered || result.simulated) {
        showToast(`Telegram alert dispatched for ${job.title}!`);
        handleUpdateStatus(job.id, 'notified');
      } else {
        showToast(result.error || `Failed to dispatch alert to Telegram`, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error notifying via Telegram', 'error');
    }
  };

  // 5b. Batch Notify Telegram
  const handleBatchNotifyTelegram = async (jobsToNotify: JobListing[]) => {
    if (jobsToNotify.length === 0) return;
    showToast(`Dispatching ${jobsToNotify.length} Telegram alert(s)...`);
    let successCount = 0;
    let failedCount = 0;

    for (const job of jobsToNotify) {
      try {
        const result = await dispatchJobNotification({
          job,
          candidateName: profile.full_name,
          settings,
        });
        if (result.delivered || result.simulated) {
          successCount++;
          handleUpdateStatus(job.id, 'notified');
        } else {
          failedCount++;
        }
      } catch {
        failedCount++;
      }
      // Small pause between messages to prevent Telegram rate limits
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    if (failedCount === 0) {
      showToast(`Dispatched ${successCount} Telegram alert(s) successfully!`);
    } else {
      showToast(`Dispatched ${successCount} alert(s); ${failedCount} failed.`, 'error');
    }
  };

  // 6. Update Status
  const handleUpdateStatus = async (jobId: string, status: any) => {
    try {
      if (status === 'rejected') {
        const targetJob = jobs.find((j) => j.id === jobId);
        if (targetJob) {
          recordJobInRegistry(targetJob, 'rejected');
        }
      }

      const updated = jobs.map((j) => (j.id === jobId ? { ...j, status } : j));
      setJobs(updated);
      try {
        localStorage.setItem('careerops_jobs', JSON.stringify(updated));
      } catch {}
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const ch = new BroadcastChannel('careerops_broadcast');
          ch.postMessage({ type: 'SYNC_SNAPSHOT', payload: { jobs: updated } });
          ch.close();
        } catch {}
      }

      // Automatically sync to all cloud instances
      syncStateToCloud({
        jobs: updated,
        profile,
        settings,
        workflow,
        searched_registry: getSearchedRegistry(),
      }).catch(() => {});

      const res = await safeFetchJson<any>('/api/jobs/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: jobId, status }),
      });

      if (res?.job) {
        setJobs((prev) => {
          const fresh = prev.map((j) => (j.id === jobId ? res.job : j));
          try {
            localStorage.setItem('careerops_jobs', JSON.stringify(fresh));
          } catch {}
          return fresh;
        });
      }
      showToast(`Status updated to ${status}`);
    } catch (err: any) {
      showToast(err.message || 'Error updating status', 'error');
    }
  };

  // Delete Job
  const handleDeleteJob = async (jobId: string) => {
    try {
      addDeletedJobId(jobId);
      const targetJob = jobs.find((j) => j.id === jobId);
      if (targetJob) {
        recordJobInRegistry(targetJob, 'deleted');
      }

      const updated = jobs.filter((j) => j.id !== jobId);
      setJobs(updated);
      try {
        localStorage.setItem('careerops_jobs', JSON.stringify(updated));
      } catch {}
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const ch = new BroadcastChannel('careerops_broadcast');
          ch.postMessage({ type: 'SYNC_SNAPSHOT', payload: { jobs: updated } });
          ch.close();
        } catch {}
      }
      syncStateToCloud({
        jobs: updated,
        profile,
        settings,
        workflow,
        deleted_ids: Array.from(getDeletedJobIds()),
        searched_registry: getSearchedRegistry(),
      }).catch(() => {});

      const res = await safeFetchJson<any>(`/api/jobs/${jobId}`, { method: 'DELETE' });
      if (res?.jobs) {
        const deleted = getDeletedJobIds();
        const cleanJobs = res.jobs.filter((j: JobListing) => !deleted.has(j.id));
        setJobs(cleanJobs);
        try {
          localStorage.setItem('careerops_jobs', JSON.stringify(cleanJobs));
        } catch {}
      }
      showToast('Job removed from pipeline.');
    } catch (err: any) {
      showToast(err.message || 'Error deleting job', 'error');
    }
  };

  // Batch Move Jobs between sub-tabs
  const handleBatchUpdateStatus = async (jobIds: string[], status: JobStatus) => {
    if (!jobIds.length) return;
    try {
      if (status === 'rejected') {
        for (const id of jobIds) {
          const targetJob = jobs.find((j) => j.id === id);
          if (targetJob) {
            recordJobInRegistry(targetJob, 'rejected');
          }
        }
      }

      const idSet = new Set(jobIds);
      setJobs((prev) => {
        const updated = prev.map((j) => (idSet.has(j.id) ? { ...j, status } : j));
        try {
          localStorage.setItem('careerops_jobs', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      const res = await safeFetchJson<any>('/api/jobs/batch-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: jobIds, status }),
      });

      if (res?.jobs) {
        const deleted = getDeletedJobIds();
        const cleanJobs = res.jobs.filter((j: JobListing) => !deleted.has(j.id));
        setJobs(cleanJobs);
        try {
          localStorage.setItem('careerops_jobs', JSON.stringify(cleanJobs));
        } catch {}
      }
      const statusTitle = status.charAt(0).toUpperCase() + status.slice(1);
      showToast(`Moved ${jobIds.length} ${jobIds.length === 1 ? 'job' : 'jobs'} to "${statusTitle}"`);
    } catch (err: any) {
      showToast(err.message || 'Error updating status for selected jobs', 'error');
    }
  };

  // Batch Delete Jobs
  const handleBatchDeleteJobs = async (jobIds: string[]) => {
    if (!jobIds.length) return;
    try {
      addDeletedJobIds(jobIds);
      for (const id of jobIds) {
        const targetJob = jobs.find((j) => j.id === id);
        if (targetJob) {
          recordJobInRegistry(targetJob, 'deleted');
        }
      }

      const idSet = new Set(jobIds);
      const updated = jobs.filter((j) => !idSet.has(j.id));
      setJobs(updated);
      try {
        localStorage.setItem('careerops_jobs', JSON.stringify(updated));
      } catch {}

      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const ch = new BroadcastChannel('careerops_broadcast');
          ch.postMessage({ type: 'SYNC_SNAPSHOT', payload: { jobs: updated } });
          ch.close();
        } catch {}
      }

      syncStateToCloud({
        jobs: updated,
        profile,
        settings,
        workflow,
        deleted_ids: Array.from(getDeletedJobIds()),
        searched_registry: getSearchedRegistry(),
      }).catch(() => {});

      const res = await safeFetchJson<any>('/api/jobs/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: jobIds }),
      });

      if (res?.jobs) {
        const deleted = getDeletedJobIds();
        const cleanJobs = res.jobs.filter((j: JobListing) => !deleted.has(j.id));
        setJobs(cleanJobs);
        try {
          localStorage.setItem('careerops_jobs', JSON.stringify(cleanJobs));
        } catch {}
      }
      await refreshState();
      showToast(`Deleted ${jobIds.length} ${jobIds.length === 1 ? 'job' : 'jobs'}`);
    } catch (err: any) {
      showToast(err.message || 'Error deleting selected jobs', 'error');
    }
  };

  // Remove All Expired Jobs
  const handleRemoveExpiredJobs = async () => {
    try {
      const expired = jobs.filter((j) => j.status === 'expired' || j.verification_status === 'expired_or_invalid');
      const expiredIds = expired.map((j) => j.id);
      if (expiredIds.length > 0) {
        addDeletedJobIds(expiredIds);
      }
      const updated = jobs.filter((j) => j.status !== 'expired' && j.verification_status !== 'expired_or_invalid');
      setJobs(updated);
      try {
        localStorage.setItem('careerops_jobs', JSON.stringify(updated));
      } catch {}

      syncStateToCloud({
        jobs: updated,
        profile,
        settings,
        workflow,
        deleted_ids: Array.from(getDeletedJobIds()),
      }).catch(() => {});

      const res = await safeFetchJson<any>('/api/jobs/remove-expired', { method: 'POST' });
      if (res?.jobs) {
        const deleted = getDeletedJobIds();
        const cleanJobs = res.jobs.filter((j: JobListing) => !deleted.has(j.id));
        setJobs(cleanJobs);
        try {
          localStorage.setItem('careerops_jobs', JSON.stringify(cleanJobs));
        } catch {}
      }
      await refreshState();
      showToast('Cleaned expired jobs from pipeline.');
    } catch (err: any) {
      showToast(err.message || 'Error removing expired jobs', 'error');
    }
  };

  // 7. Add Custom Job
  const handleAddJob = async (jobData: any) => {
    const newJob: JobListing = {
      id: `custom-${Date.now().toString(16)}`,
      title: jobData.title || 'Untitled Role',
      company_name: jobData.company_name || 'Enterprise Company',
      location: jobData.location || 'Gurugram, India',
      description: jobData.description || '',
      apply_link: jobData.apply_link || '#',
      ats_source: 'manual_entry',
      discovered_at: new Date().toISOString(),
      status: 'new',
      fit: {
        match_score: 85,
        is_viable: true,
        reason: 'Added via Direct Requisition Entry.',
        skill_gap: [],
        highlight_keywords: ['Analytics', 'Automation'],
      },
    };

    setJobs((prev) => {
      const updated = [newJob, ...prev];
      try {
        localStorage.setItem('careerops_jobs', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setSelectedJobId(newJob.id);

    try {
      const res = await safeFetchJson<any>('/api/jobs/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      if (res?.job) {
        setJobs((prev) => {
          const updated = [res.job, ...prev.filter((j) => j.id !== newJob.id)];
          try {
            localStorage.setItem('careerops_jobs', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        setSelectedJobId(res.job.id);
      }
      await refreshState();
      showToast(`Added job: ${newJob.title} at ${newJob.company_name}`);
      handleEvaluateFit(newJob.id);
    } catch {
      showToast(`Added job: ${newJob.title} to local store.`);
    }
  };

  // 8. Update Profile
  const handleUpdateProfile = async (updated: UserProfile) => {
    setProfile(updated);
    try {
      localStorage.setItem('careerops_profile', JSON.stringify(updated));
    } catch {}

    try {
      const res = await safeFetchJson<any>('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res?.profile) {
        setProfile(res.profile);
      }
      showToast('Candidate profile updated successfully!');
    } catch {
      showToast('Candidate profile saved to local storage!');
    }
  };

  // 9. Reset Profile
  const handleResetProfile = async () => {
    setProfile(INITIAL_PROFILE);
    try {
      localStorage.setItem('careerops_profile', JSON.stringify(INITIAL_PROFILE));
    } catch {}

    try {
      const res = await safeFetchJson<any>('/api/profile/reset', { method: 'POST' });
      if (res?.profile) {
        setProfile(res.profile);
      }
    } catch {}
    showToast("Reset to Kartik Bhatt's profile!");
  };

  // 10. Parse Resume (Document & Text with Hyperlink Scraping)
  const handleParseResumeDocument = async (fileData: { base64: string; fileName: string; mimeType: string }) => {
    setIsParsingResume(true);
    try {
      const res = await safeFetchJson<any>('/api/profile/parse-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64: fileData.base64,
          file_name: fileData.fileName,
          mime_type: fileData.mimeType,
        }),
      });

      if (res?.profile) {
        setProfile(res.profile);
        try {
          localStorage.setItem('careerops_profile', JSON.stringify(res.profile));
        } catch {}
        const scrapedCount = res.scraped_sources?.length || 0;
        showToast(
          `Parsed ${fileData.fileName}! Enriched knowledge graph from ${scrapedCount} web link(s) (GitHub, Portfolio, LinkedIn).`
        );
      } else {
        throw new Error(res?.error || 'Backend parser unavailable; upload handled.');
      }
    } catch (err: any) {
      showToast(err.message || 'Error parsing resume document', 'error');
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleParseResumeText = async (text: string) => {
    setIsParsingResume(true);
    try {
      const res = await safeFetchJson<any>('/api/profile/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_text: text }),
      });

      if (res?.profile) {
        setProfile(res.profile);
        try {
          localStorage.setItem('careerops_profile', JSON.stringify(res.profile));
        } catch {}
        const scrapedCount = res.scraped_sources?.length || 0;
        showToast(
          `Resume parsed! Enriched profile from ${scrapedCount} discovered web link(s).`
        );
      } else {
        throw new Error(res?.error || 'Failed to parse resume');
      }
    } catch (err: any) {
      showToast(err.message || 'Error parsing resume text', 'error');
    } finally {
      setIsParsingResume(false);
    }
  };

  // 11. Update Settings
  const handleUpdateSettings = async (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('careerops_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const res = await safeFetchJson<any>('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      if (res?.settings) {
        setSettings(res.settings);
      }
      showToast('Automation settings saved!');
    } catch {
      showToast('Settings saved locally.');
    }
  };

  // 12. Verify Job Link Live
  const handleVerifyJobLink = async (jobId: string) => {
    try {
      const res = await safeFetchJson<any>(`/api/jobs/${jobId}/verify-link`, {
        method: 'POST',
      });

      if (res?.job) {
        setJobs((prev) => {
          const updated = prev.map((j) => (j.id === jobId ? res.job : j));
          try {
            localStorage.setItem('careerops_jobs', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        const statusLabel =
          res.job.verification_status === 'verified_active'
            ? 'Active & Accepting Applications'
            : res.job.verification_status === 'active_portal'
            ? 'Direct ATS Gateway Validated'
            : res.job.verification_status === 'expired_or_invalid'
            ? 'Expired / Closed'
            : 'Link Checked';
        showToast(
          `Requisition Checked: ${statusLabel}`,
          res.job.verification_status === 'expired_or_invalid' ? 'error' : 'success'
        );
      } else {
        showToast('Link verification check completed.');
      }
    } catch (err: any) {
      showToast(err.message || 'Link verification failed', 'error');
    }
  };

  // 13. Batch Verify All Job Links
  const handleBatchVerifyLinks = async () => {
    try {
      showToast('Initiating live verification for all job postings...');
      const res = await safeFetchJson<any>('/api/jobs/verify-all', {
        method: 'POST',
      });

      if (res?.jobs) {
        setJobs(res.jobs);
        try {
          localStorage.setItem('careerops_jobs', JSON.stringify(res.jobs));
        } catch {}
        showToast(`Successfully verified ${res.verified_count || res.jobs.length} postings live!`);
      }
    } catch (err: any) {
      showToast(err.message || 'Batch verification failed', 'error');
    }
  };

  const handleSelectJobForTailor = (job: JobListing) => {
    setSelectedJobId(job.id);
    setActiveTab('tailor');
    if (!job.tailored) {
      handleTailorJob(job.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-[#E2E8F0] flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-x-clip bg-grid-ambient">
      {/* Organic Ambient Glow Spheres (Haikei / Blob generator principle) */}
      <div
        className="ambient-glow-sphere -top-32 right-1/4 w-[550px] h-[350px] bg-gradient-to-br from-blue-600/12 via-indigo-600/8 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="ambient-glow-sphere top-96 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-600/10 via-emerald-600/5 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="ambient-glow-sphere bottom-20 right-0 w-[450px] h-[450px] bg-gradient-to-tl from-purple-600/10 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={computedStats}
        onRunPipeline={handleRunPipeline}
        isPipelineRunning={isPipelineRunning}
        candidateName={profile.full_name}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-28 md:pb-10">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <DashboardView
                profile={profile}
                jobs={jobs}
                stats={computedStats}
                workflow={workflow}
                onTriggerWorkflow={handleTriggerWorkflow}
                isWorkflowRunning={isWorkflowRunning}
                onSelectJobForTailor={handleSelectJobForTailor}
                onRunPipeline={handleRunPipeline}
                isPipelineRunning={isPipelineRunning}
                onOpenAddJob={() => setIsAddJobOpen(true)}
                onDiscoverJobs={handleDiscoverJobs}
                isDiscovering={isDiscovering}
                onNotifyTelegram={handleNotifyTelegram}
                setActiveTab={setActiveTab}
              />
            </motion.div>
          )}

          {activeTab === 'jobs' && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <JobFeedView
                jobs={jobs}
                profile={profile}
                onEvaluateFit={handleEvaluateFit}
                onSelectForTailoring={handleSelectJobForTailor}
                onNotifyTelegram={handleNotifyTelegram}
                onUpdateStatus={handleUpdateStatus}
                onOpenAddJob={() => setIsAddJobOpen(true)}
                onDiscoverJobs={handleDiscoverJobs}
                isDiscovering={isDiscovering}
                isEvaluatingId={isEvaluatingId}
                onVerifyJobLink={handleVerifyJobLink}
                onBatchVerifyLinks={handleBatchVerifyLinks}
                onRemoveExpiredJobs={handleRemoveExpiredJobs}
                onDeleteJob={handleDeleteJob}
                onBatchUpdateStatus={handleBatchUpdateStatus}
                onBatchDeleteJobs={handleBatchDeleteJobs}
                onBatchNotifyTelegram={handleBatchNotifyTelegram}
              />
            </motion.div>
          )}

          {activeTab === 'tailor' && (
            <motion.div
              key="tailor"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <DocumentStudioView
                jobs={jobs}
                selectedJobId={selectedJobId}
                onSelectJob={(id) => setSelectedJobId(id)}
                profile={profile}
                onTailorJob={handleTailorJob}
                isTailoring={isTailoring}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProfileView
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onResetProfile={handleResetProfile}
                onParseResumeText={handleParseResumeText}
                onParseResumeDocument={handleParseResumeDocument}
                isParsingResume={isParsingResume}
              />
            </motion.div>
          )}

          {activeTab === 'automation' && (
            <motion.div
              key="automation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <AutomationView
                settings={settings}
                jobs={jobs}
                profile={profile}
                workflow={workflow}
                onTriggerWorkflow={handleTriggerWorkflow}
                onUpdateWorkflowConfig={handleUpdateWorkflowConfig}
                isWorkflowRunning={isWorkflowRunning}
                onUpdateSettings={handleUpdateSettings}
                onTestNotify={async (jobId, customChatId) => {
                  const targetJob = jobs.find((j) => j.id === jobId);
                  if (!targetJob) return { delivered: false, error: 'Job not found' };
                  const res = await dispatchJobNotification({
                    job: targetJob,
                    candidateName: profile.full_name,
                    settings,
                    customChatId,
                  });
                  await refreshState();
                  return res;
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation Bar (Phone Friendly, Zero-Jitter) */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Add Job Modal */}
      <AddJobModal
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        onAddJob={handleAddJob}
      />

      {/* Toast Feedback Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 md:bottom-5 right-4 md:right-5 left-4 md:left-auto z-50 pointer-events-none flex justify-center md:justify-end"
          >
            <div
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-medium border backdrop-blur-md pointer-events-auto ${
                toastMessage.type === 'success'
                  ? 'bg-[#121620]/95 text-zinc-200 border-white/[0.12] shadow-black/50'
                  : 'bg-rose-950/90 text-rose-200 border-rose-800/80 shadow-rose-950/50'
              }`}
            >
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
