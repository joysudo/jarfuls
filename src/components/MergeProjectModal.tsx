import { useState } from 'react';
import ModalShell from './ModalShell';
import type { Project } from '../types/projects';
import { timeBasedActivities } from '../activities/timeBased';

interface MergeProjectModalProps {
  project: Project;
  newActivityId: string;
  onConfirm: (mergedProject: Project) => void;
  onCancel: () => void;
  onDelete?: (projectId: string) => void;
}

const getActivityEmoji = (activityId: string): string => {
  const activity = timeBasedActivities.find(a => a.id === activityId);
  return activity?.emoji || '📁';
};

export default function MergeProjectModal({
  project,
  newActivityId,
  onConfirm,
  onCancel,
  onDelete
}: MergeProjectModalProps) {
  const [renameValue, setRenameValue] = useState(project.name);
  const [showRenameInput, setShowRenameInput] = useState(false);

  const handleMerge = () => {
    const updatedProject = {
      ...project,
      name: renameValue,
      activityIds: [...project.activityIds, newActivityId],
    };
    onConfirm(updatedProject);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${project.name}"? This won't affect past logged hours, but will remove the project from future selections.`)) {
      onDelete?.(project.id);
      onCancel();
    }
  };

  // Helper to get activity name from ID (if you have an activities lookup)
  const getActivityDisplayName = (activityId: string) => {
    // You can pass an activities prop or just show the ID
    return activityId.replace(/_/g, ' ');
  };

  return (
    <ModalShell
      title="Project Already Exists"
      subtitle={`"${project.name}" already exists`}
      onClose={onCancel}
      small={false}
    >
      <div className="merge-modal__content">
        <p style={{margin: '0'}}>Do you want to add <strong>{getActivityEmoji(newActivityId)} {getActivityDisplayName(newActivityId)}</strong> to this project?</p>

        {/* <div className="merge-modal__activities"> */}
          <span className="merge-modal__label">You've never logged this activity under {project.name} before. Currently, this project includes</span>
          {/* <div className="merge-modal__activity-list"> */}
            {project.activityIds.map((activityId) => (
              <span key={activityId} className="merge-modal__activity-tag">
                &nbsp;{getActivityEmoji(activityId)}
                {getActivityDisplayName(activityId)}
              </span>
            ))}.
          {/* </div> */}
        {/* </div> */}

        <div className="merge-modal__actions">
          <div className="merge-modal__rename-section" style={{marginTop: '16px'}}>
            {!showRenameInput ? (
              <button
                type="button"
                className="merge-modal__rename-btn modal__btn modal__btn--danger"
                onClick={() => setShowRenameInput(true)}
              >
                No. Rename this project instead.
              </button>
            ) : (
              <div className="merge-modal__rename-input-group">
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  placeholder="New project name"
                  autoFocus
                />
                <button
                  type="button"
                  className="merge-modal__cancel-btn"
                  onClick={() => setShowRenameInput(false)}
                >
                  Cancel
                </button>
              </div>
            )}

            {onDelete && (
              <button
                type="button"
                className="merge-modal__delete-btn"
                onClick={handleDelete}
              >
                🗑️ Delete Project
              </button>
            )}
          </div>

          <div className="merge-modal__button-group">
            {/* <button
              type="button"
              className="merge-modal__cancel-btn"
              onClick={onCancel}
            >
              Cancel
            </button> */}
            <button
              type="button"
              className="merge-modal__confirm-btn modal__btn"
              onClick={handleMerge}
            >
              Yes, <strong>{getActivityDisplayName(newActivityId)}</strong> is a part of <strong>{project.name}</strong>.
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}