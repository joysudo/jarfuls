export interface LogEntry {
  id: string;
  user: 'pb' | 'jam';
  activityId: string;
  timestamp: string;             // ISO string
  hours?: number;                 // only for per_hour activities
  pointsEarned: number;           // after multiplier calculation
  countsForMainQuest: boolean;    // if true, points x 1.25
  completedProject?: boolean;     // if finishing a project, strikethrough it
  notes?: string;
  projectIds?: string[];          // projects associated with this log (for per_hour activities)
}

// Raw shape as stored in / read from the Google Sheet (all strings, since
// Sheets returns everything as text). Converted to/from LogEntry in
// lib/sheets.ts.
export interface LogEntryRow {
  id: string;
  user: string;
  activityId: string;
  timestamp: string;
  hours: string;
  pointsEarned: string;
  countsForMainQuest: string;
  completedProject: string;
  notes: string;
  projectIds: string;
}

export const LOG_ENTRY_COLUMNS = [
  'id',
  'user',
  'activityId',
  'timestamp',
  'hours',
  'pointsEarned',
  'countsForMainQuest',
  'completedProject',
  'notes',
  'projectIds',
] as const;
