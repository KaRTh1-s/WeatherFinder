import React from "react";
import { formatLocalTime } from "../utils/formatters";
import {
  formatTemperature,
  formatWindSpeed,
  formatVisibility,
  formatPrecipitation,
  getWindDirection
} from "../utils/conversions";
import { WeatherIcon } from "./WeatherIcons";

export const CurrentHero = ({
  weather,
  unit = "metric",
  isFavorite = false,
  onToggleFavorite,
  onRefresh,
  refreshing = false
}) => {
  if (!weather || !weather.current) return null;

  const { location, current, isStale, lastUpdated } = weather;
  const windDir = getWindDirection(current.windDeg);

  const formattedDate = formatLocalTime(new Date(), location.timezone, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  const formattedTime = formatLocalTime(new Date(), location.timezone, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  return (
    <section className="glass-card current-hero" aria-label="Current Weather Conditions">
      {isStale && (
        <div className="stale-badge" role="status">
          ⚠️ Showing cached weather data. Reconnecting to satellite feed...
        </div>
      )}

      <div className="hero-top">
        <div className="location-block">
          <div className="location-name-row">
            <h2 className="location-title">
              {location.name}
              {location.admin1 ? `, ${location.admin1}` : ""}
            </h2>
            {location.country && <span className="country-badge">{location.country}</span>}
            <button
              onClick={onToggleFavorite}
              className={`favorite-btn ${isFavorite ? "active" : ""}`}
              aria-label={isFavorite ? "Remove from favorite cities" : "Add to favorite cities"}
              title={isFavorite ? "Remove from favorites" : "Save as favorite city"}
            >
              ★
            </button>
          </div>
          <p className="local-time">
            <span>{formattedDate}</span> • <span>{formattedTime} local time</span>
          </p>
        </div>

        <button
          onClick={onRefresh}
          className={`refresh-btn ${refreshing ? "spin" : ""}`}
          aria-label="Refresh live weather"
          title="Refresh weather"
          disabled={refreshing}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>

      <div className="hero-main">
        <div className="temp-display">
          <span className="big-temp">{formatTemperature(current.temp, unit)}</span>
          <div className="temp-meta">
            <span className="feels-like">
              Feels like <strong>{formatTemperature(current.feelsLike, unit)}</strong>
            </span>
            <div className="high-low-pill">
              <span className="high">▲ {formatTemperature(current.todayHigh, unit)}</span>
              <span className="divider">/</span>
              <span className="low">▼ {formatTemperature(current.todayLow, unit)}</span>
            </div>
          </div>
        </div>

        <div className="condition-display">
          <div className="condition-icon-orb">
            <WeatherIcon name={current.condition.icon} size={64} className="hero-icon" />
          </div>
          <span className="condition-label">{current.condition.label}</span>
          {current.description && current.description !== current.condition.label && (
            <span className="condition-sub">{current.description}</span>
          )}
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-cell">
          <div className="metric-label">
            <WeatherIcon name="droplet" size={16} />
            <span>Humidity</span>
          </div>
          <span className="metric-val">{current.humidity !== null ? `${current.humidity}%` : "--"}</span>
        </div>

        <div className="metric-cell">
          <div className="metric-label">
            <WeatherIcon name="wind" size={16} />
            <span>Wind</span>
          </div>
          <span className="metric-val">
            {formatWindSpeed(current.windSpeed, unit)}
            {windDir ? ` (${windDir})` : ""}
          </span>
        </div>

        <div className="metric-cell">
          <div className="metric-label">
            <WeatherIcon name="eye" size={16} />
            <span>Visibility</span>
          </div>
          <span className="metric-val">{formatVisibility(current.visibility, unit)}</span>
        </div>

        <div className="metric-cell">
          <div className="metric-label">
            <WeatherIcon name="cloud-rain" size={16} />
            <span>Precipitation</span>
          </div>
          <span className="metric-val">{formatPrecipitation(current.precipitation, unit)}</span>
        </div>
      </div>

      {lastUpdated && (
        <div className="last-sync">
          Telemetry updated {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </section>
  );
};
