import React from "react";

export const WeatherIcon = ({ name, size = 24, className = "" }) => {
  const s = size;
  switch (name) {
    case "sun":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="5" fill="#facc15" stroke="#f59e0b" />
          <line x1="12" y1="1" x2="12" y2="3" stroke="#f59e0b" />
          <line x1="12" y1="21" x2="12" y2="23" stroke="#f59e0b" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#f59e0b" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#f59e0b" />
          <line x1="1" y1="12" x2="3" y2="12" stroke="#f59e0b" />
          <line x1="21" y1="12" x2="23" y2="12" stroke="#f59e0b" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="#f59e0b" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="#f59e0b" />
        </svg>
      );
    case "moon":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#93c5fd" stroke="#60a5fa" />
        </svg>
      );
    case "cloud-sun":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M4.93 19.07l1.41-1.41" stroke="#f59e0b" />
          <path d="M17.5 19H9a5 5 0 0 1-1-9.9 6 6 0 0 1 11.3 1.9A4.5 4.5 0 0 1 17.5 19z" fill="#94a3b8" fillOpacity="0.3" stroke="#cbd5e1" />
        </svg>
      );
    case "cloud-moon":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M13 3a4 4 0 0 1 4 4 4 4 0 0 1-1.2 2.8" stroke="#93c5fd" />
          <path d="M17.5 19H9a5 5 0 0 1-1-9.9 6 6 0 0 1 11.3 1.9A4.5 4.5 0 0 1 17.5 19z" fill="#64748b" fillOpacity="0.4" stroke="#94a3b8" />
        </svg>
      );
    case "cloud":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#64748b" fillOpacity="0.3" stroke="#cbd5e1" />
        </svg>
      );
    case "cloud-rain":
    case "cloud-drizzle":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#38bdf8" fillOpacity="0.2" stroke="#38bdf8" />
          <line x1="8" y1="19" x2="8" y2="23" stroke="#0284c7" />
          <line x1="12" y1="19" x2="12" y2="23" stroke="#0284c7" />
          <line x1="16" y1="19" x2="16" y2="23" stroke="#0284c7" />
        </svg>
      );
    case "cloud-lightning-rain":
    case "zap":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" stroke="#94a3b8" />
          <polygon points="13 11 9 17 15 17 11 23" fill="#facc15" stroke="#eab308" />
        </svg>
      );
    case "snowflake":
    case "cloud-snow":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <line x1="12" y1="2" x2="12" y2="22" stroke="#bae6fd" />
          <line x1="12" y1="2" x2="14" y2="4" stroke="#bae6fd" />
          <line x1="12" y1="2" x2="10" y2="4" stroke="#bae6fd" />
          <line x1="12" y1="22" x2="14" y2="20" stroke="#bae6fd" />
          <line x1="12" y1="22" x2="10" y2="20" stroke="#bae6fd" />
          <line x1="3.34" y1="7" x2="20.66" y2="17" stroke="#bae6fd" />
          <line x1="3.34" y1="17" x2="20.66" y2="7" stroke="#bae6fd" />
        </svg>
      );
    case "cloud-fog":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 14h16" stroke="#94a3b8" />
          <path d="M4 18h16" stroke="#94a3b8" />
          <path d="M7 10h10a4 4 0 0 0-8-1.5" stroke="#cbd5e1" />
        </svg>
      );
    case "droplet":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#06b6d4" fillOpacity="0.25" stroke="#06b6d4" />
        </svg>
      );
    case "wind":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" stroke="#38bdf8" />
        </svg>
      );
    case "compass":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" stroke="#64748b" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#ef4444" stroke="#dc2626" />
        </svg>
      );
    case "eye":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#94a3b8" />
          <circle cx="12" cy="12" r="3" stroke="#38bdf8" />
        </svg>
      );
    case "gauge":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" stroke="#94a3b8" />
          <path d="M12 6v6l4 2" stroke="#06b6d4" />
        </svg>
      );
    case "thermometer":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke="#f97316" fill="#f97316" fillOpacity="0.2" />
        </svg>
      );
    case "alert-triangle":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#f59e0b" fill="#f59e0b" fillOpacity="0.15" />
          <line x1="12" y1="9" x2="12" y2="13" stroke="#f59e0b" />
          <line x1="12" y1="17" x2="12.01" y2="17" stroke="#f59e0b" />
        </svg>
      );
    case "sunrise":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2v6m-7-2l1.5 1.5M19 6l-1.5 1.5M2 18h20M6 18a6 6 0 0 1 12 0" stroke="#f59e0b" />
        </svg>
      );
    case "sunset":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 8V2m-7 8l1.5-1.5M19 10l-1.5-1.5M2 18h20M6 18a6 6 0 0 1 12 0" stroke="#f97316" />
        </svg>
      );
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" stroke="#94a3b8" />
        </svg>
      );
  }
};
