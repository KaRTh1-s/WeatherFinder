/**
 * Utility functions for weather metrics and unit conversions.
 */

export const celsiusToFahrenheit = (c) => {
  if (c === null || c === undefined || isNaN(c)) return null;
  return (c * 9) / 5 + 32;
};

export const fahrenheitToCelsius = (f) => {
  if (f === null || f === undefined || isNaN(f)) return null;
  return ((f - 32) * 5) / 9;
};

export const formatTemperature = (celsius, unit = "metric") => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return "--";
  const val = unit === "imperial" ? celsiusToFahrenheit(celsius) : celsius;
  return `${Math.round(val)}°${unit === "imperial" ? "F" : "C"}`;
};

export const formatWindSpeed = (speedMps, unit = "metric") => {
  if (speedMps === null || speedMps === undefined || isNaN(speedMps)) return "--";
  if (unit === "imperial") {
    // 1 m/s = 2.23694 mph
    const mph = speedMps * 2.23694;
    return `${Math.round(mph)} mph`;
  }
  // Metric: km/h
  const kmh = speedMps * 3.6;
  return `${Math.round(kmh)} km/h`;
};

export const formatPressure = (hPa, unit = "metric") => {
  if (!hPa && hPa !== 0) return "--";
  if (unit === "imperial") {
    const inHg = hPa * 0.02953;
    return `${inHg.toFixed(2)} inHg`;
  }
  return `${Math.round(hPa)} hPa`;
};

export const formatVisibility = (meters, unit = "metric") => {
  if (meters === null || meters === undefined || isNaN(meters)) return "--";
  if (unit === "imperial") {
    const miles = meters / 1609.344;
    return `${miles.toFixed(1)} mi`;
  }
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
};

export const formatPrecipitation = (mm, unit = "metric") => {
  if (mm === null || mm === undefined || isNaN(mm)) return "--";
  if (unit === "imperial") {
    const inches = mm / 25.4;
    return `${inches.toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
};

export const getWindDirection = (deg) => {
  if (deg === null || deg === undefined || isNaN(deg)) return "";
  const directions = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW"
  ];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
};
