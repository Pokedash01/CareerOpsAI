import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Sparkles,
  Building2,
  MapPin,
  ChevronRight,
  AlertCircle,
  ExternalLink,
  Layers,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { JobListing, UserProfile, TailoredContent } from '../types.js';
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
  const [docTab, setDocTab] = useState<'resume' | 'cover_letter'>('resume');
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
      <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-12 text-center space-y-3">
        <FileText className="w-10 h-10 text-gray-600 mx-auto" />
        <h3 className="font-semibold text-white text-base">No Job Selected</h3>
        <p className="text-xs text-gray-500">Please select a job from the jobs feed to generate tailored ATS application documents.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Selector & Action Banner */}
      <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-400 text-xs font-semibold mb-1 border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ATS Document Tailoring Engine</span>
            </div>
            <h2 className="font-semibold text-white text-xl tracking-tight">
              Target: {activeJob.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
              <span className="font-medium text-gray-200">{activeJob.company_name}</span>
              <span>•</span>
              <span>{activeJob.location}</span>
              <span>•</span>
              <span className="text-blue-400 font-medium">{activeJob.ats_source} ATS</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Job Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">Role:</span>
              <select
                value={activeJob.id}
                onChange={(e) => onSelectJob(e.target.value)}
                className="text-xs font-semibold bg-[#1A1D23] border border-[#2D3139] rounded-xl px-3 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-xs truncate"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id} className="bg-[#1A1D23] text-gray-200">
                    {j.company_name}: {j.title} ({j.fit?.match_score || '?'}%)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onTailorJob(activeJob.id)}
              disabled={isTailoring}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
            >
              {isTailoring ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Tailoring with Gemini...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{tailored ? 'Re-Tailor Documents' : 'Generate ATS Documents'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Extracted JD Keywords */}
        {tailored?.jd_keywords && tailored.jd_keywords.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-medium text-gray-500 mr-1">ATS Target Keywords:</span>
            {tailored.jd_keywords.map((kw, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-[#1A1D23] text-blue-300 border border-[#2D3139] px-2.5 py-0.5 rounded-md"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Document View Switcher */}
      <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDocTab('resume')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              docTab === 'resume'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#1A1D23] text-gray-400 hover:text-gray-200 border border-[#2D3139]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tailored ATS Resume</span>
          </button>

          <button
            onClick={() => setDocTab('cover_letter')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              docTab === 'cover_letter'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#1A1D23] text-gray-400 hover:text-gray-200 border border-[#2D3139]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tailored Cover Letter</span>
          </button>
        </div>

        {/* Download / Copy Buttons */}
        <div className="flex items-center gap-2">
          {docTab === 'resume' ? (
            <>
              <button
                onClick={handleCopyResume}
                className="flex items-center gap-1 bg-[#1A1D23] hover:bg-[#252a33] border border-[#2D3139] text-gray-300 text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer"
              >
                {copiedResume ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedResume ? 'Copied Markdown' : 'Copy Text'}</span>
              </button>

              <button
                onClick={() => exportResumePdf(profile, tailored)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume PDF</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCopyLetter}
                className="flex items-center gap-1 bg-[#1A1D23] hover:bg-[#252a33] border border-[#2D3139] text-gray-300 text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer"
              >
                {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLetter ? 'Copied Text' : 'Copy Text'}</span>
              </button>

              <button
                onClick={() => tailored && exportCoverLetterPdf(profile, tailored)}
                disabled={!tailored}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Cover Letter PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Preview Container */}
      {docTab === 'resume' ? (
        /* Resume Preview */
        <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-8 sm:p-12 shadow-sm space-y-6 max-w-4xl mx-auto font-sans text-gray-200">
          {/* Header */}
          <div className="border-b border-[#1F2937] pb-4 space-y-1">
            <h1 className="text-2xl font-semibold text-white tracking-tight">{profile.full_name}</h1>
            <p className="text-xs text-gray-400">
              {profile.contact.email} &bull; {profile.contact.phone} &bull; {profile.contact.location || 'India'} &bull; {profile.contact.links}
            </p>
          </div>

          {/* Tailored Professional Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Professional Summary
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed bg-[#14171E] p-3.5 rounded-xl border border-[#1F2937]">
              {tailored?.summary ||
                `${profile.full_name} is a results-driven professional with ${profile.total_years_experience} years of hands-on experience specializing in ${profile.skills.slice(0, 5).join(', ')}. Demonstrated success delivering high-impact automation and cross-functional solutions.`}
            </p>
          </div>

          {/* Key Competencies / Skills */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Technical & Domain Competencies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(tailored?.skills_ordered?.length ? tailored.skills_ordered : profile.skills).map(
                (skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-[#1A1D23] border border-[#2D3139] text-gray-300 font-medium px-2.5 py-1 rounded-md"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Professional Experience */}
          <div className="space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
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
                      <span className="font-semibold text-sm text-white">
                        {origExp?.role || 'Analyst'}
                      </span>
                      <span className="text-sm text-gray-400 font-medium">
                        {' '}
                        &mdash; {exp.company}
                      </span>
                      {origExp?.location && (
                        <span className="text-xs text-gray-500"> ({origExp.location})</span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-gray-500">{origExp?.dates}</span>
                  </div>

                  <ul className="space-y-2 text-xs text-gray-300 list-disc list-outside pl-4 leading-relaxed">
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
          <div className="space-y-3 pt-2 border-t border-[#1F2937]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Education & Certifications
            </h3>

            {profile.education?.map((edu, idx) => (
              <div key={idx} className="text-xs space-y-0.5">
                <div className="flex justify-between font-semibold text-gray-200">
                  <span>{edu.degree} &mdash; {edu.institution}</span>
                  <span className="text-gray-500 font-normal">{edu.dates}</span>
                </div>
                {edu.details && <p className="text-gray-400">{edu.details}</p>}
              </div>
            ))}

            {profile.certifications?.length > 0 && (
              <div className="pt-2 text-xs text-gray-400">
                <span className="font-semibold text-gray-200">Certifications: </span>
                {profile.certifications.join('  •  ')}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Cover Letter Preview */
        <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-8 sm:p-14 shadow-sm space-y-6 max-w-4xl mx-auto font-sans leading-relaxed text-sm text-gray-300">
          <div className="border-b border-[#1F2937] pb-4">
            <h1 className="text-xl font-semibold text-white">{profile.full_name}</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {profile.contact.email} | {profile.contact.phone} | {profile.contact.location || 'India'}
            </p>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="font-semibold text-gray-300 pt-2">Hiring Team</p>
            <p>{tailored?.company || activeJob.company_name}</p>
            <p className="font-medium text-gray-400">Application for {tailored?.job_title || activeJob.title}</p>
          </div>

          <p className="font-semibold text-gray-200">Dear Hiring Manager,</p>

          <div className="space-y-4 text-gray-300 text-sm">
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
                  My technical foundation spans {profile.skills.slice(0, 6).join(', ')}, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at {activeJob.company_name}.
                </p>
                <p>
                  Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for {activeJob.company_name}.
                </p>
              </>
            )}
          </div>

          <div className="pt-4 space-y-1 text-gray-300 text-sm">
            <p>Sincerely,</p>
            <p className="font-semibold text-white">{profile.full_name}</p>
          </div>
        </div>
      )}
    </div>
  );
};
