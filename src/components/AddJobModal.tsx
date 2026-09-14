import React, { useState } from 'react';
import { Plus, X, Building2, MapPin, DollarSign, Clock, FileText, ExternalLink } from 'lucide-react';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (jobData: any) => Promise<void>;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose, onAddJob }) => {
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('Gurugram');
  const [atsSource, setAtsSource] = useState('Workday');
  const [applyLink, setApplyLink] = useState('');
  const [salaryMin, setSalaryMin] = useState<number | ''>('');
  const [salaryMax, setSalaryMax] = useState<number | ''>('');
  const [expMin, setExpMin] = useState<number | ''>('');
  const [expMax, setExpMax] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const liveSearchQuery = `salary for ${title.trim() || 'Senior Role'} at ${companyName.trim() || 'Target Company'} in ${location.trim() || 'Gurugram'} AmbitionBox Glassdoor`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !companyName.trim() || !description.trim()) {
      alert('Please provide Job Title, Company Name, and Job Description.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddJob({
        title,
        company_name: companyName,
        location,
        ats_source: atsSource,
        apply_link: applyLink,
        salary_range_lpa: salaryMin && salaryMax ? [Number(salaryMin), Number(salaryMax)] : undefined,
        experience_range_years: expMin && expMax ? [Number(expMin), Number(expMax)] : undefined,
        description,
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Error adding job listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="glass-panel rounded-2xl p-4 sm:p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-zinc-200 border border-white/[0.1] my-auto">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base sm:text-lg tracking-tight">Add Job Listing for Evaluation</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Job Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Power Platform Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-zinc-100 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Microsoft, Deloitte"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-zinc-100 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Gurugram, Bengaluru, Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-zinc-100 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">ATS Portal Source</label>
              <select
                value={atsSource}
                onChange={(e) => setAtsSource(e.target.value)}
                className="w-full px-3 py-2 bg-[#121620] border border-white/[0.08] rounded-xl text-zinc-100 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition"
              >
                <option value="Workday">Workday</option>
                <option value="Greenhouse">Greenhouse</option>
                <option value="Lever">Lever</option>
                <option value="Ashby">Ashby</option>
                <option value="SmartRecruiters">SmartRecruiters</option>
                <option value="Custom">Direct Corporate Portal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-300 font-medium">Salary Range (LPA)</label>
                <span className="text-[10px] text-amber-400/90 font-mono">Optional</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="e.g. 18"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-1/2 px-2.5 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-zinc-100 focus:outline-none focus:border-blue-500"
                />
                <span className="text-zinc-500 font-bold">-</span>
                <input
                  type="number"
                  placeholder="e.g. 26"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-1/2 px-2.5 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Leave blank to auto-benchmark via AmbitionBox & Glassdoor.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-300 font-medium">Experience (Years)</label>
                <span className="text-[10px] text-blue-400/90 font-mono">Optional</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="e.g. 3"
                  value={expMin}
                  onChange={(e) => setExpMin(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-1/2 px-2.5 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-zinc-100 focus:outline-none focus:border-blue-500"
                />
                <span className="text-zinc-500 font-bold">-</span>
                <input
                  type="number"
                  placeholder="e.g. 6"
                  value={expMax}
                  onChange={(e) => setExpMax(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-1/2 px-2.5 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Leave blank to auto-infer from title seniority (e.g. Senior = 3-6y).
              </p>
            </div>
          </div>

          {/* Live AmbitionBox & Glassdoor Search String Preview */}
          <div className="p-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-zinc-300 flex items-center gap-1">
                <span>AmbitionBox & Glassdoor Search String</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-medium">Live Generator</span>
            </div>
            <code className="block text-[10px] text-zinc-400 font-mono bg-[#080A0F] p-1.5 rounded-lg border border-white/[0.06] truncate">
              "{liveSearchQuery}"
            </code>
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Direct Apply Link</label>
            <input
              type="url"
              placeholder="https://company.wd3.myworkdayjobs.com/careers/job/..."
              value={applyLink}
              onChange={(e) => setApplyLink(e.target.value)}
              className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-zinc-100 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Full Job Description *</label>
            <textarea
              rows={5}
              required
              placeholder="Paste job description, responsibilities, and qualifications here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-zinc-100 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition font-sans placeholder-zinc-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50 border border-blue-400/25"
            >
              {isSubmitting ? 'Adding...' : 'Add & Stage Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
