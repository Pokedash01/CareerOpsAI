import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Sparkles,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JobListing, UserProfile } from '../types.js';
import { exportResumePdf, exportCoverLetterPdf } from '../lib/pdfExport.js';

interface DocumentStudioViewProps {
  jobs: JobListing[];
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
  profile: UserProfile;
  onTailorJob: (jobId: string) => Promise<void>;
  isTailoring: boolean;
}

export const DocumentStudioView: React.FC<DocumentStudioViewProps> = ({
  jobs,
  selectedJobId,
  onSelectJob,
  profile,
  onTailorJob,
  isTailoring,
}) => {
  const [docTab, setDocTab] = useState<'resume' | 'cover_letter'>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('type') === 'cover_letter' ? 'cover_letter' : 'resume';
    } catch {
      return 'resume';
    }
  });

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get('type');
      if (type === 'cover_letter' || type === 'resume') {
        setDocTab(type);
      }
    } catch {}
  }, [selectedJobId]);

  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);

  // Active Job
  const activeJob = jobs.find((j) => j.id === selectedJobId) || jobs[0] || null;
  const tailored = activeJob?.tailored;

  const handleCopyResume = () => {
    if (!activeJob) return;
    const summary = tailored?.summary || `${profile.full_name} - ${profile.total_years_experience} years exp`;
    const skills = (tailored?.skills_ordered || profile.skills).join(', ');
    const expText = (tailored?.experience || profile.experience)
      .map((e) => `### ${e.company}\n${(e.bullets || []).map((b) => `- ${b}`).join('\n')}`)
      .join('\n\n');

    const text = `# ${profile.full_name}\n${profile.contact.email} | ${profile.contact.phone} | ${profile.contact.location}\n\n## Professional Summary\n${summary}\n\n## Key Skills\n${skills}\n\n## Experience\n${expText}`;
    navigator.clipboard.writeText(text);
    setCopiedResume(true);
    setTimeout(() => setCopiedResume(false), 2000);
  };

  const handleCopyLetter = () => {
    if (!tailored) return;
    const text = `Dear Hiring Manager at ${tailored.company},\n\n${tailored.cover_letter_paragraphs.join('\n\n')}\n\nSincerely,\n${profile.full_name}`;
    navigator.clipboard.writeText(text);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  if (!activeJob) {
    return (
      <div className="glass-panel rounded-2xl border border-white/[0.08] p-14 text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/20 via-indigo-500/10 to-purple-500/20 border border-blue-500/30 flex items-center justify-center mx-auto shadow-inner">
          <FileText className="w-8 h-8 text-blue-400" />
        </div>
        <div className="space-y-1">
          <h3 className="font-display font-bold text-white text-base sm:text-lg">No Job Selected</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Please select a job from the jobs feed to generate tailored, ATS-compliant resume bullets and custom cover letters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Selector & Action Banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="glass-panel rounded-xl p-5 shadow-sm space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium mb-1 border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ATS Document Tailoring Engine</span>
            </div>
            <h2 className="font-display font-bold text-white text-lg sm:text-xl tracking-tight">
              Target: {activeJob.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
              <span className="font-medium text-zinc-200">{activeJob.company_name}</span>
              <span>•</span>
              <span>{activeJob.location}</span>
              <span>•</span>
              <span className="text-blue-400 font-medium">{activeJob.ats_source} ATS</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Job Switcher */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-zinc-500 font-medium hidden sm:inline">Role:</span>
              <select
                value={activeJob.id}
                onChange={(e) => onSelectJob(e.target.value)}
                className="text-xs font-medium bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500/80 w-full sm:max-w-xs truncate min-h-[38px]"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id} className="bg-[#12151D] text-zinc-200">
                    {j.company_name}: {j.title} ({j.fit?.match_score || '?'}%)
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTailorJob(activeJob.id)}
              disabled={isTailoring}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 min-h-[38px] rounded-xl transition shadow-sm border border-blue-400/20 disabled:opacity-50 cursor-pointer w-full sm:w-auto shrink-0"
            >
              {isTailoring ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Tailoring Resume & Letter...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{tailored ? 'Re-Tailor Documents' : 'Generate ATS Documents'}</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Extracted JD Keywords */}
        {tailored?.jd_keywords && tailored.jd_keywords.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-medium text-zinc-500 mr-1">ATS Keywords:</span>
            {tailored.jd_keywords.map((kw, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-white/[0.03] text-blue-300 border border-white/[0.06] px-2.5 py-0.5 rounded-md"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Document View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="grid grid-cols-2 sm:flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] w-full sm:w-auto">
          <button
            onClick={() => setDocTab('resume')}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg text-xs font-medium transition cursor-pointer ${
              docTab === 'resume'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span>Resume</span>
          </button>

          <button
            onClick={() => setDocTab('cover_letter')}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg text-xs font-medium transition cursor-pointer ${
              docTab === 'cover_letter'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span>Cover Letter</span>
          </button>
        </div>

        {/* Download / Copy Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
          {docTab === 'resume' ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyResume}
                className="flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                {copiedResume ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedResume ? 'Copied' : 'Copy'}</span>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`/api/download-resume?id=${activeJob.id}&format=txt`}
                download
                className="flex items-center gap-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 text-xs font-medium px-2.5 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Download className="w-3 h-3 text-blue-400" />
                <span>.txt</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`/api/download-resume?id=${activeJob.id}&format=doc`}
                download
                className="flex items-center gap-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 text-xs font-medium px-2.5 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Download className="w-3 h-3 text-blue-400" />
                <span>.doc</span>
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => exportResumePdf(profile, tailored)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-sm cursor-pointer border border-blue-400/20"
              >
                <Download className="w-3 h-3" />
                <span>PDF</span>
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyLetter}
                className="flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLetter ? 'Copied' : 'Copy'}</span>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`/api/download-cover-letter?id=${activeJob.id}&format=txt`}
                download
                className="flex items-center gap-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 text-xs font-medium px-2.5 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Download className="w-3 h-3 text-blue-400" />
                <span>.txt</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`/api/download-cover-letter?id=${activeJob.id}&format=doc`}
                download
                className="flex items-center gap-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 text-xs font-medium px-2.5 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Download className="w-3 h-3 text-blue-400" />
                <span>.doc</span>
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => tailored && exportCoverLetterPdf(profile, tailored)}
                disabled={!tailored}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-sm cursor-pointer disabled:opacity-50 border border-blue-400/20"
              >
                <Download className="w-3 h-3" />
                <span>PDF</span>
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Main Preview Container */}
      <AnimatePresence mode="wait">
        {docTab === 'resume' ? (
          /* Resume Preview */
          <motion.div
            key="resume"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0B0E14] rounded-xl border border-white/[0.06] p-4 sm:p-7 md:p-10 shadow-sm space-y-6 max-w-4xl mx-auto font-sans text-zinc-200"
          >
            {/* Header */}
            <div className="border-b border-white/[0.06] pb-4 space-y-1">
              <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">{profile.full_name}</h1>
              <p className="text-xs text-zinc-400 break-words leading-relaxed">
                {profile.contact.email} &bull; {profile.contact.phone} &bull; {profile.contact.location || 'India'} &bull; {profile.contact.links}
              </p>
            </div>

            {/* Tailored Professional Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Professional Summary
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-white/[0.02] p-3.5 rounded-lg border border-white/[0.06]">
                {tailored?.summary ||
                  `${profile.full_name || 'Candidate'} is a results-driven professional with ${profile.total_years_experience || 3} years of hands-on experience specializing in ${(profile?.skills || ['Power Platform', 'Data Analytics', 'Automation']).slice(0, 5).join(', ')}. Demonstrated success delivering high-impact automation and cross-functional solutions.`}
              </p>
            </div>

            {/* Key Competencies / Skills */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Technical & Domain Competencies
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(tailored?.skills_ordered?.length ? tailored.skills_ordered : profile.skills).map(
                  (skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-white/[0.03] border border-white/[0.06] text-zinc-300 font-medium px-2.5 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Professional Experience */}
            <div className="space-y-5">
              <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Professional Experience
              </h3>

              {(tailored?.experience?.length ? tailored.experience : profile.experience).map((exp, idx) => {
                const origExp = profile.experience.find(
                  (e) => e.company.toLowerCase() === exp.company.toLowerCase()
                );
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                      <div>
                        <span className="font-semibold text-xs sm:text-sm text-white">
                          {origExp?.role || 'Analyst'}
                        </span>
                        <span className="text-xs sm:text-sm text-zinc-400 font-medium">
                          {' '}
                          &mdash; {exp.company}
                        </span>
                        {origExp?.location && (
                          <span className="text-xs text-zinc-400"> ({origExp.location})</span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-zinc-400">{origExp?.dates}</span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-zinc-300 list-disc list-outside pl-4 leading-relaxed">
                      {(exp.bullets || []).map((bullet, bIdx) => (
                        <li key={bIdx} className="hover:text-white transition">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Education & Certs */}
            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Education & Certifications
              </h3>

              {profile.education?.map((edu, idx) => (
                <div key={idx} className="text-xs space-y-0.5">
                  <div className="flex justify-between font-medium text-zinc-200">
                    <span>{edu.degree} &mdash; {edu.institution}</span>
                    <span className="text-zinc-400 font-mono text-[11px]">{edu.dates}</span>
                  </div>
                  {edu.details && <p className="text-zinc-400">{edu.details}</p>}
                </div>
              ))}

              {profile.certifications?.length > 0 && (
                <div className="pt-2 text-xs text-zinc-400">
                  <span className="font-medium text-zinc-200">Certifications: </span>
                  {profile.certifications.join('  •  ')}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Cover Letter Preview */
          <motion.div
            key="cover_letter"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0B0E14] rounded-xl border border-white/[0.06] p-4 sm:p-7 md:p-12 shadow-sm space-y-6 max-w-4xl mx-auto font-sans leading-relaxed text-xs sm:text-sm text-zinc-300"
          >
            <div className="border-b border-white/[0.06] pb-4">
              <h1 className="text-xl font-semibold text-white">{profile.full_name}</h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                {profile.contact.email} | {profile.contact.phone} | {profile.contact.location || 'India'}
              </p>
            </div>

            <div className="text-xs text-zinc-400 space-y-1">
              <p>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="font-semibold text-zinc-300 pt-2">Hiring Team</p>
              <p>{tailored?.company || activeJob.company_name}</p>
              <p className="font-medium text-zinc-400">Application for {tailored?.job_title || activeJob.title}</p>
            </div>

            <p className="font-semibold text-zinc-200">Dear Hiring Manager,</p>

            <div className="space-y-3.5 text-zinc-300 text-xs sm:text-sm">
              {tailored?.cover_letter_paragraphs?.length ? (
                tailored.cover_letter_paragraphs.map((p, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {p}
                  </p>
                ))
              ) : (
                <>
                  <p>
                    I am writing to express my strong enthusiasm for the {activeJob.title} position at {activeJob.company_name}. With over {profile.total_years_experience} years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.
                  </p>
                  <p>
                    During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.
                  </p>
                  <p>
                    My technical foundation spans {(profile?.skills || ['Power Platform', 'Data Analytics', 'Automation']).slice(0, 6).join(', ')}, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at {activeJob.company_name}.
                  </p>
                  <p>
                    Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for {activeJob.company_name}.
                  </p>
                </>
              )}
            </div>

            <div className="pt-4 space-y-1 text-zinc-300 text-xs sm:text-sm">
              <p>Sincerely,</p>
              <p className="font-semibold text-white">{profile.full_name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

