import { useMemo } from 'react';
import { timeBasedActivities } from '../activities/timeBased';
import type { Project } from '../types/projects';
import { useAppData } from '../lib/AppDataContext';
import './ProjectsList.css';

interface ProjectsListProps {
  projects: Project[];
}

const getActivityEmoji = (activityId: string): string => {
  const activity = timeBasedActivities.find(a => a.id === activityId);
  return activity?.emoji || '📁';
};
const getProjectEmojis = (project: Project): string => {
  return project.activityIds.map(getActivityEmoji).join(' ');
};

export default function ProjectsList({ projects }: ProjectsListProps) {
  const visible = useMemo(
    () => projects.filter((p) => p.status !== 'abandoned'),
    [projects]
  );
  const { logEntries } = useAppData();
  return (
  <div className="projects-list">
    <h3 className="projects-list__title">Projects</h3>
    {visible.length === 0 && (
      <span className="projects-list__empty">
        No projects yet. Add them while logging time spent.
      </span>
    )}
    {visible.map((project) => {
      const hours = logEntries
        .filter(e => e.projectIds?.includes(project.id))
        .reduce((sum, e) => sum + (e.hours || 0), 0);
      return (
        <div
          key={project.id}
          className={`project-chip ${project.status === 'completed' ? 'project-chip--completed' : ''}`}
        > 
          <div>
            <span className="project-chip__name">{project.name} </span>
            <span className="project-chip__emojis" aria-hidden="true">
              {getProjectEmojis(project)}
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', fontStyle: 'normal' }}>&nbsp;{hours} hours</p>
        </div>
      );
    })}
  </div>
);
}
