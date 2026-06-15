import type { LogEntry } from '../types/logEntry';

export const MAIN_QUEST_MULTIPLIER = 1.25;

/**
 * Compute the points earned for a log entry given the activity's base
 * point value and whether it counts toward the main quest.
 *
 * - per_hour activities: basePoints * hours
 * - fixed activities: basePoints (can be negative for detractors)
 */
export function calculatePoints(params: {
  basePoints: number;
  type: 'per_hour' | 'fixed';
  hours?: number;
  countsForMainQuest: boolean;
}): number {
  const { basePoints, type, hours, countsForMainQuest } = params;
  const raw = type === 'per_hour' ? basePoints * (hours ?? 0) : basePoints;
  const withMultiplier = countsForMainQuest ? raw * MAIN_QUEST_MULTIPLIER : raw;
  return Math.round(withMultiplier * 100) / 100;
}

/**
 * Sum total points earned by a user across all log entries.
 */
export function totalPoints(entries: LogEntry[], user: 'pb' | 'jam'): number {
  return entries
    .filter((e) => e.user === user)
    .reduce((sum, e) => sum + e.pointsEarned, 0);
}

/**
 * Sum total points earned toward the main quest by a user.
 */
export function mainQuestPoints(entries: LogEntry[], user: 'pb' | 'jam'): number {
  return entries
    .filter((e) => e.user === user && e.countsForMainQuest)
    .reduce((sum, e) => sum + e.pointsEarned, 0);
}

/**
 * Sum total hours logged by a user across all per-hour activities.
 */
export function totalHours(entries: LogEntry[], user: 'pb' | 'jam'): number {
  return entries
    .filter((e) => e.user === user && e.hours != null)
    .reduce((sum, e) => sum + (e.hours ?? 0), 0);
}

/**
 * Compute jar fill percentage (0-100), clamped.
 */
export function jarFillPercent(points: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.max(0, Math.min(100, (points / goal) * 100));
}
