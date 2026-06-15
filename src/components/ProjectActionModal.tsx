import { useState } from 'react';
import ModalShell from './ModalShell';
import type { Project } from '../types/projects';

interface ProjectActionModalProps {
  project: Project;
  onClose: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
}

export default function ProjectActionModal({ project, onClose, onDelete, onRename }: ProjectActionModalProps) {
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(project.name);

  if (renaming) {
    return (
      <ModalShell title="Rename project" onClose={onClose} small>
        <div className="modal__field">
          <label className="modal__label" htmlFor="rename-input">New name</label>
          <input
            id="rename-input"
            className="modal__input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />
        </div>
        <div className="modal__actions">
          <button type="button" className="modal__btn modal__btn--secondary" onClick={() => setRenaming(false)}>
            Back
          </button>
          <button
            type="button"
            className="modal__btn"
            onClick={() => {
              if (newName.trim()) onRename(newName.trim());
              onClose();
            }}
          >
            Save name
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell title={`Delete "${project.name}"?`} onClose={onClose} small>
      <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', marginTop: 0 }}>
        You won't see this show up at the top of your profile anymore, and it won't show up as an option for new logs.
        
        If you simply  finished this project, select it and "mark as done" instead.
      </p>
      <div className="modal__actions" style={{ justifyContent: 'space-between' }}>
        <button type="button" className="modal__btn modal__btn--secondary" onClick={() => setRenaming(true)}>
          Rename instead
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="modal__btn modal__btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="modal__btn modal__btn--danger"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
