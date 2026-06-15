import { useMemo } from 'react';
import type { Project } from '../types/projects';
import { getActivityById } from '../activities';
import './ProjectsList.css';

interface ProjectsListProps {
  projects: Project[];
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  const visible = useMemo(
    () => projects.filter((p) => p.status !== 'abandoned'),
    [projects]
  );

  return (
    <div className="projects-list">
      <h3 className="projects-list__title">Projects</h3>
      {visible.length === 0 && <span className="projects-list__empty">No projects yet — they'll show up here once you start one.</span>}
      {visible.map((project) => {
        const activity = getActivityById(project.activityId);
        return (
          <div
            key={project.id}
            className={`project-chip ${project.status === 'completed' ? 'project-chip--completed' : ''}`}
          >
            <span aria-hidden="true">{activity?.emoji ?? '📁'}</span> {project.name}
          </div>
        );
      })}
    </div>
  );
}
