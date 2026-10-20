import React from "react";

export const ErrorBanner = ({ message, onRetry, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="error-banner-card" role="alert">
      <div className="error-content-row">
        <div className="error-icon-box">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div className="error-text-wrap">
          <h4 className="error-title">Data Connection Notice</h4>
          <p className="error-message">{message}</p>
        </div>
      </div>

      <div className="error-actions">
        {onRetry && (
          <button onClick={onRetry} className="error-retry-btn">
            Retry Connection
          </button>
        )}
        {onDismiss && (
          <button onClick={onDismiss} className="error-dismiss-btn" aria-label="Dismiss error notice">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
