/**
 * Indian Standard Time (IST) Real-Time Date & Recency Utilities
 * Standard: UTC + 5:30 (Asia/Kolkata)
 */

export interface IstRecency {
  daysAgo: number;
  label: string;
  badgeText: string;
  istDateStr: string;
  isToday: boolean;
  isYesterday: boolean;
}

/**
 * Calculates calendar day recency in Indian Standard Time (UTC + 5:30).
 * Accurately handles midnight rollover so "Found Today" changes to "Found 1 day ago"
 * as soon as midnight passes in IST, not arbitrary 24h rolling windows.
 */
export function calculateIstRecency(dateInput?: string | number | Date | null): IstRecency {
  if (!dateInput) {
    return {
      daysAgo: 0,
      label: 'Found Today',
      badgeText: 'Today',
      istDateStr: 'Today (IST)',
      isToday: true,
      isYesterday: false,
    };
  }

  const targetDate = new Date(dateInput);
  if (isNaN(targetDate.getTime())) {
    return {
      daysAgo: 0,
      label: 'Found Today',
      badgeText: 'Today',
      istDateStr: 'Today (IST)',
      isToday: true,
      isYesterday: false,
    };
  }

  // 5 hours 30 minutes in milliseconds = 19,800,000 ms
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const nowUtc = Date.now();

  const nowIst = new Date(nowUtc + IST_OFFSET_MS);
  const targetIst = new Date(targetDate.getTime() + IST_OFFSET_MS);

  // Midnight UTC representations of IST calendar dates
  const nowDateOnly = Date.UTC(nowIst.getUTCFullYear(), nowIst.getUTCMonth(), nowIst.getUTCDate());
  const targetDateOnly = Date.UTC(targetIst.getUTCFullYear(), targetIst.getUTCMonth(), targetIst.getUTCDate());

  const diffMs = nowDateOnly - targetDateOnly;
  const diffDays = Math.max(0, Math.floor(diffMs / (24 * 60 * 60 * 1000)));

  // Format exact human-friendly IST date & time: e.g. "18 Sep, 11:30 AM IST"
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  let istDateStr = '';
  try {
    istDateStr = `${formatter.format(targetDate)} IST`;
  } catch {
    istDateStr = targetDate.toLocaleDateString();
  }

  let label = 'Found Today';
  let badgeText = 'Today';
  let isToday = false;
  let isYesterday = false;

  if (diffDays === 0) {
    label = 'Found Today';
    badgeText = 'Today';
    isToday = true;
  } else if (diffDays === 1) {
    label = 'Found 1 day ago';
    badgeText = '1d ago';
    isYesterday = true;
  } else {
    label = `Found ${diffDays} days ago`;
    badgeText = `${diffDays}d ago`;
  }

  return {
    daysAgo: diffDays,
    label,
    badgeText,
    istDateStr,
    isToday,
    isYesterday,
  };
}

/**
 * Returns current timestamp formatted as IST string
 */
export function getCurrentIstTimeString(): string {
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'medium',
  });
  return `${formatter.format(new Date())} (IST)`;
}
