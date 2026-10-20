/**
 * Data formatters for timezones, dates, air quality indices, and UV categories.
 */

export const formatLocalTime = (isoOrTimestamp, timezone = "UTC", options = {}) => {
  try {
    const date = typeof isoOrTimestamp === "number"
      ? new Date(isoOrTimestamp * 1000)
      : new Date(isoOrTimestamp);

    if (isNaN(date.getTime())) return "--";

    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone || "UTC",
      ...options
    }).format(date);
  } catch (e) {
    return "--";
  }
};

export const formatHourTime = (isoOrTimestamp, timezone = "UTC") => {
  return formatLocalTime(isoOrTimestamp, timezone, {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });
};

export const formatDayName = (isoOrTimestamp, timezone = "UTC") => {
  return formatLocalTime(isoOrTimestamp, timezone, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
};

/**
 * US Air Quality Index (AQI: 0 - 500)
 */
export const getUsAqiCategory = (val) => {
  if (val === null || val === undefined || isNaN(val)) {
    return { label: "Unavailable", color: "#94a3b8", description: "Data not reported for this station" };
  }
  const aqi = Math.round(val);
  if (aqi <= 50) {
    return {
      aqi,
      label: "Good",
      color: "#10b981", // green
      description: "Air quality is satisfactory, and air pollution poses little or no risk."
    };
  }
  if (aqi <= 100) {
    return {
      aqi,
      label: "Moderate",
      color: "#f59e0b", // yellow-amber
      description: "Air quality is acceptable. Some pollutants may affect highly sensitive individuals."
    };
  }
  if (aqi <= 150) {
    return {
      aqi,
      label: "Unhealthy for Sensitive Groups",
      color: "#f97316", // orange
      description: "Members of sensitive groups may experience health effects. General public is less likely affected."
    };
  }
  if (aqi <= 200) {
    return {
      aqi,
      label: "Unhealthy",
      color: "#ef4444", // red
      description: "Some members of the general public may experience health effects; sensitive members may experience more serious effects."
    };
  }
  if (aqi <= 300) {
    return {
      aqi,
      label: "Very Unhealthy",
      color: "#a855f7", // purple
      description: "Health alert: The risk of health effects is increased for everyone."
    };
  }
  return {
    aqi,
    label: "Hazardous",
    color: "#881337", // maroon
    description: "Health warning of emergency conditions: Everyone is more likely to be affected."
  };
};

/**
 * European Air Quality Index (EAQI: 0 - 100+)
 */
export const getEuropeanAqiCategory = (val) => {
  if (val === null || val === undefined || isNaN(val)) {
    return { label: "Unavailable", color: "#94a3b8", description: "Not available" };
  }
  const aqi = Math.round(val);
  if (aqi <= 20) {
    return {
      aqi,
      label: "Very Good",
      color: "#10b981",
      description: "Clean air conditions according to European standard thresholds."
    };
  }
  if (aqi <= 40) {
    return {
      aqi,
      label: "Good",
      color: "#34d399",
      description: "Air quality is good with minimal environmental impact."
    };
  }
  if (aqi <= 60) {
    return {
      aqi,
      label: "Medium",
      color: "#fbbf24",
      description: "Moderate air pollutant concentrations."
    };
  }
  if (aqi <= 80) {
    return {
      aqi,
      label: "Poor",
      color: "#f87171",
      description: "Elevated pollutant levels may cause discomfort to sensitive individuals."
    };
  }
  if (aqi <= 100) {
    return {
      aqi,
      label: "Very Poor",
      color: "#dc2626",
      description: "High particulate levels across common monitoring bands."
    };
  }
  return {
    aqi,
    label: "Extremely Poor",
    color: "#7f1d1d",
    description: "Very high concentrations exceeding European alert standards."
  };
};

/**
 * UV Index categories according to WHO standards
 */
export const getUvCategory = (val) => {
  if (val === null || val === undefined || isNaN(val)) {
    return { label: "Unavailable", level: "None", color: "#94a3b8", advice: "No UV data reported." };
  }
  const uv = Number(val);
  if (uv < 3) {
    return {
      uv: Math.round(uv * 10) / 10,
      label: "Low",
      color: "#10b981",
      advice: "Minimal sun protection required for normal exposure."
    };
  }
  if (uv < 6) {
    return {
      uv: Math.round(uv * 10) / 10,
      label: "Moderate",
      color: "#f59e0b",
      advice: "Seek shade during peak midday hours and wear protective sunglasses."
    };
  }
  if (uv < 8) {
    return {
      uv: Math.round(uv * 10) / 10,
      label: "High",
      color: "#f97316",
      advice: "Protection essential: Wear hat, sunglasses, and use broad-spectrum sunscreen."
    };
  }
  if (uv < 11) {
    return {
      uv: Math.round(uv * 10) / 10,
      label: "Very High",
      color: "#ef4444",
      advice: "Extra precautions needed: Avoid sun in the midday hours and stay hydrated."
    };
  }
  return {
    uv: Math.round(uv * 10) / 10,
    label: "Extreme",
    color: "#a855f7",
    advice: "Take all precautions: Unprotected skin can burn rapidly."
  };
};
