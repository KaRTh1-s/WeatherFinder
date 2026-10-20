import React, { useRef } from "react";
import { formatHourTime } from "../utils/formatters";
import { formatTemperature } from "../utils/conversions";
import { WeatherIcon } from "./WeatherIcons";

export const HourlyForecast = ({ hourly = [], unit = "metric", timezone = "UTC" }) => {
  const scrollRef = useRef(null);

  if (!hourly || hourly.length === 0) return null;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="glass-card hourly-card" aria-label="Hourly Forecast">
      <div className="section-header-row">
        <div>
          <h3 className="section-title">Hourly Forecast</h3>
          <span className="section-subtitle">Next 24 Hours</span>
        </div>

        <div className="scroll-controls">
          <button
            onClick={() => handleScroll("left")}
            className="scroll-btn"
            aria-label="Scroll hourly forecast left"
          >
            ‹
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="scroll-btn"
            aria-label="Scroll hourly forecast right"
          >
            ›
          </button>
        </div>
      </div>

      <div className="hourly-scroll-container" ref={scrollRef} tabIndex="0" role="region" aria-label="Horizontally scrollable hourly list">
        {hourly.slice(0, 24).map((item, idx) => {
          const isNow = idx === 0;
          return (
            <div key={item.time || idx} className={`hourly-item ${isNow ? "is-now" : ""}`}>
              <span className="hourly-time">
                {isNow ? "Now" : formatHourTime(item.time, timezone)}
              </span>

              <div className="hourly-icon-wrap">
                <WeatherIcon name={item.condition.icon} size={28} />
              </div>

              <span className="hourly-temp">{formatTemperature(item.temp, unit)}</span>

              {item.precipProb > 0 ? (
                <div className="hourly-precip">
                  <WeatherIcon name="droplet" size={11} />
                  <span>{item.precipProb}%</span>
                </div>
              ) : (
                <div className="hourly-precip empty">
                  <span>-</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
