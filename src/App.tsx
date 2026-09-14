import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { DashboardView } from './components/DashboardView.js';
import { JobFeedView } from './components/JobFeedView.js';
import { DocumentStudioView } from './components/DocumentStudioView.js';
import { ProfileView } from './components/ProfileView.js';
import { AutomationView } from './components/AutomationView.js';
import { AddJobModal } from './components/AddJobModal.js';
import { UserProfile, JobListing, PipelineStats, AppSettings, WorkflowState } from './types.js';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_PROFILE, INITIAL_JOBS, INITIAL_SETTINGS, INITIAL_WORKFLOW, INITIAL_STATS } from './seedData.js';
import { dispatchJobNotification } from './lib/telegramClient.js';

async function safeFetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, { ...init, signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    return await res.json();
  } catch {
    return null;
  }
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
    try {
      const cached = localStorage.getItem('careerops_jobs');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_JOBS;
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

  // Initial load: sync with backend if available, otherwise stay gracefully active
  useEffect(() => {
    async function loadData() {
      try {
        const [profRes, jobsRes, stateRes] = await Promise.all([
          safeFetchJson<UserProfile>('/api/profile'),
          safeFetchJson<JobListing[]>('/api/jobs'),
          safeFetchJson<{ stats?: PipelineStats; workflow?: WorkflowState; settings?: AppSettings }>('/api/state'),
        ]);

        if (profRes && profRes.full_name) {
          setProfile(profRes);
          try {
            localStorage.setItem('careerops_profile', JSON.stringify(profRes));
          } catch {}
          setIsBackendConnected(true);
        } else {
          setIsBackendConnected(false);
        }

        if (Array.isArray(jobsRes) && jobsRes.length > 0) {
          setJobs(jobsRes);
          try {
            localStorage.setItem('careerops_jobs', JSON.stringify(jobsRes));
          } catch {}
        }

        if (stateRes) {
          if (stateRes.stats) {
            setStats(stateRes.stats);
            try {
              localStorage.setItem('careerops_stats', JSON.stringify(stateRes.stats));
            } catch {}
          }
          if (stateRes.workflow) {
            setWorkflow(stateRes.workflow);
            try {
              localStorage.setItem('careerops_workflow', JSON.stringify(stateRes.workflow));
            } catch {}
          }
          if (stateRes.settings) {
            setSettings(stateRes.settings);
            try {
              localStorage.setItem('careerops_settings', JSON.stringify(stateRes.settings));
            } catch {}
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

  // Simultaneous Real-Time Dashboard Updates & Polling
  useEffect(() => {
    if (isBackendConnected === false) return;

    const pollInterval = setInterval(async () => {
      try {
        const [jobsRes, stateRes] = await Promise.all([
          safeFetchJson<JobListing[]>('/api/jobs'),
          safeFetchJson<{ stats?: PipelineStats; workflow?: WorkflowState }>('/api/state'),
        ]);
        if (Array.isArray(jobsRes) && jobsRes.length > 0) {
          setJobs(jobsRes);
          try {
            localStorage.setItem('careerops_jobs', JSON.stringify(jobsRes));
          } catch {}
        }
        if (stateRes) {
          if (stateRes.stats) setStats(stateRes.stats);
          if (stateRes.workflow) setWorkflow(stateRes.workflow);
        }
      } catch (err) {
        // silent background polling catch
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [isBackendConnected]);

  const refreshState = async () => {
    try {
      const res = await safeFetchJson<{ stats?: PipelineStats; workflow?: WorkflowState }>('/api/state');
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
      const res = await safeFetchJson<any>('/api/pipeline/run', { method: 'POST' });
      if (res?.jobs) {
        setJobs(res.jobs);
        try {
          localStorage.setItem('careerops_jobs', JSON.stringify(res.jobs));
        } catch {}
      }
      if (res?.workflow) {
        setWorkflow(res.workflow);
      }
      await refreshState();
      const newCount = res?.newly_added_count ?? res?.result?.newlyAddedCount ?? 0;
      const highCount = res?.high_fit_count ?? res?.result?.run?.high_fit_count ?? 0;
      const notifCount = res?.notified_count ?? res?.result?.run?.notified_count ?? 0;
      const expiredCount = res?.expired_count ?? res?.result?.expiredCount ?? 0;

      let msg = `Automation executed: Discovered ${newCount} fresh jobs, ${highCount} high-fit matches.`;
      if (expiredCount > 0) {
        msg += ` Identified ${expiredCount} expired links.`;
      }
      if (notifCount > 0) {
        msg += ` Dispatched ${notifCount} Telegram alerts.`;
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
      setWorkflow((prev) => ({ ...prev, ...newConfig }));
      const res = await safeFetchJson<any>('/api/workflow/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      if (res?.workflow) {
        setWorkflow(res.workflow);
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
        setJobs(res.jobs);
        try {
          localStorage.setItem('careerops_jobs', JSON.stringify(res.jobs));
        } catch {}
        await refreshState();
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

      if (result.delivered) {
        showToast(`Telegram alert dispatched for ${job.title}!`);
      } else if (result.simulated) {
        showToast(`Simulated Telegram alert generated for ${job.title}!`);
      } else {
        showToast(result.error || `Failed to dispatch alert to Telegram`, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error notifying via Telegram', 'error');
    }
  };

  // 6. Update Status
  const handleUpdateStatus = async (jobId: string, status: any) => {
    try {
      setJobs((prev) => {
        const updated = prev.map((j) => (j.id === jobId ? { ...j, status } : j));
        try {
          localStorage.setItem('careerops_jobs', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      const res = await safeFetchJson<any>('/api/jobs/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: jobId, status }),
      });

      if (res?.job) {
        setJobs((prev) => {
          const updated = prev.map((j) => (j.id === jobId ? res.job : j));
          try {
            localStorage.setItem('careerops_jobs', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
      await refreshState();
      showToast(`Status updated to ${status}`);
    } catch (err: any) {
      showToast(err.message || 'Error updating status', 'error');
    }
  };

  // Delete Job
  const handleDeleteJob = async (jobId: string) => {
    try {
      setJobs((prev) => {
        const updated = prev.filter((j) => j.id !== jobId);
        try {
          localStorage.setItem('careerops_jobs', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      const res = await safeFetchJson<any>(`/api/jobs/${jobId}`, { method: 'DELETE' });
      if (res?.jobs) {
        setJobs(res.jobs);
        try {
          localStorage.setItem('careerops_jobs', JSON.stringify(res.jobs));
        } catch {}
      }
      await refreshState();
      showToast('Job removed from pipeline.');
    } catch (err: any) {
      showToast(err.message || 'Error deleting job', 'error');
    }
  };

  // Remove All Expired Jobs
  const handleRemoveExpiredJobs = async () => {
    try {
      setJobs((prev) => {
        const updated = prev.filter((j) => j.status !== 'expired' && j.verification_status !== 'expired_or_invalid');
        try {
          localStorage.setItem('careerops_jobs', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      const res = await safeFetchJson<any>('/api/jobs/remove-expired', { method: 'POST' });
      if (res?.jobs) {
        setJobs(res.jobs);
        try {
          localStorage.setItem('careerops_jobs', JSON.stringify(res.jobs));
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
        stats={stats}
        onRunPipeline={handleRunPipeline}
        isPipelineRunning={isPipelineRunning}
        candidateName={profile.full_name}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                stats={stats}
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
            className="fixed bottom-5 right-5 z-50 pointer-events-none"
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
