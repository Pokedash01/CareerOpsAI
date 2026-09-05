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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-[#E5E7EB]">
        <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white text-lg">Add Job Listing for Evaluation</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 font-medium mb-1">Job Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Power Platform Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-medium mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Microsoft, Deloitte"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 font-medium mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Gurugram, Bengaluru, Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-medium mb-1">ATS Portal Source</label>
              <select
                value={atsSource}
                onChange={(e) => setAtsSource(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-gray-400 font-medium">Salary Range (LPA)</label>
                <span className="text-[10px] text-amber-400/90 font-mono">Optional</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="e.g. 18"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-1/2 px-2.5 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 focus:outline-none"
                />
                <span className="text-gray-500 font-bold">-</span>
                <input
                  type="number"
                  placeholder="e.g. 26"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-1/2 px-2.5 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                Leave blank to auto-benchmark via AmbitionBox & Glassdoor.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-gray-400 font-medium">Experience (Years)</label>
                <span className="text-[10px] text-blue-400/90 font-mono">Optional</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="e.g. 3"
                  value={expMin}
                  onChange={(e) => setExpMin(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-1/2 px-2.5 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 focus:outline-none"
                />
                <span className="text-gray-500 font-bold">-</span>
                <input
                  type="number"
                  placeholder="e.g. 6"
                  value={expMax}
                  onChange={(e) => setExpMax(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-1/2 px-2.5 py-1.5 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                Leave blank to auto-infer from title seniority (e.g. Senior = 3-6y).
              </p>
            </div>
          </div>

          {/* Live AmbitionBox & Glassdoor Search String Preview */}
          <div className="bg-[#14171E] p-2.5 rounded-xl border border-[#1F2937] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-gray-300 flex items-center gap-1">
                <span>AmbitionBox & Glassdoor Search String</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono">Live Generator</span>
            </div>
            <code className="block text-[10px] text-gray-400 font-mono bg-[#0B0D11] p-1.5 rounded border border-[#1F2937]/80 truncate">
              "{liveSearchQuery}"
            </code>
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-1">Direct Apply Link</label>
            <input
              type="url"
              placeholder="https://company.wd3.myworkdayjobs.com/careers/job/..."
              value={applyLink}
              onChange={(e) => setApplyLink(e.target.value)}
              className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-1">Full Job Description *</label>
            <textarea
              rows={6}
              required
              placeholder="Paste job description, responsibilities, and qualifications here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans placeholder-gray-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1F2937]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-[#1A1D23] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add & Stage Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
