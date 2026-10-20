import React from "react";
import { formatDayName } from "../utils/formatters";
import { formatTemperature } from "../utils/conversions";
import { WeatherIcon } from "./WeatherIcons";

export const DailyForecast = ({ daily = [], unit = "metric", timezone = "UTC" }) => {
  if (!daily || daily.length === 0) return null;

  // Find min and max temperature across all 7 days for the visual range bar
  const validMins = daily.map((d) => d.minTemp).filter((v) => v !== null && !isNaN(v));
  const validMaxs = daily.map((d) => d.maxTemp).filter((v) => v !== null && !isNaN(v));
  const weekMin = validMins.length ? Math.min(...validMins) : 0;
  const weekMax = validMaxs.length ? Math.max(...validMaxs) : 40;
  const totalRange = weekMax - weekMin === 0 ? 1 : weekMax - weekMin;

  return (
    <section className="glass-card daily-card" aria-label="7-Day Weather Forecast">
      <div className="section-header-row">
        <div>
          <h3 className="section-title">7-Day Forecast</h3>
          <span className="section-subtitle">Weekly Outlook</span>
        </div>
      </div>

      <div className="daily-list">
        {daily.map((item, idx) => {
          const isToday = idx === 0;
          const dayLabel = isToday ? "Today" : formatDayName(item.date, timezone);

          // Calculate visual range bar positions
          const barLeftPercent = Math.max(0, Math.min(100, ((item.minTemp - weekMin) / totalRange) * 100));
          const barRightPercent = Math.max(0, Math.min(100, ((item.maxTemp - weekMin) / totalRange) * 100));
          const barWidthPercent = Math.max(8, barRightPercent - barLeftPercent);

          return (
            <div key={item.date || idx} className={`daily-row ${isToday ? "is-today" : ""}`}>
              <div className="daily-day-col">
                <span className="daily-day-name">{dayLabel}</span>
              </div>

              <div className="daily-condition-col">
                <WeatherIcon name={item.condition.icon} size={22} />
                <span className="daily-condition-label">{item.condition.label}</span>
                {item.precipProb > 15 && (
                  <span className="daily-precip-badge">
                    <WeatherIcon name="droplet" size={10} />
                    {item.precipProb}%
                  </span>
                )}
              </div>

              <div className="daily-temps-col">
                <span className="temp-min">{formatTemperature(item.minTemp, unit)}</span>

                <div className="range-bar-track" aria-hidden="true">
                  <div
                    className="range-bar-fill"
                    style={{
                      left: `${barLeftPercent}%`,
                      width: `${barWidthPercent}%`
                    }}
                  />
                </div>

                <span className="temp-max">{formatTemperature(item.maxTemp, unit)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
