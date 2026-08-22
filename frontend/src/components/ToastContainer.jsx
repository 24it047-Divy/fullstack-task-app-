import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => {
        let Icon = Info;
        let badgeClass = 'toast-info';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          badgeClass = 'toast-success';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          badgeClass = 'toast-error';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          badgeClass = 'toast-warning';
        }

        return (
          <div key={toast.id} className={`toast-item ${badgeClass}`}>
            <div className="toast-icon">
              <Icon size={18} />
            </div>
            <div className="toast-message">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="toast-close"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
