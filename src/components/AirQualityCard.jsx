import React, { useState } from "react";
import { getUsAqiCategory, getEuropeanAqiCategory, getUvCategory } from "../utils/formatters";
import { WeatherIcon } from "./WeatherIcons";

export const AirQualityCard = ({ airQuality, currentUv = null }) => {
  const [scaleMode, setScaleMode] = useState("us"); // "us" | "eu"

  if (!airQuality || (!airQuality.available && currentUv === null)) {
    return (
      <div className="glass-card aqi-card unavailable">
        <div className="section-header-row">
          <div>
            <h3 className="section-title">Environmental Conditions</h3>
            <span className="section-subtitle">Air Quality & UV Telemetry</span>
          </div>
        </div>
        <div className="aqi-empty-message">
          <p>Real-time atmospheric composition data is not currently reported for this coordinate station.</p>
        </div>
      </div>
    );
  }

  const usCat = getUsAqiCategory(airQuality.usAqi);
  const euCat = getEuropeanAqiCategory(airQuality.europeanAqi);
  const effectiveUv = airQuality.uvIndex ?? currentUv;
  const uvCat = getUvCategory(effectiveUv);

  const activeAqi = scaleMode === "us" ? usCat : euCat;

  // Percentage for progress ring (US AQI max 300 for visual gauge, EU max 100)
  const gaugePercent = scaleMode === "us"
    ? Math.min(100, ((activeAqi.aqi || 0) / 300) * 100)
    : Math.min(100, ((activeAqi.aqi || 0) / 100) * 100);

  return (
    <section className="glass-card aqi-card" aria-label="Air Quality and UV Index">
      <div className="section-header-row">
        <div>
          <h3 className="section-title">Air Quality & Atmosphere</h3>
          <span className="section-subtitle">Environmental Composition</span>
        </div>

        <div className="aqi-scale-toggle" role="group" aria-label="AQI Standard Selection">
          <button
            className={`scale-btn ${scaleMode === "us" ? "active" : ""}`}
            onClick={() => setScaleMode("us")}
            title="Standard US EPA Air Quality Index (0 - 500 scale)"
          >
            US AQI
          </button>
          <button
            className={`scale-btn ${scaleMode === "eu" ? "active" : ""}`}
            onClick={() => setScaleMode("eu")}
            title="European Air Quality Index (0 - 100+ scale)"
          >
            EU AQI
          </button>
        </div>
      </div>

      <div className="aqi-main-grid">
        {/* Main AQI Gauge */}
        <div className="aqi-gauge-panel">
          <div className="aqi-number-wrap">
            <span className="aqi-score" style={{ color: activeAqi.color }}>
              {activeAqi.aqi ?? "--"}
            </span>
            <span className="aqi-badge-pill" style={{ backgroundColor: `${activeAqi.color}22`, color: activeAqi.color, borderColor: `${activeAqi.color}55` }}>
              {activeAqi.label}
            </span>
          </div>

          <div className="aqi-meter-track">
            <div
              className="aqi-meter-fill"
              style={{
                width: `${gaugePercent}%`,
                backgroundColor: activeAqi.color
              }}
            />
          </div>

          <p className="aqi-explanation">
            <strong>Standard: {scaleMode === "us" ? "US EPA AQI" : "European EAQI"}</strong> — {activeAqi.description}
          </p>
        </div>

        {/* UV Index Panel */}
        <div className="uv-panel">
          <div className="uv-header-row">
            <div className="metric-label">
              <WeatherIcon name="sun" size={18} />
              <span>Solar UV Index</span>
            </div>
            <span className="uv-badge" style={{ backgroundColor: `${uvCat.color}22`, color: uvCat.color, borderColor: `${uvCat.color}55` }}>
              {uvCat.label}
            </span>
          </div>

          <div className="uv-score-row">
            <span className="uv-val" style={{ color: uvCat.color }}>
              {uvCat.uv !== undefined ? uvCat.uv : "--"}
            </span>
            <span className="uv-scale-max">/ 11+</span>
          </div>

          <p className="uv-advice">{uvCat.advice}</p>
        </div>
      </div>

      {/* Pollutant Breakdown Cards */}
      <div className="pollutants-grid">
        <div className="pollutant-cell">
          <span className="pollutant-name">PM2.5 Fine Particles</span>
          <span className="pollutant-val">
            {airQuality.pm25 !== null ? `${airQuality.pm25} µg/m³` : "--"}
          </span>
          <span className="pollutant-sub">Inhalable combustion particles</span>
        </div>

        <div className="pollutant-cell">
          <span className="pollutant-name">PM10 Coarse Particles</span>
          <span className="pollutant-val">
            {airQuality.pm10 !== null ? `${airQuality.pm10} µg/m³` : "--"}
          </span>
          <span className="pollutant-sub">Dust, pollen, mold spores</span>
        </div>

        <div className="pollutant-cell">
          <span className="pollutant-name">Ozone (O₃)</span>
          <span className="pollutant-val">
            {airQuality.ozone !== null ? `${airQuality.ozone} µg/m³` : "--"}
          </span>
          <span className="pollutant-sub">Ground-level photochemical smog</span>
        </div>
      </div>

      <div className="aqi-footer-attribution">
        Source: Open-Meteo Air Quality Model • General guidance for outdoor activity planning, not medical diagnosis.
      </div>
    </section>
  );
};
