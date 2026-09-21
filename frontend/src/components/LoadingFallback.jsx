import React from 'react';
import { Loader2, Cpu, Zap } from 'lucide-react';

export function LoadingFallback({ message = "Loading component chunk..." }) {
  return (
    <div className="loading-fallback-container">
      <div className="loading-card">
        <div className="loading-icon-wrapper">
          <Loader2 className="loading-spinner" size={36} />
          <div className="loading-pulse-ring"></div>
        </div>
        <h3 className="loading-title">{message}</h3>
        <p className="loading-subtitle flex items-center justify-center gap-1">
          <Zap size={14} className="text-amber-400" /> Dynamic Code Splitting & Code Chunk Loading
        </p>

        {/* Skeleton UI preview */}
        <div className="loading-skeleton-box">
          <div className="skeleton-bar header"></div>
          <div className="skeleton-grid">
            <div className="skeleton-bar card"></div>
            <div className="skeleton-bar card"></div>
            <div className="skeleton-bar card"></div>
          </div>
        </div>

        <div className="loading-badge">
          <Cpu size={12} /> React.lazy() + Suspense Active
        </div>
      </div>
    </div>
  );
}
