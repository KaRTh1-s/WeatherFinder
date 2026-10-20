import React from "react";

export const LoadingSkeleton = () => {
  return (
    <div className="skeleton-container" aria-busy="true" aria-label="Loading atmospheric telemetry...">
      {/* Hero skeleton */}
      <div className="glass-card skeleton-card hero-skeleton">
        <div className="skeleton-line shimmer title-line" />
        <div className="skeleton-line shimmer subtitle-line" />
        <div className="skeleton-hero-body">
          <div className="skeleton-big-circle shimmer" />
          <div className="skeleton-col">
            <div className="skeleton-line shimmer temp-line" />
            <div className="skeleton-line shimmer small-line" />
          </div>
        </div>
        <div className="skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-cell shimmer" />
          ))}
        </div>
      </div>

      {/* Hourly skeleton */}
      <div className="glass-card skeleton-card">
        <div className="skeleton-line shimmer subtitle-line" />
        <div className="skeleton-hourly-strip">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="skeleton-hourly-pill shimmer" />
          ))}
        </div>
      </div>

      {/* Daily skeleton */}
      <div className="glass-card skeleton-card">
        <div className="skeleton-line shimmer subtitle-line" />
        <div className="skeleton-daily-list">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton-daily-row shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
};
