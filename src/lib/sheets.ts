import type { LogEntry, LogEntryRow } from '../types/logEntry';
import { LOG_ENTRY_COLUMNS } from '../types/logEntry';
import type { Project } from '../types/projects';

const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY as string | undefined;
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_SHEET_ID as string | undefined;
const WEBAPP_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBAPP_URL as string | undefined;
const WEBAPP_TOKEN = import.meta.env.VITE_GOOGLE_SHEETS_WEBAPP_TOKEN as string | undefined;

const LOGS_SHEET = 'Logs';
const PROJECTS_SHEET = 'Projects';
const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

function assertConfigured() {
  if (!API_KEY || !SHEET_ID) {
    throw new Error('Google Sheets API key and Sheet ID must be configured in .env');
  }
}

// ---------------------------------------------------------------------
// READ functions (use API key - works fine)
// ---------------------------------------------------------------------

async function fetchRange(range: string): Promise<string[][]> {
  assertConfigured();
  const url = `${SHEETS_BASE}/${SHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to read sheet range "${range}": ${res.status} ${body}`);
  }
  const data = await res.json();
  return (data.values ?? []) as string[][];
}

// ---------------------------------------------------------------------
// WRITE functions (use web app with token)
// ---------------------------------------------------------------------

// async function writeToSheet(payload: any): Promise<void> {
//   if (!WEBAPP_URL || !WEBAPP_TOKEN) {
//     throw new Error(
//       'Google Sheets web app not configured. Please set VITE_GOOGLE_SHEETS_WEBAPP_URL and VITE_GOOGLE_SHEETS_WEBAPP_TOKEN in .env'
//     );
//   }
  
//   const url = new URL(WEBAPP_URL);
//   url.searchParams.set('token', WEBAPP_TOKEN);
  
//   const res = await fetch(url.toString(), {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });
  
//   if (!res.ok) {
//     const body = await res.text();
//     throw new Error(`Failed to write to Google Sheet: ${res.status} ${body}`);
//   }
  
//   const result = await res.json();
//   if (!result.success) {
//     throw new Error(`Google Sheets web app error: ${result.message || 'Unknown error'}`);
//   }
// }

async function writeToSheet(payload: any): Promise<void> {
  if (!WEBAPP_URL || !WEBAPP_TOKEN) {
    throw new Error('Google Sheets web app not configured...');
  }
  
  const url = new URL(WEBAPP_URL);
  url.searchParams.set('token', WEBAPP_TOKEN);
  
  // Use no-cors mode - this bypasses CORS restrictions
  await fetch(url.toString(), {
    method: 'POST',
    mode: 'no-cors',  // KEY: this bypasses CORS
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  // With no-cors, we can't read the response
  // The request will still go through to Google
  console.log('Data sent to Google Sheets:', payload);
}

// ---------------------------------------------------------------------
// Logs
// ---------------------------------------------------------------------

function rowToLogEntry(row: string[]): LogEntry | null {
  if (row.length === 0 || !row[0]) return null;

  const record: Partial<LogEntryRow> = {};
  LOG_ENTRY_COLUMNS.forEach((col, i) => {
    (record as Record<string, string>)[col] = row[i] ?? '';
  });

  const user = record.user === 'pb' || record.user === 'jam' ? record.user : null;
  if (!user) return null;

  return {
    id: record.id ?? '',
    user,
    activityId: record.activityId ?? '',
    timestamp: record.timestamp ?? '',
    hours: record.hours ? Number(record.hours) : undefined,
    pointsEarned: record.pointsEarned ? Number(record.pointsEarned) : 0,
    countsForMainQuest: record.countsForMainQuest === 'true',
    completedProject: record.completedProject === 'true',
    notes: record.notes || undefined,
    projectIds: record.projectIds ? record.projectIds.split(',').filter(Boolean) : undefined,
  };
}

export async function fetchLogEntries(): Promise<LogEntry[]> {
  try {
    const rows = await fetchRange(`${LOGS_SHEET}!A2:J`);
    return rows.map(rowToLogEntry).filter((e): e is LogEntry => e !== null);
  } catch (error) {
    console.warn('Could not fetch log entries (sheet may be empty or missing):', error);
    return [];
  }
}

export async function appendLogEntry(entry: LogEntry): Promise<void> {
  await writeToSheet({
    type: 'log',
    id: entry.id,
    user: entry.user,
    activityId: entry.activityId,
    timestamp: entry.timestamp,
    hours: entry.hours,
    pointsEarned: entry.pointsEarned,
    countsForMainQuest: entry.countsForMainQuest,
    completedProject: entry.completedProject,
    notes: entry.notes,
    projectIds: entry.projectIds,
  });
}

// ---------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------

const PROJECT_COLUMNS = ['id', 'name', 'user', 'activityIds', 'status', 'hoursLogged', 'createdAt'] as const;

function rowToProject(row: string[]): Project | null {
  if (row.length === 0 || !row[0]) return null;
  const record: Record<string, string> = {};
  PROJECT_COLUMNS.forEach((col, i) => {
    record[col] = row[i] ?? '';
  });

  const user = record.user === 'pb' || record.user === 'jam' ? record.user : null;
  const status =
    record.status === 'active' || record.status === 'completed' || record.status === 'abandoned'
      ? record.status
      : null;
  if (!user || !status) return null;

  const activityIds = record.activityIds ? record.activityIds.split(',').filter(Boolean) : [];
  
  return {
    id: record.id,
    name: record.name,
    user,
    activityIds,
    status,
    hoursLogged: record.hoursLogged ? Number(record.hoursLogged) : 0,
    createdAt: record.createdAt,
  };
}

// function projectToRow(project: Project): string[] {
//   return [
//     project.id,
//     project.name,
//     project.user,
//     project.activityIds.join(','),  // Convert array to comma-separated string
//     project.status,
//     String(project.hoursLogged),
//     project.createdAt,
//   ];
// }

export async function fetchProjects(): Promise<Project[]> {
  try {
    const rows = await fetchRange(`${PROJECTS_SHEET}!A2:G`);
    return rows.map(rowToProject).filter((p): p is Project => p !== null);
  } catch (error) {
    console.warn('Could not fetch projects (sheet may be empty or missing):', error);
    return [];
  }
}

export async function appendProject(project: Project): Promise<void> {
  await writeToSheet({
    type: 'project',
    id: project.id,
    name: project.name,
    user: project.user,
    activityIds: project.activityIds,
    status: project.status,
    hoursLogged: project.hoursLogged,
    createdAt: project.createdAt,
  });
}

export async function updateProject(project: Project): Promise<void> {
  await writeToSheet({
    type: 'project_update',
    id: project.id,
    name: project.name,
    user: project.user,
    activityIds: project.activityIds,
    status: project.status,
    hoursLogged: project.hoursLogged,
    createdAt: project.createdAt,
  });
}

// ---------------------------------------------------------------------
// Combined load
// ---------------------------------------------------------------------

export interface SheetData {
  logEntries: LogEntry[];
  projects: Project[];
}

export async function fetchAllData(): Promise<SheetData> {
  const [logEntries, projects] = await Promise.all([
    fetchLogEntries().catch(() => []),
    fetchProjects().catch(() => [])
  ]);
  return { logEntries, projects };
}