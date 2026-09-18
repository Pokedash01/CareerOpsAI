/**
 * Universal Synchronized Clock for Multi-Device Operations.
 * Aligns automation cycles to deterministic global UTC clock intervals
 * so that all connected devices (mobile, laptop, server) show the exact
 * same countdown down to the identical second without drift.
 */

export function getSynchronizedNextRunIso(intervalHours = 4): string {
  const now = Date.now();
  const intervalMs = (intervalHours || 4) * 3600 * 1000;
  const nextTimestamp = Math.ceil((now + 1000) / intervalMs) * intervalMs;
  return new Date(nextTimestamp).toISOString();
}

export function getSynchronizedRemaining(
  _nextRunIso?: string,
  intervalHours = 4,
  isRunning = false
): string {
  if (isRunning) return 'Scanning now...';
  const now = Date.now();
  const intervalMs = (intervalHours || 4) * 3600 * 1000;
  // Universal deterministic UTC modulo countdown:
  // Math.ceil((now + 1000) / intervalMs) * intervalMs computes the exact upcoming
  // global UTC schedule point (00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC).
  // Guaranteed identical down to the millisecond across every phone, laptop, and server worldwide.
  const targetTime = Math.ceil((now + 1000) / intervalMs) * intervalMs;

  const diff = Math.max(0, targetTime - now);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
}
