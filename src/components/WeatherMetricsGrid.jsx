import React from "react";
import { formatLocalTime } from "../utils/formatters";
import { formatTemperature, formatPressure, formatVisibility } from "../utils/conversions";
import { WeatherIcon } from "./WeatherIcons";

export const WeatherMetricsGrid = ({ weather, unit = "metric" }) => {
  if (!weather || !weather.current) return null;

  const { current, location } = weather;

  // Calculate day progress percentage if sunrise and sunset are known
  let daylightPercent = 50;
  if (current.sunrise && current.sunset) {
    const riseTime = new Date(current.sunrise).getTime();
    const setTime = new Date(current.sunset).getTime();
    const nowTime = Date.now();
    if (setTime > riseTime) {
      daylightPercent = Math.max(0, Math.min(100, ((nowTime - riseTime) / (setTime - riseTime)) * 100));
    }
  }

  const sunriseFormatted = current.sunrise
    ? formatLocalTime(current.sunrise, location.timezone, { hour: "numeric", minute: "2-digit", hour12: true })
    : "--";
  const sunsetFormatted = current.sunset
    ? formatLocalTime(current.sunset, location.timezone, { hour: "numeric", minute: "2-digit", hour12: true })
    : "--";

  const diffTemp = current.feelsLike !== null && current.temp !== null ? current.feelsLike - current.temp : 0;
  let feelsLikeNote = "Similar to actual temperature";
  if (diffTemp >= 2) feelsLikeNote = "Humidity makes it feel noticeably warmer";
  else if (diffTemp <= -2) feelsLikeNote = "Wind chill makes it feel colder";

  return (
    <div className="metrics-subgrid" aria-label="Detailed Telemetry Cards">
      {/* Sun Cycle Card */}
      <div className="glass-card metric-subcard">
        <div className="metric-header-row">
          <WeatherIcon name="sunrise" size={18} />
          <span className="subcard-title">Sun Cycle</span>
        </div>

        <div className="sun-cycle-track">
          <div className="sun-orbit">
            <div
              className="sun-point"
              style={{
                left: `${daylightPercent}%`
              }}
              title={`Sun progress: ${Math.round(daylightPercent)}%`}
            />
          </div>
        </div>

        <div className="sun-times-row">
          <div className="sun-time-block">
            <span className="sun-label">Sunrise</span>
            <span className="sun-val">{sunriseFormatted}</span>
          </div>
          <div className="sun-time-block text-right">
            <span className="sun-label">Sunset</span>
            <span className="sun-val">{sunsetFormatted}</span>
          </div>
        </div>
      </div>

      {/* Feels Like Card */}
      <div className="glass-card metric-subcard">
        <div className="metric-header-row">
          <WeatherIcon name="thermometer" size={18} />
          <span className="subcard-title">Thermal Comfort</span>
        </div>
        <div className="subcard-main-val">
          {formatTemperature(current.feelsLike, unit)}
        </div>
        <p className="subcard-note">{feelsLikeNote}</p>
      </div>

      {/* Barometric Pressure Card */}
      <div className="glass-card metric-subcard">
        <div className="metric-header-row">
          <WeatherIcon name="gauge" size={18} />
          <span className="subcard-title">Pressure</span>
        </div>
        <div className="subcard-main-val">
          {formatPressure(current.pressure, unit)}
        </div>
        <p className="subcard-note">
          {current.pressure && current.pressure > 1013 ? "High pressure system (stable)" : "Low pressure system"}
        </p>
      </div>

      {/* Visibility & Wind Card */}
      <div className="glass-card metric-subcard">
        <div className="metric-header-row">
          <WeatherIcon name="eye" size={18} />
          <span className="subcard-title">Atmospheric Clarity</span>
        </div>
        <div className="subcard-main-val">
          {formatVisibility(current.visibility, unit)}
        </div>
        <p className="subcard-note">
          {current.visibility && current.visibility >= 10000 ? "Clear horizon visibility" : "Haze or mist present"}
        </p>
      </div>
    </div>
  );
};
