import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import type { LogEntry } from '../types/logEntry';
import type { Project } from '../types/projects';
import { fetchAllData, appendLogEntry, appendProject } from '../lib/sheets';

interface AppDataContextValue {
  logEntries: LogEntry[];
  projects: Project[];
  loading: boolean;
  error: string | null;
  /** Add a log entry. Updates local state immediately (optimistic), then
   *  attempts to persist to Google Sheets. */
  addLogEntry: (entry: LogEntry) => Promise<void>;
  /** Add a project. Updates local state immediately, then attempts to
   *  persist to Google Sheets. */
  addProject: (project: Project) => Promise<void>;
  /** Update a project's status/hours locally (e.g. marking completed). */
  updateProject: (id: string, updates: Partial<Project>) => void;
  refresh: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllData();
      setLogEntries(data.logEntries);
      setProjects(data.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data from Google Sheets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial async data load on mount
    refresh();
  }, [refresh]);

  const addLogEntry = useCallback(async (entry: LogEntry) => {
    setLogEntries((prev) => [...prev, entry]);
    try {
      await appendLogEntry(entry);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry to Google Sheets.');
    }
  }, []);

  const addProject = useCallback(async (project: Project) => {
    setProjects((prev) => [...prev, project]);
    try {
      await appendProject(project);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project to Google Sheets.');
    }
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  return (
    <AppDataContext.Provider
      value={{ logEntries, projects, loading, error, addLogEntry, addProject, updateProject, refresh }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is tightly coupled to this provider
export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within an AppDataProvider');
  return ctx;
}
