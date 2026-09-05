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

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'tailor' | 'profile' | 'automation'>('dashboard');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [stats, setStats] = useState<PipelineStats | undefined>(undefined);
  const [workflow, setWorkflow] = useState<WorkflowState | null>(null);
  const [isWorkflowRunning, setIsWorkflowRunning] = useState<boolean>(false);
  const [settings, setSettings] = useState<AppSettings>({
    min_match_score: 75,
    telegram_configured: false,
    telegram_chat_id: '1368681854',
    seen_ttl_days: 14,
  });

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
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

  // Initial load
  useEffect(() => {
    async function loadData() {
      try {
        const [profRes, jobsRes, stateRes] = await Promise.all([
          fetch('/api/profile').then((r) => r.json()),
          fetch('/api/jobs').then((r) => r.json()),
          fetch('/api/state').then((r) => r.json()),
        ]);

        if (profRes && profRes.full_name) setProfile(profRes);
        if (Array.isArray(jobsRes)) {
          setJobs(jobsRes);
          if (jobsRes.length > 0) setSelectedJobId(jobsRes[0].id);
        }
        if (stateRes) {
          if (stateRes.stats) setStats(stateRes.stats);
          if (stateRes.workflow) setWorkflow(stateRes.workflow);
          if (stateRes.settings) setSettings(stateRes.settings);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }
    loadData();
  }, []);

  // Simultaneous Real-Time Dashboard Updates & Polling
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const [jobsRes, stateRes] = await Promise.all([
          fetch('/api/jobs').then((r) => r.json()),
          fetch('/api/state').then((r) => r.json()),
        ]);
        if (Array.isArray(jobsRes)) {
          setJobs(jobsRes);
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
  }, []);

  const refreshState = async () => {
    try {
      const res = await fetch('/api/state').then((r) => r.json());
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
      const res = await fetch('/api/pipeline/run', { method: 'POST' }).then((r) => r.json());
      if (res?.jobs) {
        setJobs(res.jobs);
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
      const res = await fetch('/api/workflow/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      }).then((r) => r.json());
      if (res?.workflow) {
        setWorkflow(res.workflow);
        showToast('Workflow configuration updated.');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating workflow config', 'error');
    }
  };

  // 2. Discover Jobs
  const handleDiscoverJobs = async () => {
    setIsDiscovering(true);
    try {
      const res = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }).then((r) => r.json());

      if (res?.jobs) {
        setJobs(res.jobs);
        await refreshState();
        showToast(`Scanned ATS portals: Found ${res.added_count || 0} new opportunities!`);
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
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: jobId }),
      }).then((r) => r.json());

      if (res?.job) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? res.job : j)));
        await refreshState();
        showToast(`Fit evaluated for ${res.job.title}: Score ${res.fit?.match_score}%`);
      }
    } catch (err: any) {
      showToast(err.message || 'Error evaluating fit', 'error');
    } finally {
      setIsEvaluatingId(null);
    }
  };

  // 4. Tailor Job Documents
  const handleTailorJob = async (jobId: string) => {
    setIsTailoring(true);
    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: jobId }),
      }).then((r) => r.json());

      if (res?.job) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? res.job : j)));
        showToast(`ATS resume & cover letter successfully tailored for ${res.job.title}!`);
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
      const res = await fetch('/api/telegram/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: job.id }),
      }).then((r) => r.json());

      if (res?.success) {
        setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: 'notified' } : j)));
        await refreshState();
        showToast(res.delivered ? `Telegram notification dispatched for ${job.title}!` : `Simulated Telegram alert generated for ${job.title}!`);
      }
    } catch (err: any) {
      showToast(err.message || 'Error notifying via Telegram', 'error');
    }
  };

  // 6. Update Status
  const handleUpdateStatus = async (jobId: string, status: any) => {
    try {
      const res = await fetch('/api/jobs/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: jobId, status }),
      }).then((r) => r.json());

      if (res?.job) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? res.job : j)));
        await refreshState();
        showToast(`Status updated to ${status}`);
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating status', 'error');
    }
  };

  // 7. Add Custom Job
  const handleAddJob = async (jobData: any) => {
    const res = await fetch('/api/jobs/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    }).then((r) => r.json());

    if (res?.job) {
      setJobs((prev) => [res.job, ...prev]);
      setSelectedJobId(res.job.id);
      await refreshState();
      showToast(`Added job: ${res.job.title} at ${res.job.company_name}`);
      // Immediately evaluate fit!
      handleEvaluateFit(res.job.id);
    }
  };

  // 8. Update Profile
  const handleUpdateProfile = async (updated: UserProfile) => {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).then((r) => r.json());

    if (res?.profile) {
      setProfile(res.profile);
      showToast('Candidate profile updated successfully!');
    }
  };

  // 9. Reset Profile
  const handleResetProfile = async () => {
    const res = await fetch('/api/profile/reset', { method: 'POST' }).then((r) => r.json());
    if (res?.profile) {
      setProfile(res.profile);
      showToast("Reset to Kartik Bhatt's profile!");
    }
  };

  // 10. Parse Resume (Document & Text with Hyperlink Scraping)
  const handleParseResumeDocument = async (fileData: { base64: string; fileName: string; mimeType: string }) => {
    setIsParsingResume(true);
    try {
      const res = await fetch('/api/profile/parse-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64: fileData.base64,
          file_name: fileData.fileName,
          mime_type: fileData.mimeType,
        }),
      }).then((r) => r.json());

      if (res?.profile) {
        setProfile(res.profile);
        const scrapedCount = res.scraped_sources?.length || 0;
        showToast(
          `Parsed ${fileData.fileName}! Enriched knowledge graph from ${scrapedCount} web link(s) (GitHub, Portfolio, LinkedIn).`
        );
      } else {
        throw new Error(res?.error || 'Failed to parse resume document');
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
      const res = await fetch('/api/profile/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_text: text }),
      }).then((r) => r.json());

      if (res?.profile) {
        setProfile(res.profile);
        const scrapedCount = res.scraped_sources?.length || 0;
        showToast(
          `Resume parsed! Enriched profile from ${scrapedCount} discovered web link(s) (GitHub, Portfolio, LinkedIn).`
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
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    }).then((r) => r.json());

    if (res?.settings) {
      setSettings(res.settings);
      showToast('Automation settings saved!');
    }
  };

  // 12. Verify Job Link Live
  const handleVerifyJobLink = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/verify-link`, {
        method: 'POST',
      }).then((r) => r.json());

      if (res?.job) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? res.job : j)));
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
      }
    } catch (err: any) {
      showToast(err.message || 'Link verification failed', 'error');
    }
  };

  // 13. Batch Verify All Job Links
  const handleBatchVerifyLinks = async () => {
    try {
      showToast('Initiating live verification for all job postings...');
      const res = await fetch('/api/jobs/verify-all', {
        method: 'POST',
      }).then((r) => r.json());

      if (res?.jobs) {
        setJobs(res.jobs);
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] flex flex-col items-center justify-center text-[#E5E7EB] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm font-medium text-gray-400">Booting CareerOps-AI Pipeline...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#E5E7EB] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onRunPipeline={handleRunPipeline}
        isPipelineRunning={isPipelineRunning}
        candidateName={profile.full_name}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
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
        )}

        {activeTab === 'jobs' && (
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
          />
        )}

        {activeTab === 'tailor' && (
          <DocumentStudioView
            jobs={jobs}
            selectedJobId={selectedJobId}
            onSelectJob={(id) => setSelectedJobId(id)}
            profile={profile}
            onTailorJob={handleTailorJob}
            isTailoring={isTailoring}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onResetProfile={handleResetProfile}
            onParseResumeText={handleParseResumeText}
            onParseResumeDocument={handleParseResumeDocument}
            isParsingResume={isParsingResume}
          />
        )}

        {activeTab === 'automation' && (
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
              const res = await fetch('/api/telegram/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: jobId, custom_chat_id: customChatId }),
              }).then((r) => r.json());
              await refreshState();
              return res;
            }}
          />
        )}
      </main>

      {/* Add Job Modal */}
      <AddJobModal
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        onAddJob={handleAddJob}
      />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold border ${
              toastMessage.type === 'success'
                ? 'bg-[#1A1D23] text-[#E5E7EB] border-[#2D3139]'
                : 'bg-rose-950/90 text-rose-200 border-rose-800/80'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
