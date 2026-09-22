import { JobListing, SearchedJobRecord, SearchedRegistryStats } from '../types';

const STORAGE_KEY = 'careerops_searched_registry';

/**
 * Normalizes job URL for strict deduplication
 */
export function normalizeJobUrl(url?: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'ref', 'source', 'gh_src', 'lever-source', 'trk', 'midToken', 'trkInfo',
      'fbclid', 'gclid', 'msclkid', 'twclid', 'yclid', 'spm', 'pos', 'sid'
    ];
    trackingParams.forEach((param) => parsed.searchParams.delete(param));
    parsed.hash = '';
    let norm = parsed.toString().toLowerCase().trim();
    if (norm.endsWith('/')) {
      norm = norm.slice(0, -1);
    }
    return norm;
  } catch {
    return (url || '').toLowerCase().trim();
  }
}

/**
 * Loads the local searched and rejected jobs registry
 */
export function getSearchedRegistry(): Record<string, SearchedJobRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[SearchedRegistry] Failed to parse local registry:', err);
  }
  return {};
}

/**
 * Saves the registry to localStorage
 */
export function saveSearchedRegistry(registry: Record<string, SearchedJobRecord>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
  } catch (err) {
    console.warn('[SearchedRegistry] Failed to save registry:', err);
  }
}

/**
 * Records a job into the registry
 */
export function recordJobInRegistry(
  job: Partial<JobListing> & { id: string; company_name: string; title: string },
  status: 'discovered' | 'applied' | 'rejected' | 'deleted' | 'expired' | 'interviewing' = 'discovered'
): Record<string, SearchedJobRecord> {
  const registry = getSearchedRegistry();
  const cleanTitle = (job.title || '').trim();
  const cleanCompany = (job.company_name || '').trim();
  const sig = `${cleanCompany.toLowerCase()}_${cleanTitle.toLowerCase()}`;
  const normLink = normalizeJobUrl(job.apply_link);
  const now = new Date().toISOString();

  const existing = registry[job.id] || Object.values(registry).find((r) => r.signature === sig);

  const updatedRecord: SearchedJobRecord = {
    id: job.id,
    signature: sig,
    normalized_url: normLink || existing?.normalized_url,
    company_name: cleanCompany,
    title: cleanTitle,
    status: status,
    discovered_at: existing?.discovered_at || job.discovered_at || now,
    rejected_at: status === 'rejected' || status === 'deleted' ? (existing?.rejected_at || now) : existing?.rejected_at,
    last_seen_at: now,
  };

  registry[job.id] = updatedRecord;
  saveSearchedRegistry(registry);
  return registry;
}

/**
 * Checks if a candidate job has already been searched, rejected, or deleted
 */
export function isJobAlreadySearched(
  job: { id?: string; company_name?: string; title?: string; apply_link?: string },
  registry?: Record<string, SearchedJobRecord>
): { searched: boolean; status?: string; reason?: string } {
  const reg = registry || getSearchedRegistry();
  const cleanTitle = (job.title || '').toLowerCase().trim();
  const cleanCompany = (job.company_name || '').toLowerCase().trim();
  const sig = `${cleanCompany}_${cleanTitle}`;
  const normLink = normalizeJobUrl(job.apply_link);

  // 1. Direct ID match
  if (job.id && reg[job.id]) {
    return { searched: true, status: reg[job.id].status, reason: `Matched by job ID ${job.id}` };
  }

  // 2. Signature match (company + title)
  for (const record of Object.values(reg)) {
    if (record.signature === sig) {
      return { searched: true, status: record.status, reason: `Matched by signature ${sig}` };
    }
    if (normLink && record.normalized_url && record.normalized_url === normLink) {
      return { searched: true, status: record.status, reason: `Matched by application URL` };
    }
  }

  return { searched: false };
}

/**
 * Truncates registry based on retention TTL and maximum capacity limit
 */
export function truncateSearchedRegistry(
  ttlDays: number = 30,
  maxCapacity: number = 5000
): { prunedCount: number; remainingCount: number; registry: Record<string, SearchedJobRecord> } {
  const reg = getSearchedRegistry();
  const now = Date.now();
  const cutoffMs = ttlDays * 24 * 3600 * 1000;
  let prunedCount = 0;

  const entries = Object.entries(reg);
  for (const [key, item] of entries) {
    // Keep rejected roles for 2x TTL to satisfy user mandate: "don't research even if I have rejected it"
    const retentionMs = item.status === 'rejected' ? cutoffMs * 2 : cutoffMs;
    const itemTime = item.last_seen_at ? new Date(item.last_seen_at).getTime() : 0;
    if (now - itemTime > retentionMs) {
      delete reg[key];
      prunedCount++;
    }
  }

  // If still exceeds max capacity, prune oldest non-rejected entries first
  const remainingKeys = Object.keys(reg);
  if (remainingKeys.length > maxCapacity) {
    const sorted = remainingKeys
      .map((k) => ({ key: k, item: reg[k] }))
      .sort((a, b) => {
        // Retain rejected records over discovered ones
        if (a.item.status === 'rejected' && b.item.status !== 'rejected') return 1;
        if (b.item.status === 'rejected' && a.item.status !== 'rejected') return -1;
        const aTime = a.item.last_seen_at ? new Date(a.item.last_seen_at).getTime() : 0;
        const bTime = b.item.last_seen_at ? new Date(b.item.last_seen_at).getTime() : 0;
        return aTime - bTime;
      });

    const excess = remainingKeys.length - maxCapacity;
    const toPrune = sorted.slice(0, excess);
    for (const item of toPrune) {
      delete reg[item.key];
      prunedCount++;
    }
  }

  saveSearchedRegistry(reg);
  return {
    prunedCount,
    remainingCount: Object.keys(reg).length,
    registry: reg,
  };
}

/**
 * Returns summary metrics of the searched & rejected registry
 */
export function getRegistryStats(ttlDays: number = 30): SearchedRegistryStats {
  const reg = getSearchedRegistry();
  const values = Object.values(reg);
  const rejectedCount = values.filter((v) => v.status === 'rejected' || v.status === 'deleted').length;

  return {
    total_tracked: values.length,
    rejected_count: rejectedCount,
    retention_days: ttlDays,
    last_truncated_at: new Date().toISOString(),
  };
}
