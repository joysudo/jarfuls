import type { LogEntry } from '../types/logEntry';

export type FeedBucket =
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'thisYear'
  | 'longAgo';

export const FEED_BUCKET_LABELS: Record<FeedBucket, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  thisWeek: 'This week',
  lastWeek: 'Last week',
  thisMonth: 'This month',
  thisYear: 'This year',
  longAgo: 'A long time ago...',
};

export const FEED_BUCKET_ORDER: FeedBucket[] = [
  'today',
  'yesterday',
  'thisWeek',
  'lastWeek',
  'thisMonth',
  'thisYear',
  'longAgo',
];

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function startOfWeek(d: Date): Date {
  const copy = startOfDay(d);
  const day = copy.getDay(); // 0 = Sunday
  copy.setDate(copy.getDate() - day);
  return copy;
}

function startOfMonth(d: Date): Date {
  const copy = startOfDay(d);
  copy.setDate(1);
  return copy;
}

function startOfYear(d: Date): Date {
  const copy = startOfDay(d);
  copy.setMonth(0, 1);
  return copy;
}

/**
 * Bucket a single timestamp relative to "now".
 */
export function bucketForTimestamp(timestamp: string, now: Date = new Date()): FeedBucket {
  const date = new Date(timestamp);
  const today = startOfDay(now);
  const entryDay = startOfDay(date);

  const oneDayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((today.getTime() - entryDay.getTime()) / oneDayMs);

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';

  if (entryDay >= startOfWeek(now)) return 'thisWeek';

  const lastWeekStart = startOfWeek(now);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  if (entryDay >= lastWeekStart) return 'lastWeek';

  if (entryDay >= startOfMonth(now)) return 'thisMonth';
  if (entryDay >= startOfYear(now)) return 'thisYear';

  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  if (date >= oneYearAgo) return 'thisYear';

  return 'longAgo';
}

/**
 * Group log entries into feed buckets, sorted reverse-chronologically
 * within each bucket. Returns only non-empty buckets, in display order.
 */
export function groupEntriesForFeed(
  entries: LogEntry[],
  now: Date = new Date()
): { bucket: FeedBucket; label: string; entries: LogEntry[] }[] {
  const buckets = new Map<FeedBucket, LogEntry[]>();

  for (const entry of entries) {
    const bucket = bucketForTimestamp(entry.timestamp, now);
    const list = buckets.get(bucket) ?? [];
    list.push(entry);
    buckets.set(bucket, list);
  }

  const result: { bucket: FeedBucket; label: string; entries: LogEntry[] }[] = [];
  for (const bucket of FEED_BUCKET_ORDER) {
    const list = buckets.get(bucket);
    if (list && list.length > 0) {
      const sorted = [...list].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      result.push({ bucket, label: FEED_BUCKET_LABELS[bucket], entries: sorted });
    }
  }
  return result;
}

/**
 * Format a timestamp for display under an activity name in non-"today"/"yesterday" buckets.
 */
export function formatEntryDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatEntryTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}
