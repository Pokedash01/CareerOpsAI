export interface Education {
  institution: string;
  degree: string;
  details: string;
  dates: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  location: string;
  dates: string;
  summary: string;
  bullets: string[];
}

export interface ScrapedLinkSource {
  url: string;
  type: 'github' | 'linkedin' | 'portfolio' | 'blog' | 'other';
  title?: string;
  scraped_summary?: string;
  extracted_highlights?: string[];
  status: 'scraped' | 'failed' | 'skipped';
  error?: string;
}

export interface CandidateProject {
  title: string;
  description: string;
  source_url?: string;
  technologies?: string[];
  highlights?: string[];
}

export interface UserProfile {
  full_name: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    links: string;
  };
  total_years_experience: number;
  seniority_tier: string;
  summary?: string;
  education: Education[];
  experience: WorkExperience[];
  skills: string[];
  certifications: string[];
  target_roles: string[];
  anti_targets: string[];
  preferred_locations: string[];
  salary_expectation?: {
    min_lpa: number;
    max_lpa?: number;
  };
  scraped_sources?: ScrapedLinkSource[];
  portfolio_projects?: CandidateProject[];
  parsed_from_document?: {
    file_name: string;
    file_type: 'pdf' | 'docx' | 'text';
    parsed_at: string;
    links_found: number;
    links_scraped: number;
  };
}

export interface MatchResult {
  is_viable: boolean;
  match_score: number;
  detected_experience?: string;
  salary_range?: string;
  location?: string;
  skills_gap?: string;
  rejection_reason?: string;
  summary_reasoning?: string;
  strengths?: string[];
  weaknesses?: string[];
  evaluated_at?: string;
  reason?: string;
  skill_gap?: string[];
  highlight_keywords?: string[];
}

export interface GroundingStats {
  total_bullets: number;
  grounded_count: number;
  hallucinations_blocked: number;
  metrics_verified: boolean;
}

export interface TailoredContent {
  job_title: string;
  company: string;
  jd_keywords: string[];
  summary: string;
  skills_ordered: string[];
  experience: Array<{
    company: string;
    bullets: string[];
  }>;
  cover_letter_paragraphs: string[];
  generated_at: string;
  grounding_stats?: GroundingStats;
}

export type JobStatus = 'discovered' | 'applied' | 'interviewing' | 'rejected' | 'expired' | 'new' | 'viable' | 'notified' | 'archived';

export type LinkVerificationStatus = 'verified_active' | 'active_portal' | 'unverified' | 'expired_or_invalid';

export interface JobListing {
  id: string;
  title: string;
  company_name: string;
  location: string;
  salary_range_lpa?: [number, number];
  salary_is_estimated?: boolean;
  salary_source?: string;
  salary_search_query?: string;
  salary_ambitionbox_url?: string;
  salary_glassdoor_url?: string;
  experience_range_years?: [number, number];
  experience_is_inferred?: boolean;
  experience_inferred_reason?: string;
  description: string;
  apply_link: string;
  ats_source: string;
  discovered_at: string;
  posted_date?: string;
  posted_days_ago?: number;
  is_direct_posting?: boolean;
  verification_status?: LinkVerificationStatus;
  verification_notes?: string;
  verified_at?: string;
  fit?: MatchResult;
  tailored?: TailoredContent;
  tailored_resume?: string;
  cover_letter?: string;
  notes?: string;
  status: JobStatus;
}

export interface PipelineStats {
  total_jobs: number;
  seen_count: number;
  viable_count: number;
  high_fit_count: number;
  notified_count: number;
  applied_count: number;
  last_run: string;
}

export interface AppSettings {
  min_match_score: number;
  telegram_configured: boolean;
  telegram_chat_id: string;
  telegram_bot_token?: string;
  telegram_bot_name?: string;
  telegram_custom_header?: string;
  telegram_include_salary?: boolean;
  telegram_include_skill_gap?: boolean;
  telegram_include_apply_link?: boolean;
  seen_ttl_days: number;
  workflow_enabled?: boolean;
  workflow_interval_hours?: number;
  auto_notify_telegram?: boolean;
  serpapi_key?: string;
  last_updated?: string;
}

export interface WorkflowRunLog {
  id: string;
  started_at: string;
  completed_at: string;
  trigger: 'scheduled_4h' | 'manual';
  new_jobs_found: number;
  evaluated_count: number;
  high_fit_count: number;
  notified_count: number;
  status: 'completed' | 'failed' | 'running';
  summary: string;
}

export interface WorkflowState {
  enabled: boolean;
  interval_hours: number;
  last_run: string | null;
  next_run: string;
  is_running: boolean;
  total_runs: number;
  auto_notify_telegram: boolean;
  runs: WorkflowRunLog[];
  last_updated?: string;
}

export interface SearchedJobRecord {
  id: string;
  signature: string; // `${company.toLowerCase()}_${cleanTitle.toLowerCase()}`
  normalized_url?: string;
  company_name: string;
  title: string;
  status: 'discovered' | 'applied' | 'rejected' | 'deleted' | 'expired' | 'interviewing';
  discovered_at: string;
  rejected_at?: string;
  last_seen_at: string;
}

export interface SearchedRegistryStats {
  total_tracked: number;
  rejected_count: number;
  retention_days: number;
  last_truncated_at?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  full_name?: string;
  headline?: string;
  created_at: string;
  last_login_at?: string;
  avatar_url?: string;
}

export interface AuthSessionResponse {
  success: boolean;
  user: UserAccount | null;
  token?: string;
  message?: string;
}

export interface SavedDeviceAccount {
  id: string;
  email: string;
  name: string;
  full_name?: string;
  last_active_at: string;
}

