import React, { useState, useId } from "react";
import { formatHourTime } from "../utils/formatters";
import { celsiusToFahrenheit } from "../utils/conversions";
import { WeatherIcon } from "./WeatherIcons";

export const InteractiveChart = ({ hourly = [], unit = "metric", timezone = "UTC" }) => {
  const [activeTab, setActiveTab] = useState("temp"); // "temp" | "precip" | "wind"
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const chartId = useId();

  if (!hourly || hourly.length === 0) {
    return (
      <div className="chart-empty-state">
        <p>Hourly forecast chart currently unavailable for this location.</p>
      </div>
    );
  }

  // Take first 24 hours
  const points = hourly.slice(0, 24);

  // Extract series values based on active tab
  const getPointValue = (item) => {
    if (activeTab === "temp") {
      const c = item.temp;
      if (c === null || c === undefined) return 0;
      return unit === "imperial" ? Math.round(celsiusToFahrenheit(c)) : Math.round(c);
    }
    if (activeTab === "precip") {
      return item.precipProb ?? 0;
    }
    if (activeTab === "wind") {
      const mps = item.windSpeed ?? 0;
      return unit === "imperial" ? Math.round(mps * 2.23694) : Math.round(mps * 3.6);
    }
    return 0;
  };

  const values = points.map(getPointValue);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const width = 800;
  const height = 240;
  const paddingX = 40;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  const coords = points.map((p, i) => {
    const x = paddingX + (i / (points.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((values[i] - minVal) / range) * chartHeight;
    return { x, y, value: values[i], item: p };
  });

  // Generate smooth SVG cubic Bézier path
  const generatePath = () => {
    if (coords.length === 0) return "";
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = generatePath();
  const areaPath = coords.length > 0
    ? `${linePath} L ${coords[coords.length - 1].x} ${height - paddingBottom} L ${coords[0].x} ${height - paddingBottom} Z`
    : "";

  const activeColor = activeTab === "temp" ? "#38bdf8" : activeTab === "precip" ? "#06b6d4" : "#a78bfa";
  const activeUnit = activeTab === "temp" ? `°${unit === "imperial" ? "F" : "C"}` : activeTab === "precip" ? "%" : unit === "imperial" ? "mph" : "km/h";

  const hoveredPoint = hoveredIndex !== null && coords[hoveredIndex] ? coords[hoveredIndex] : null;

  return (
    <div className="glass-card chart-container">
      <div className="chart-header">
        <div className="chart-titles">
          <h3 className="section-title">Hourly Trend</h3>
          <span className="chart-subtitle">Next 24 Hours Progression</span>
        </div>

        <div className="chart-tabs" role="tablist" aria-label="Weather metrics chart tabs">
          <button
            role="tab"
            aria-selected={activeTab === "temp"}
            className={`tab-btn ${activeTab === "temp" ? "active" : ""}`}
            onClick={() => setActiveTab("temp")}
          >
            Temperature
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "precip"}
            className={`tab-btn ${activeTab === "precip" ? "active" : ""}`}
            onClick={() => setActiveTab("precip")}
          >
            Precipitation
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "wind"}
            className={`tab-btn ${activeTab === "wind" ? "active" : ""}`}
            onClick={() => setActiveTab("wind")}
          >
            Wind Speed
          </button>
        </div>
      </div>

      <div className="chart-svg-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="interactive-svg"
          preserveAspectRatio="none"
          aria-label={`Interactive weather chart displaying 24 hour ${activeTab}`}
        >
          <defs>
            <linearGradient id={`grad-${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={activeColor} stopOpacity="0.38" />
              <stop offset="100%" stopColor={activeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingTop}
            x2={width - paddingX}
            y2={paddingTop}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={paddingTop + chartHeight / 2}
            x2={width - paddingX}
            y2={paddingTop + chartHeight / 2}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingBottom}
            x2={width - paddingX}
            y2={height - paddingBottom}
            stroke="rgba(255,255,255,0.14)"
          />

          {/* Fill Area & Stroke */}
          <path d={areaPath} fill={`url(#grad-${chartId})`} />
          <path d={linePath} fill="none" stroke={activeColor} strokeWidth="3" strokeLinecap="round" />

          {/* Time markers every 4 hours */}
          {coords.map((c, i) => {
            if (i % 4 === 0 || i === coords.length - 1) {
              const timeLabel = formatHourTime(c.item.time, timezone);
              return (
                <g key={`time-${i}`}>
                  <line
                    x1={c.x}
                    y1={height - paddingBottom}
                    x2={c.x}
                    y2={height - paddingBottom + 5}
                    stroke="rgba(255,255,255,0.2)"
                  />
                  <text
                    x={c.x}
                    y={height - paddingBottom + 20}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.55)"
                    fontSize="11"
                  >
                    {timeLabel}
                  </text>
                </g>
              );
            }
            return null;
          })}

          {/* Hover crosshair & point */}
          {hoveredPoint && (
            <g className="hover-elements">
              <line
                x1={hoveredPoint.x}
                y1={paddingTop}
                x2={hoveredPoint.x}
                y2={height - paddingBottom}
                stroke={activeColor}
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="6"
                fill="#0f172a"
                stroke={activeColor}
                strokeWidth="3"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="11"
                fill={activeColor}
                fillOpacity="0.25"
              />
            </g>
          )}

          {/* Interactive touch/mouse columns */}
          {coords.map((c, i) => {
            const colWidth = chartWidth / coords.length;
            return (
              <rect
                key={`touch-${i}`}
                x={c.x - colWidth / 2}
                y={0}
                width={colWidth}
                height={height}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onTouchStart={() => setHoveredIndex(i)}
                style={{ cursor: "pointer" }}
              />
            );
          })}
        </svg>

        {/* Dynamic Tooltip */}
        {hoveredPoint && (
          <div
            className="chart-tooltip"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${hoveredPoint.y - 12}px`
            }}
          >
            <div className="tooltip-time">
              {formatHourTime(hoveredPoint.item.time, timezone)}
            </div>
            <div className="tooltip-val" style={{ color: activeColor }}>
              {hoveredPoint.value} {activeUnit}
            </div>
            <div className="tooltip-desc">
              <WeatherIcon name={hoveredPoint.item.condition?.icon || "cloud"} size={14} />
              <span>{hoveredPoint.item.condition?.label}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
