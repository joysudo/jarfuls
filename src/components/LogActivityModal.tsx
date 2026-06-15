import { useMemo, useState } from 'react';
import ModalShell from './ModalShell';
import ProjectActionModal from './ProjectActionModal';
import type { Activity } from '../types/activities';
import type { Project } from '../types/projects';
import type { LogEntry } from '../types/logEntry';
import { calculatePoints, MAIN_QUEST_MULTIPLIER } from '../lib/points';
import { useAppData } from '../lib/AppDataContext';

interface LogActivityModalProps {
  activity: Activity;
  user: 'pb' | 'jam';
  onClose: () => void;
}

function makeId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function LogActivityModal({ activity, user, onClose }: LogActivityModalProps) {
  const { projects, addLogEntry, addProject, updateProject } = useAppData();

  const [hours, setHours] = useState('');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [completedProject, setCompletedProject] = useState(false);
  const [countsForMainQuest, setCountsForMainQuest] = useState(false);
  const [notes, setNotes] = useState('');
  const [actionProject, setActionProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const activityProjects = useMemo(
    () =>
      projects.filter(
        (p) => p.user === user && p.activityId === activity.id && p.status === 'active'
      ),
    [projects, user, activity.id]
  );

  const hoursNum = Number(hours) || 0;

  const previewPoints = calculatePoints({
    basePoints: activity.points,
    type: activity.type,
    hours: activity.type === 'per_hour' ? hoursNum : undefined,
    countsForMainQuest,
  });

  const toggleProject = (id: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleAddProject = () => {
    const name = newProjectName.trim();
    if (!name) return;
    const project: Project = {
      id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name,
      user,
      activityId: activity.id,
      status: 'active',
      hoursLogged: 0,
      createdAt: new Date().toISOString(),
    };
    addProject(project);
    setSelectedProjectIds((prev) => [...prev, project.id]);
    setNewProjectName('');
  };

  const handleDeleteProject = (project: Project) => {
    updateProject(project.id, { status: 'abandoned' });
    setSelectedProjectIds((prev) => prev.filter((id) => id !== project.id));
  };

  const handleRenameProject = (project: Project, newName: string) => {
    updateProject(project.id, { name: newName });
  };

  const canSubmit = activity.type === 'fixed' || hoursNum > 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    const entry: LogEntry = {
      id: makeId(),
      user,
      activityId: activity.id,
      timestamp: new Date().toISOString(),
      hours: activity.type === 'per_hour' ? hoursNum : undefined,
      pointsEarned: previewPoints,
      countsForMainQuest,
      completedProject: activity.type === 'per_hour' ? completedProject : undefined,
      notes: notes.trim() || undefined,
      projectIds: activity.type === 'per_hour' && selectedProjectIds.length > 0 ? selectedProjectIds : undefined,
    };

    // Update project hours / status locally
    if (activity.type === 'per_hour') {
      for (const pid of selectedProjectIds) {
        const project = projects.find((p) => p.id === pid);
        if (project) {
          updateProject(pid, {
            hoursLogged: project.hoursLogged + hoursNum,
            status: completedProject ? 'completed' : project.status,
          });
        }
      }
    }

    await addLogEntry(entry);
    setSubmitting(false);
    onClose();
  };

  return (
    <>
      <ModalShell
        title={<><span aria-hidden="true">{activity.emoji}</span> {activity.name}</>}
        onClose={onClose}
      >
        {activity.type === 'per_hour' && (
          <div className="modal__field">
            <label className="modal__label" htmlFor="hours-input">Hours</label>
            <input
              id="hours-input"
              className="modal__input"
              type="number"
              min="0"
              step="0.25"
              inputMode="decimal"
              placeholder="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {activity.type === 'per_hour' && activity.requiresProject && (
          <div className="modal__field">
            <label className="modal__label">Projects</label>
            <div className="modal__chips">
              {activityProjects.map((project) => (
                <div
                  key={project.id}
                  className={`chip ${selectedProjectIds.includes(project.id) ? 'chip--selected' : ''}`}
                  onClick={() => toggleProject(project.id)}
                  role="checkbox"
                  aria-checked={selectedProjectIds.includes(project.id)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleProject(project.id); }}
                >
                  {project.name}
                  <button
                    type="button"
                    className="chip__remove"
                    aria-label={`Manage project ${project.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActionProject(project);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {activityProjects.length === 0 && (
                <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                  No projects yet — add one below.
                </span>
              )}
            </div>
            <div className="modal__add-project">
              <input
                className="modal__input"
                placeholder="Add your own project..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddProject(); } }}
              />
              <button type="button" className="modal__btn modal__btn--secondary" onClick={handleAddProject}>
                Add
              </button>
            </div>
          </div>
        )}

        {activity.type === 'per_hour' && selectedProjectIds.length > 0 && (
          <label className="modal__checkbox-row">
            <input
              type="checkbox"
              checked={completedProject}
              onChange={(e) => setCompletedProject(e.target.checked)}
            />
            <span className="modal__checkbox-label">
              Did you finish the project in this session?
              <span className="modal__checkbox-hint">Marks the project as complete — no extra points.</span>
            </span>
          </label>
        )}

        <label className="modal__checkbox-row">
          <input
            type="checkbox"
            checked={countsForMainQuest}
            onChange={(e) => setCountsForMainQuest(e.target.checked)}
          />
          <span className="modal__checkbox-label">
            Counts toward main quest?
            <span className="modal__checkbox-hint">
              Multiplies points earned by {MAIN_QUEST_MULTIPLIER}x{activity.points < 0 ? ' (negative points too)' : ''}.
            </span>
          </span>
        </label>

        <div className="modal__field">
          <label className="modal__label" htmlFor="notes-input">
            {activity.type === 'fixed' ? 'Notes' : 'What did you do?'}
          </label>
          <textarea
            id="notes-input"
            className="modal__textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={activity.type === 'fixed' ? 'Optional notes...' : 'e.g. read 2 chapters of...'}
          />
        </div>

        <div className={`modal__points-preview ${previewPoints < 0 ? 'modal__points-preview--negative' : ''}`}>
          {previewPoints > 0 ? '+' : ''}{previewPoints} points
        </div>

        <div className="modal__actions">
          <button type="button" className="modal__btn modal__btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="modal__btn"
            disabled={!canSubmit || submitting}
            style={{ opacity: !canSubmit || submitting ? 0.6 : 1 }}
            onClick={handleSubmit}
          >
            {submitting ? 'Saving...' : 'Log it'}
          </button>
        </div>
      </ModalShell>

      {actionProject && (
        <ProjectActionModal
          project={actionProject}
          onClose={() => setActionProject(null)}
          onDelete={() => handleDeleteProject(actionProject)}
          onRename={(newName) => handleRenameProject(actionProject, newName)}
        />
      )}
    </>
  );
}
