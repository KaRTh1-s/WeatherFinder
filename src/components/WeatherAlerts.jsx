import React, { useState } from "react";
import { formatLocalTime } from "../utils/formatters";
import { WeatherIcon } from "./WeatherIcons";

export const WeatherAlerts = ({ alertData, timezone = "UTC" }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!alertData) return null;

  const { supported, alerts = [], authority, message } = alertData;

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getSeverityStyle = (severity) => {
    const s = (severity || "").toLowerCase();
    if (s === "extreme" || s.includes("warning")) {
      return {
        badgeClass: "alert-badge-extreme",
        borderColor: "rgba(239, 68, 68, 0.4)",
        glowColor: "rgba(239, 68, 68, 0.15)",
        tag: "WARNING"
      };
    }
    if (s === "severe" || s.includes("watch")) {
      return {
        badgeClass: "alert-badge-severe",
        borderColor: "rgba(245, 158, 11, 0.4)",
        glowColor: "rgba(245, 158, 11, 0.15)",
        tag: "WATCH"
      };
    }
    return {
      badgeClass: "alert-badge-advisory",
      borderColor: "rgba(56, 189, 248, 0.4)",
      glowColor: "rgba(56, 189, 248, 0.15)",
      tag: "ADVISORY"
    };
  };

  return (
    <section className="glass-card alerts-section" aria-label="Severe Weather Alerts">
      <div className="section-header-row">
        <div className="alerts-title-wrap">
          <WeatherIcon name="alert-triangle" size={20} className="alert-header-icon" />
          <div>
            <h3 className="section-title">Severe Weather Advisories</h3>
            <span className="section-subtitle">
              Official Meteorological Bulletin Feed
            </span>
          </div>
        </div>

        {authority && (
          <a
            href={authority.url}
            target="_blank"
            rel="noopener noreferrer"
            className="authority-link"
            title={`Visit ${authority.name}`}
          >
            <span>{authority.name}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </div>

      {alerts.length > 0 ? (
        <div className="alerts-list">
          {alerts.map((alert) => {
            const style = getSeverityStyle(alert.severity);
            const isExpanded = expandedId === alert.id;

            return (
              <div
                key={alert.id}
                className={`alert-item ${isExpanded ? "expanded" : ""}`}
                style={{
                  borderColor: style.borderColor,
                  backgroundColor: style.glowColor
                }}
              >
                <div
                  className="alert-item-header"
                  onClick={() => toggleExpand(alert.id)}
                  role="button"
                  tabIndex="0"
                  onKeyDown={(e) => e.key === "Enter" && toggleExpand(alert.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="alert-meta-col">
                    <div className="alert-tags-row">
                      <span className={`alert-badge ${style.badgeClass}`}>
                        {style.tag}
                      </span>
                      <span className="alert-event-name">{alert.event}</span>
                    </div>

                    <p className="alert-headline">{alert.headline}</p>

                    <div className="alert-time-row">
                      {alert.effective && (
                        <span>
                          From: {formatLocalTime(alert.effective, timezone, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                        </span>
                      )}
                      {alert.expires && (
                        <span>
                          {" "}• Until: {formatLocalTime(alert.expires, timezone, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                  </div>

                  <button className="expand-chevron" aria-label={isExpanded ? "Collapse alert details" : "Expand alert details"}>
                    {isExpanded ? "▲" : "▼"}
                  </button>
                </div>

                {isExpanded && (
                  <div className="alert-body">
                    {alert.areaDesc && (
                      <div className="alert-area">
                        <strong>Affected Territory:</strong> {alert.areaDesc}
                      </div>
                    )}

                    {alert.instruction && (
                      <div className="alert-instruction">
                        <strong>Official Safety Instructions:</strong>
                        <p>{alert.instruction}</p>
                      </div>
                    )}

                    {alert.description && (
                      <div className="alert-desc-full">
                        <strong>Official Bulletin Text:</strong>
                        <p>{alert.description}</p>
                      </div>
                    )}

                    <div className="alert-issuer">Issued by: {alert.senderName}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="alerts-empty-state">
          <p className="alerts-message">
            {message || "No active severe weather warnings reported by meteorological authorities for this location."}
          </p>
          {!supported && authority && (
            <p className="alerts-fallback-note">
              To check regional weather advisories and local radar warnings, visit the official weather bureau:{" "}
              <a href={authority.url} target="_blank" rel="noopener noreferrer">
                {authority.name}
              </a>.
            </p>
          )}
        </div>
      )}
    </section>
  );
};
