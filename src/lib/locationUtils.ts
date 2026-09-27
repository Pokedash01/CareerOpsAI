/**
 * Location normalization and geographic canonicalization utility
 * Maps diverse variations (e.g. 'Gurgaon, Haryana, India', 'Gurugram', 'remote/India')
 * into standard, user-friendly geographic buckets without duplicate filters.
 */

export interface CanonicalLocation {
  id: string;
  label: string;
  type: 'remote' | 'hybrid' | 'city';
}

// Canonical city hubs and keywords
const LOCATION_MAPPINGS: Array<{
  id: string;
  label: string;
  type: 'remote' | 'hybrid' | 'city';
  patterns: RegExp[];
}> = [
  {
    id: 'remote',
    label: 'Remote',
    type: 'remote',
    patterns: [/\bremote\b/i, /\bwork\s*from\s*home\b/i, /\bwfh\b/i, /\bvirtual\b/i],
  },
  {
    id: 'gurugram',
    label: 'Gurugram / Gurgaon',
    type: 'city',
    patterns: [/\bgurgaon\b/i, /\bgurugram\b/i],
  },
  {
    id: 'noida',
    label: 'Noida / Greater Noida',
    type: 'city',
    patterns: [/\bnoida\b/i],
  },
  {
    id: 'delhi',
    label: 'Delhi NCR',
    type: 'city',
    patterns: [/\bnew\s*delhi\b/i, /\bdelhi\b/i, /\bncr\b/i],
  },
  {
    id: 'bengaluru',
    label: 'Bengaluru / Bangalore',
    type: 'city',
    patterns: [/\bbangalore\b/i, /\bbengaluru\b/i],
  },
  {
    id: 'hyderabad',
    label: 'Hyderabad',
    type: 'city',
    patterns: [/\bhyderabad\b/i, /\bsecunderabad\b/i],
  },
  {
    id: 'pune',
    label: 'Pune',
    type: 'city',
    patterns: [/\bpune\b/i],
  },
  {
    id: 'mumbai',
    label: 'Mumbai',
    type: 'city',
    patterns: [/\bmumbai\b/i, /\bnavi\s*mumbai\b/i, /\bthane\b/i],
  },
  {
    id: 'chennai',
    label: 'Chennai',
    type: 'city',
    patterns: [/\bchennai\b/i, /\bmadras\b/i],
  },
  {
    id: 'kolkata',
    label: 'Kolkata',
    type: 'city',
    patterns: [/\bkolkata\b/i, /\bcalcutta\b/i],
  },
  {
    id: 'ahmedabad',
    label: 'Ahmedabad',
    type: 'city',
    patterns: [/\bahmedabad\b/i],
  },
];

/**
 * Extracts canonical location IDs for a given job location string.
 * A single job like "Remote / Gurgaon, India" can match both 'remote' and 'gurugram'.
 */
export function getCanonicalLocationsForJob(rawLocation: string | undefined): string[] {
  if (!rawLocation) return [];
  const normalized = rawLocation.trim().toLowerCase();
  const matched = new Set<string>();

  for (const item of LOCATION_MAPPINGS) {
    for (const pat of item.patterns) {
      if (pat.test(normalized)) {
        matched.add(item.id);
        break;
      }
    }
  }

  // If no canonical mapping matches, fallback to cleaned city name (e.g. "Chandigarh")
  if (matched.size === 0) {
    const cleaned = cleanRawLocation(rawLocation);
    if (cleaned) {
      matched.add(cleaned.toLowerCase());
    }
  }

  return Array.from(matched);
}

/**
 * Cleans a raw location string by stripping generic countries and excess punctuation
 */
function cleanRawLocation(raw: string): string {
  let cleaned = raw
    .replace(/\b(india|usa|united states|uk)\b/gi, '')
    .replace(/[/\\,|]+/g, ' ')
    .trim();
  // Capitalize words
  if (cleaned.length > 2) {
    return cleaned
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
  return raw.trim();
}

/**
 * Returns available unique canonical filter options present across all loaded jobs
 * and the user's preferred locations.
 */
export function getAvailableCanonicalLocations(
  rawJobLocations: string[],
  preferredLocations: string[] = []
): Array<{ id: string; label: string; count: number }> {
  const counts: Record<string, number> = {};
  const labelMap: Record<string, string> = {};

  // Initialize known labels
  for (const m of LOCATION_MAPPINGS) {
    labelMap[m.id] = m.label;
  }

  for (const rawLoc of rawJobLocations) {
    const canonIds = getCanonicalLocationsForJob(rawLoc);
    for (const id of canonIds) {
      counts[id] = (counts[id] || 0) + 1;
      if (!labelMap[id]) {
        labelMap[id] = cleanRawLocation(rawLoc) || id;
      }
    }
  }

  // Also ensure preferred locations are represented even if current batch has 0
  for (const pref of preferredLocations) {
    const canonIds = getCanonicalLocationsForJob(pref);
    for (const id of canonIds) {
      if (counts[id] === undefined) {
        counts[id] = 0;
      }
      if (!labelMap[id]) {
        labelMap[id] = cleanRawLocation(pref) || id;
      }
    }
  }

  // Sort: Remote first, then popular cities by count, then alphabetical
  return Object.keys(counts)
    .map((id) => ({
      id,
      label: labelMap[id] || id,
      count: counts[id] || 0,
    }))
    .sort((a, b) => {
      if (a.id === 'remote') return -1;
      if (b.id === 'remote') return 1;
      if (b.count !== a.count) return b.count - a.count;
      return a.label.localeCompare(b.label);
    });
}

/**
 * Checks whether a job's location string matches the selected canonical location filter
 */
export function jobMatchesLocationFilter(rawLocation: string | undefined, filterId: string): boolean {
  if (filterId === 'all') return true;
  const canonicalIds = getCanonicalLocationsForJob(rawLocation);
  return canonicalIds.includes(filterId.toLowerCase());
}
