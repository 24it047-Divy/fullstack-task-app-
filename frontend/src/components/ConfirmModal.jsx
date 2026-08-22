import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isDeleting }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-close-btn" onClick={onCancel} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className="modal-icon-wrapper">
            <AlertTriangle className="modal-icon text-rose-400" size={24} />
          </div>
          <h3 className="modal-title">{title || 'Confirm Action'}</h3>
        </div>

        <p className="modal-body">{message}</p>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <span className="spinner-sm"></span> Deleting...
              </span>
            ) : (
              'Delete Task'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
