import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Sparkles,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  FileText,
  Upload,
  Loader2,
  Check,
  Globe,
  ExternalLink,
  FileUp,
  FolderGit2,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Code2,
  FileCheck,
  Pencil,
  X,
} from 'lucide-react';
import { UserProfile, WorkExperience } from '../types.js';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => Promise<void>;
  onResetProfile: () => Promise<void>;
  onParseResumeText: (text: string) => Promise<void>;
  onParseResumeDocument?: (fileData: { base64: string; fileName: string; mimeType: string }) => Promise<void>;
  isParsingResume: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onResetProfile,
  onParseResumeText,
  onParseResumeDocument,
  isParsingResume,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCert, setNewCert] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [parseText, setParseText] = useState('');
  const [showParseModal, setShowParseModal] = useState(false);

  // Work Experience Editing State
  const [editingExpIdx, setEditingExpIdx] = useState<number | null>(null);
  const [editExpData, setEditExpData] = useState<WorkExperience | null>(null);
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [newExpData, setNewExpData] = useState<WorkExperience>({
    company: '',
    role: '',
    location: '',
    dates: '',
    summary: '',
    bullets: [],
  });
  const [newBulletText, setNewBulletText] = useState('');
  const [editBulletText, setEditBulletText] = useState('');

  // File Upload State
  const [parseMode, setParseMode] = useState<'document' | 'text'>('document');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsingStage, setParsingStage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if profile prop changes
  React.useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const handleAddRole = () => {
    if (!newRole.trim()) return;
    if (!formData.target_roles.includes(newRole.trim())) {
      setFormData({ ...formData, target_roles: [...formData.target_roles, newRole.trim()] });
    }
    setNewRole('');
  };

  const handleAddPresetRole = (role: string) => {
    if (!formData.target_roles.includes(role)) {
      setFormData({ ...formData, target_roles: [...formData.target_roles, role] });
    }
  };

  const handleRemoveRole = (role: string) => {
    setFormData({ ...formData, target_roles: formData.target_roles.filter((r) => r !== role) });
  };

  // Experience handlers
  const handleStartEditExp = (idx: number) => {
    setEditingExpIdx(idx);
    setEditExpData(JSON.parse(JSON.stringify(formData.experience[idx])));
    setEditBulletText('');
  };

  const handleCancelEditExp = () => {
    setEditingExpIdx(null);
    setEditExpData(null);
    setEditBulletText('');
  };

  const handleSaveEditExp = () => {
    if (editingExpIdx === null || !editExpData) return;
    const updated = [...formData.experience];
    updated[editingExpIdx] = editExpData;
    setFormData({ ...formData, experience: updated });
    setEditingExpIdx(null);
    setEditExpData(null);
  };

  const handleDeleteExp = (idx: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== idx),
    });
    if (editingExpIdx === idx) {
      setEditingExpIdx(null);
      setEditExpData(null);
    }
  };

  const handleAddBulletToEdit = () => {
    if (!editExpData || !editBulletText.trim()) return;
    setEditExpData({
      ...editExpData,
      bullets: [...(editExpData.bullets || []), editBulletText.trim()],
    });
    setEditBulletText('');
  };

  const handleRemoveBulletFromEdit = (bIdx: number) => {
    if (!editExpData) return;
    setEditExpData({
      ...editExpData,
      bullets: editExpData.bullets.filter((_, i) => i !== bIdx),
    });
  };

  const handleSaveNewExp = () => {
    if (!newExpData.role.trim() || !newExpData.company.trim()) return;
    setFormData({
      ...formData,
      experience: [newExpData, ...(formData.experience || [])],
    });
    setNewExpData({
      company: '',
      role: '',
      location: '',
      dates: '',
      summary: '',
      bullets: [],
    });
    setIsAddingExp(false);
    setNewBulletText('');
  };

  const handleAddBulletToNew = () => {
    if (!newBulletText.trim()) return;
    setNewExpData({
      ...newExpData,
      bullets: [...newExpData.bullets, newBulletText.trim()],
    });
    setNewBulletText('');
  };

  const handleRemoveBulletFromNew = (bIdx: number) => {
    setNewExpData({
      ...newExpData,
      bullets: newExpData.bullets.filter((_, i) => i !== bIdx),
    });
  };

  const handleAddLocation = () => {
    if (!newLocation.trim()) return;
    if (!formData.preferred_locations.includes(newLocation.trim())) {
      setFormData({ ...formData, preferred_locations: [...formData.preferred_locations, newLocation.trim()] });
    }
    setNewLocation('');
  };

  const handleRemoveLocation = (loc: string) => {
    setFormData({ ...formData, preferred_locations: formData.preferred_locations.filter((l) => l !== loc) });
  };

  const handleAddCert = () => {
    if (!newCert.trim()) return;
    setFormData({ ...formData, certifications: [...formData.certifications, newCert.trim()] });
    setNewCert('');
  };

  const handleRemoveCert = (cert: string) => {
    setFormData({ ...formData, certifications: formData.certifications.filter((c) => c !== cert) });
  };

  const handleFileSelect = (file: File) => {
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!isValid) {
      setFileError('Please upload a PDF (.pdf) or Word document (.docx / .doc).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setFileError('File size exceeds 15MB limit.');
      return;
    }

    setFileError(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      setFileBase64(base64);
    };
    reader.onerror = () => {
      setFileError('Failed to read file into memory.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleTriggerParse = async () => {
    if (parseMode === 'document') {
      if (!selectedFile || !fileBase64) {
        setFileError('Please select a PDF or Word document to parse.');
        return;
      }
      if (onParseResumeDocument) {
        setParsingStage('Extracting document content & embedded hyperlinks...');
        await onParseResumeDocument({
          base64: fileBase64,
          fileName: selectedFile.name,
          mimeType: selectedFile.type,
        });
        setShowParseModal(false);
        setSelectedFile(null);
        setFileBase64(null);
        setParsingStage('');
      }
    } else {
      if (!parseText.trim()) return;
      setParsingStage('Scraping discovered hyperlinks & synthesizing profile...');
      await onParseResumeText(parseText);
      setShowParseModal(false);
      setParseText('');
      setParsingStage('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-white text-xl tracking-tight flex items-center gap-2">
            <span>Candidate Knowledge Graph</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20">
              Source of Truth
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Deterministic filters and document tailoring strictly use these facts. Upload a PDF/Word resume to parse and deeply scrape all portfolio links.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
          <button
            type="button"
            onClick={() => setShowParseModal(true)}
            className="h-9 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 rounded-xl transition cursor-pointer shadow-sm shadow-blue-600/20 whitespace-nowrap"
          >
            <FileUp className="w-4 h-4" />
            <span>Upload Resume (PDF/Word)</span>
          </button>

          <button
            type="button"
            onClick={onResetProfile}
            className="h-9 inline-flex items-center justify-center gap-2 bg-[#1A1D23] hover:bg-[#252a33] text-gray-300 hover:text-white text-xs font-semibold px-3.5 rounded-xl transition cursor-pointer border border-[#2D3139] whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span>Reset to Kartik's Profile</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="h-9 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 rounded-xl transition shadow-sm shadow-emerald-600/20 cursor-pointer whitespace-nowrap"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Saved!' : 'Save Profile'}</span>
          </button>
        </div>
      </div>

      {/* Scraped Web Evidence & Hyperlink Intelligence Section */}
      {(formData.scraped_sources?.length || formData.portfolio_projects?.length || formData.parsed_from_document) ? (
        <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F2937] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <span>Scraped Hyperlink Evidence & Verified Portfolios</span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live Web Grounded
                  </span>
                </h3>
                <p className="text-xs text-gray-400">
                  External links extracted from the resume and actively scraped to verify candidate engineering claims.
                </p>
              </div>
            </div>

            {formData.parsed_from_document && (
              <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#14171E] px-3 py-1.5 rounded-xl border border-[#2D3139]">
                <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  Source: <span className="text-gray-200 font-mono">{formData.parsed_from_document.file_name}</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-600/20 text-blue-300 font-semibold uppercase">
                  {formData.parsed_from_document.file_type}
                </span>
              </div>
            )}
          </div>

          {/* Scraped Sources Grid */}
          {formData.scraped_sources && formData.scraped_sources.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5 flex items-center gap-1.5">
                <LinkIcon className="w-3 h-3 text-blue-400" />
                <span>Extracted Hyperlinks ({formData.scraped_sources.length})</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {formData.scraped_sources.map((src, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#14171E] border border-[#232936] hover:border-[#374151] transition flex flex-col justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                          src.type === 'github'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : src.type === 'linkedin'
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {src.type}
                        </span>

                        <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{src.status === 'scraped' ? 'Scraped' : 'Extracted'}</span>
                        </div>
                      </div>

                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-xs font-medium text-blue-400 hover:underline flex items-center gap-1 truncate pt-0.5"
                      >
                        <span className="truncate">{src.url.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                      </a>
                    </div>

                    {src.highlights && src.highlights.length > 0 && (
                      <div className="text-[11px] text-gray-300 bg-[#0F1115] p-2 rounded-lg border border-[#1F2937] space-y-1">
                        {src.highlights.slice(0, 2).map((h, hIdx) => (
                          <p key={hIdx} className="line-clamp-2 text-gray-300">
                            • {h}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Projects from Scraped Portfolios / GitHub */}
          {formData.portfolio_projects && formData.portfolio_projects.length > 0 && (
            <div className="pt-2 border-t border-[#1F2937]/70">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5 flex items-center gap-1.5">
                <Code2 className="w-3 h-3 text-emerald-400" />
                <span>Verified Projects Grounded in Web Scrape ({formData.portfolio_projects.length})</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.portfolio_projects.map((proj, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3 rounded-xl bg-[#14171E] border border-[#232936] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>{proj.name}</span>
                      </h5>
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <span>Live Project</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-2">{proj.description}</p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-[#1A1D23] text-gray-300 border border-[#2D3139]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Main Edit Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Contact & Target Parameters */}
        <div className="space-y-6">
          <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              <span>Contact & Identity</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-medium mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.contact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-medium mb-1">Base Location</label>
                <input
                  type="text"
                  value={formData.contact.location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, location: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-medium mb-1">Links / Portfolios</label>
                <input
                  type="text"
                  value={formData.contact.links}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, links: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Hard Matching Constraints */}
          <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Matching Constraints</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 font-medium mb-1">Total Exp (Years)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.total_years_experience}
                    onChange={(e) =>
                      setFormData({ ...formData, total_years_experience: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-medium mb-1">Seniority Tier</label>
                  <select
                    value={formData.seniority_tier}
                    onChange={(e) => setFormData({ ...formData, seniority_tier: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Entry">Entry (0-2 yrs)</option>
                    <option value="Mid">Mid (2-5 yrs)</option>
                    <option value="Senior">Senior (5-8 yrs)</option>
                    <option value="Lead">Lead / Architect (8+ yrs)</option>
                  </select>
                </div>
              </div>

              {/* Salary LPA Expectation */}
              <div>
                <label className="block text-gray-400 font-medium mb-1">Expected Salary (LPA)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={formData.salary_expectation?.min_lpa || 10}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salary_expectation: {
                          min_lpa: parseFloat(e.target.value) || 0,
                          max_lpa: formData.salary_expectation?.max_lpa || 18,
                        },
                      })
                    }
                    className="w-1/2 px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-gray-600 font-bold">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={formData.salary_expectation?.max_lpa || 18}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salary_expectation: {
                          min_lpa: formData.salary_expectation?.min_lpa || 10,
                          max_lpa: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-1/2 px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Preferred Locations */}
              <div>
                <label className="block text-gray-400 font-medium mb-1">Target Locations</label>
                <div className="flex items-center gap-1.5 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Gurugram, Bengaluru, Remote"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLocation())}
                    className="flex-1 px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddLocation}
                    className="p-1.5 bg-[#1A1D23] hover:bg-[#252a33] rounded-lg text-gray-300 border border-[#2D3139] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.preferred_locations?.map((loc, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-blue-600/10 text-blue-400 text-xs px-2.5 py-0.5 rounded-md border border-blue-500/20"
                    >
                      <span>{loc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLocation(loc)}
                        className="text-blue-400 hover:text-blue-200 cursor-pointer"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Target Roles */}
              <div>
                <label className="block text-gray-400 font-medium mb-1">Target Roles</label>

                {/* Role Preset Dropdown & Quick Presets */}
                <div className="space-y-2 mb-2.5">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddPresetRole(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="w-full px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-xs font-medium text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="" disabled className="text-gray-500">
                      + Select Role Preset to Add...
                    </option>
                    <option value="Business Analyst">Business Analyst</option>
                    <option value="Product Analyst">Product Analyst</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="AI Solutions Consultant">AI Solutions Consultant</option>
                    <option value="Power Platform Developer">Power Platform Developer</option>
                    <option value="Analytics Engineer">Analytics Engineer</option>
                    <option value="Operations Analyst">Operations Analyst</option>
                    <option value="Product Operations Manager">Product Operations Manager</option>
                    <option value="Strategy & Ops Analyst">Strategy & Ops Analyst</option>
                    <option value="BI / Dashboard Specialist">BI / Dashboard Specialist</option>
                  </select>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-gray-500 font-medium">Quick Presets:</span>
                    {['Business Analyst', 'Product Analyst', 'Data Analyst'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleAddPresetRole(preset)}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition border cursor-pointer ${
                          formData.target_roles?.includes(preset)
                            ? 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                            : 'bg-[#14171E] text-gray-400 border-[#2D3139] hover:text-gray-200 hover:border-gray-500'
                        }`}
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mb-2">
                  <input
                    type="text"
                    placeholder="Or type custom role (e.g. AI Workflow Specialist)..."
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRole())}
                    className="flex-1 px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="p-1.5 bg-[#1A1D23] hover:bg-[#252a33] rounded-lg text-gray-300 border border-[#2D3139] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.target_roles?.map((role, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-[#1A1D23] border border-[#2D3139] text-gray-300 text-xs px-2.5 py-0.5 rounded-full font-medium"
                    >
                      <span>{role}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(role)}
                        className="text-gray-500 hover:text-gray-300 cursor-pointer"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Experience, Skills & Certifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Management */}
          <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider flex items-center justify-between">
              <span>Technical & Domain Skills ({formData.skills.length})</span>
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add new skill (e.g. Power Automate, Copilot Studio, SQL)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-[#1A1D23] hover:bg-[#252a33] text-gray-300 text-xs px-2.5 py-1 rounded-md font-medium border border-[#2D3139] transition"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-gray-500 hover:text-gray-300 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Experience List with Full Editing Capability */}
          <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-white text-sm uppercase tracking-wider">
                  Work Experience History ({formData.experience?.length || 0})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingExp(!isAddingExp)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition cursor-pointer shadow-sm shadow-blue-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingExp ? 'Cancel' : 'Add Experience'}</span>
              </button>
            </div>

            {/* Add New Experience Form */}
            {isAddingExp && (
              <div className="p-4 rounded-xl border border-blue-500/30 bg-[#14171E] space-y-3">
                <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    Add New Work Experience
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingExp(false)}
                    className="text-gray-400 hover:text-white text-xs cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 mb-1">Role Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Business Analyst"
                      value={newExpData.role}
                      onChange={(e) => setNewExpData({ ...newExpData, role: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 mb-1">Company *</label>
                    <input
                      type="text"
                      placeholder="e.g. KPMG"
                      value={newExpData.company}
                      onChange={(e) => setNewExpData({ ...newExpData, company: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Gurugram, India"
                      value={newExpData.location}
                      onChange={(e) => setNewExpData({ ...newExpData, location: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 mb-1">Dates</label>
                    <input
                      type="text"
                      placeholder="e.g. 2022 - Present"
                      value={newExpData.dates}
                      onChange={(e) => setNewExpData({ ...newExpData, dates: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-1">Executive Summary</label>
                  <textarea
                    rows={2}
                    placeholder="Brief overview of key responsibilities and impact..."
                    value={newExpData.summary}
                    onChange={(e) => setNewExpData({ ...newExpData, summary: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Bullets Management */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-medium text-gray-400">Accomplishment Bullets</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Add an achievement bullet (e.g. Automated reconciliation pipeline saving 40 hrs/mo)..."
                      value={newBulletText}
                      onChange={(e) => setNewBulletText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBulletToNew())}
                      className="flex-1 px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddBulletToNew}
                      className="px-3 py-1.5 bg-[#1A1D23] hover:bg-[#252a33] text-gray-200 border border-[#2D3139] rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Add Bullet
                    </button>
                  </div>

                  {newExpData.bullets.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {newExpData.bullets.map((b, bIdx) => (
                        <div
                          key={bIdx}
                          className="flex items-start justify-between gap-2 p-2 rounded-lg bg-[#0F1115] border border-[#1F2937] text-xs text-gray-300"
                        >
                          <span className="leading-relaxed flex-1">• {b}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBulletFromNew(bIdx)}
                            className="text-gray-500 hover:text-rose-400 cursor-pointer shrink-0 pt-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1F2937]">
                  <button
                    type="button"
                    onClick={() => setIsAddingExp(false)}
                    className="px-3 py-1.5 bg-[#1A1D23] hover:bg-[#252a33] text-gray-400 hover:text-gray-200 text-xs font-semibold rounded-lg border border-[#2D3139] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNewExp}
                    disabled={!newExpData.role.trim() || !newExpData.company.trim()}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    Save Experience
                  </button>
                </div>
              </div>
            )}

            {/* Experience Items */}
            <div className="space-y-4">
              {formData.experience?.map((exp, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition space-y-3 ${
                    editingExpIdx === idx
                      ? 'border-blue-500/50 bg-[#161B24]'
                      : 'border-[#1F2937] bg-[#14171E] hover:border-[#2D3139]'
                  }`}
                >
                  {editingExpIdx === idx && editExpData ? (
                    /* Inline Editing Mode */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                          Edit Experience
                        </span>
                        <button
                          type="button"
                          onClick={handleCancelEditExp}
                          className="text-gray-400 hover:text-white text-xs cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-gray-400 mb-1">Role Title</label>
                          <input
                            type="text"
                            value={editExpData.role}
                            onChange={(e) => setEditExpData({ ...editExpData, role: e.target.value })}
                            className="w-full px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-400 mb-1">Company</label>
                          <input
                            type="text"
                            value={editExpData.company}
                            onChange={(e) => setEditExpData({ ...editExpData, company: e.target.value })}
                            className="w-full px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-400 mb-1">Location</label>
                          <input
                            type="text"
                            value={editExpData.location || ''}
                            onChange={(e) => setEditExpData({ ...editExpData, location: e.target.value })}
                            className="w-full px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-400 mb-1">Dates</label>
                          <input
                            type="text"
                            value={editExpData.dates}
                            onChange={(e) => setEditExpData({ ...editExpData, dates: e.target.value })}
                            className="w-full px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-gray-400 mb-1">Summary</label>
                        <textarea
                          rows={2}
                          value={editExpData.summary}
                          onChange={(e) => setEditExpData({ ...editExpData, summary: e.target.value })}
                          className="w-full px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      {/* Bullets Management */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-medium text-gray-400">Accomplishment Bullets</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Add bullet point..."
                            value={editBulletText}
                            onChange={(e) => setEditBulletText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBulletToEdit())}
                            className="flex-1 px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={handleAddBulletToEdit}
                            className="px-3 py-1.5 bg-[#1A1D23] hover:bg-[#252a33] text-gray-200 border border-[#2D3139] rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Add
                          </button>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          {(editExpData.bullets || []).map((bullet, bIdx) => (
                            <div
                              key={bIdx}
                              className="flex items-start justify-between gap-2 p-2 rounded-lg bg-[#0F1115] border border-[#1F2937] text-xs text-gray-300"
                            >
                              <span className="leading-relaxed flex-1">• {bullet}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveBulletFromEdit(bIdx)}
                                className="text-gray-500 hover:text-rose-400 cursor-pointer shrink-0 pt-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1F2937]">
                        <button
                          type="button"
                          onClick={handleCancelEditExp}
                          className="px-3 py-1.5 bg-[#1A1D23] hover:bg-[#252a33] text-gray-400 hover:text-gray-200 text-xs font-semibold rounded-lg border border-[#2D3139] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveEditExp}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Read-Only Display with Edit and Delete Buttons */
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                        <div>
                          <span className="font-semibold text-white text-sm">{exp.role}</span>
                          <span className="text-gray-400 text-sm font-medium"> &mdash; {exp.company}</span>
                          {exp.location && <span className="text-xs text-gray-500"> ({exp.location})</span>}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-400">{exp.dates}</span>
                          <div className="flex items-center gap-1 pl-2 border-l border-[#2D3139]">
                            <button
                              type="button"
                              onClick={() => handleStartEditExp(idx)}
                              title="Edit this role"
                              className="p-1 rounded-md text-gray-400 hover:text-blue-400 hover:bg-[#1A1D23] transition cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteExp(idx)}
                              title="Delete this role"
                              className="p-1 rounded-md text-gray-400 hover:text-rose-400 hover:bg-[#1A1D23] transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {exp.summary && <p className="text-xs text-gray-400 italic">{exp.summary}</p>}

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                          Verified Accomplishments ({exp.bullets?.length || 0} bullets):
                        </span>
                        <ul className="text-xs text-gray-300 list-disc pl-4 space-y-1">
                          {exp.bullets?.map((bullet, bIdx) => (
                            <li key={bIdx} className="leading-relaxed">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Certifications</span>
              </div>
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add certification (e.g. Microsoft Azure AI Fundamentals)..."
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCert())}
                className="flex-1 px-3 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddCert}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              {formData.certifications?.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#14171E] border border-[#1F2937] text-xs text-gray-300 font-medium"
                >
                  <span>{cert}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCert(cert)}
                    className="text-gray-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>

      {/* AI Resume Parser Modal */}
      {showParseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-6 max-w-2xl w-full shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                    <span>AI Resume Ingestion & Hyperlink Scraper</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Parse structured experience and automatically scrape external portfolios, GitHub repos, and LinkedIn profiles.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!isParsingResume) {
                    setShowParseModal(false);
                    setSelectedFile(null);
                    setFileBase64(null);
                    setFileError(null);
                  }
                }}
                disabled={isParsingResume}
                className="text-gray-400 hover:text-white text-lg font-bold cursor-pointer disabled:opacity-30"
              >
                &times;
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex items-center p-1 bg-[#14171E] rounded-xl border border-[#1F2937]">
              <button
                type="button"
                onClick={() => {
                  setParseMode('document');
                  setFileError(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  parseMode === 'document'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Upload PDF / Word Document</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/20 text-white font-bold uppercase tracking-wider ml-1">
                  Recommended
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setParseMode('text');
                  setFileError(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  parseMode === 'text'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Paste Raw Text</span>
              </button>
            </div>

            {/* Mode 1: Document Upload */}
            {parseMode === 'document' && (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />

                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 ${
                      isDragging
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-[#2D3139] hover:border-blue-500/50 bg-[#14171E]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-xs">
                      <FileUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Click to browse or drag and drop your resume
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Supports <span className="text-blue-400 font-medium">PDF (.pdf)</span>, <span className="text-blue-400 font-medium">Word (.docx, .doc)</span> up to 15MB
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 bg-[#0F1115] px-3 py-1.5 rounded-xl border border-[#1F2937]">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Deep Scraping: Extracts & visits all links (GitHub, LinkedIn, Portfolios)</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#14171E] border border-blue-500/30 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.name.endsWith('.pdf') ? 'PDF Document' : 'Word Document'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setFileBase64(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        disabled={isParsingResume}
                        className="text-xs text-gray-400 hover:text-rose-400 px-2 py-1 rounded-lg hover:bg-[#1F2937] transition cursor-pointer"
                      >
                        Change File
                      </button>
                    </div>

                    <div className="bg-[#0F1115] p-3 rounded-xl border border-[#1F2937] space-y-1.5 text-xs text-gray-300">
                      <div className="flex items-center gap-2 text-emerald-400 font-medium text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready for deep extraction & live web scraping</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        CareerOps will read the document structure, extract experience metrics, find every external hyperlink (GitHub repositories, personal portfolio, LinkedIn), and scrape their contents into your candidate knowledge graph.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Paste Raw Text */}
            {parseMode === 'text' && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400">
                  Paste resume text below. Any URLs (e.g. GitHub repos, portfolio domains, LinkedIn profiles) will be identified and scraped.
                </p>
                <textarea
                  rows={8}
                  placeholder="Paste resume text here with any portfolio, GitHub, or LinkedIn links..."
                  value={parseText}
                  onChange={(e) => setParseText(e.target.value)}
                  className="w-full p-3 bg-[#14171E] border border-[#2D3139] rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>
            )}

            {/* Error Message */}
            {fileError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Parsing In-Progress Status Indicator */}
            {isParsingResume && (
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin shrink-0 text-blue-400" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-white">
                    {parsingStage || 'Parsing document & scraping external links...'}
                  </p>
                  <p className="text-[11px] text-blue-300/80">
                    Visiting discovered portfolio sites, extracting GitHub repo insights, and structuring with Gemini 3.8 Flash...
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#1F2937]">
              <button
                type="button"
                onClick={() => {
                  setShowParseModal(false);
                  setSelectedFile(null);
                  setFileBase64(null);
                  setFileError(null);
                }}
                disabled={isParsingResume}
                className="px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-[#1A1D23] rounded-xl cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleTriggerParse}
                disabled={
                  isParsingResume ||
                  (parseMode === 'document' && (!selectedFile || !fileBase64)) ||
                  (parseMode === 'text' && !parseText.trim())
                }
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isParsingResume ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Parsing & Scraping Web Links...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Parse & Scrape Everything</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
