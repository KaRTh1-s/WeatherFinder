/**
 * Maps WMO weather codes and OpenWeather condition descriptions to canonical condition keys,
 * display titles, iconography, and atmospheric effects.
 */

export const getWeatherCondition = (wmoCode, isDay = 1, owmIcon = null, owmMain = null) => {
  // If WMO code is supplied
  if (wmoCode !== null && wmoCode !== undefined) {
    const code = Number(wmoCode);
    if (code === 0) {
      return {
        key: isDay ? "clear-day" : "clear-night",
        label: isDay ? "Clear Sky" : "Clear Night",
        atmosphere: isDay ? "clear-day" : "clear-night",
        icon: isDay ? "sun" : "moon"
      };
    }
    if (code === 1) {
      return {
        key: isDay ? "mostly-clear-day" : "mostly-clear-night",
        label: isDay ? "Mainly Clear" : "Mostly Clear Night",
        atmosphere: isDay ? "clear-day" : "clear-night",
        icon: isDay ? "sun" : "moon"
      };
    }
    if (code === 2) {
      return {
        key: isDay ? "partly-cloudy-day" : "partly-cloudy-night",
        label: "Partly Cloudy",
        atmosphere: "cloudy",
        icon: isDay ? "cloud-sun" : "cloud-moon"
      };
    }
    if (code === 3) {
      return {
        key: "overcast",
        label: "Overcast",
        atmosphere: "cloudy",
        icon: "cloud"
      };
    }
    if (code === 45 || code === 48) {
      return {
        key: "fog",
        label: "Fog & Mist",
        atmosphere: "fog",
        icon: "cloud-fog"
      };
    }
    if (code >= 51 && code <= 57) {
      return {
        key: "drizzle",
        label: "Drizzle",
        atmosphere: "rain",
        icon: "cloud-drizzle"
      };
    }
    if (code >= 61 && code <= 65) {
      const isHeavy = code === 65;
      return {
        key: isHeavy ? "heavy-rain" : "rain",
        label: isHeavy ? "Heavy Rain" : "Rain",
        atmosphere: "rain",
        icon: isHeavy ? "cloud-lightning-rain" : "cloud-rain"
      };
    }
    if (code === 66 || code === 67) {
      return {
        key: "freezing-rain",
        label: "Freezing Rain",
        atmosphere: "snow",
        icon: "cloud-snow"
      };
    }
    if (code >= 71 && code <= 77) {
      return {
        key: "snow",
        label: code === 75 ? "Heavy Snow" : "Snowfall",
        atmosphere: "snow",
        icon: "snowflake"
      };
    }
    if (code >= 80 && code <= 82) {
      return {
        key: "rain-showers",
        label: "Rain Showers",
        atmosphere: "rain",
        icon: "cloud-rain"
      };
    }
    if (code === 85 || code === 86) {
      return {
        key: "snow-showers",
        label: "Snow Showers",
        atmosphere: "snow",
        icon: "snowflake"
      };
    }
    if (code === 95) {
      return {
        key: "thunderstorm",
        label: "Thunderstorm",
        atmosphere: "thunderstorm",
        icon: "zap"
      };
    }
    if (code === 96 || code === 99) {
      return {
        key: "severe-thunderstorm",
        label: "Severe Thunderstorm",
        atmosphere: "thunderstorm",
        icon: "zap"
      };
    }
  }

  // Fallback from OpenWeather icon / main
  if (owmIcon) {
    const isNight = owmIcon.endsWith("n");
    if (owmIcon.startsWith("01")) {
      return {
        key: isNight ? "clear-night" : "clear-day",
        label: isNight ? "Clear Night" : "Clear Sky",
        atmosphere: isNight ? "clear-night" : "clear-day",
        icon: isNight ? "moon" : "sun"
      };
    }
    if (owmIcon.startsWith("02")) {
      return {
        key: isNight ? "partly-cloudy-night" : "partly-cloudy-day",
        label: "Few Clouds",
        atmosphere: "cloudy",
        icon: isNight ? "cloud-moon" : "cloud-sun"
      };
    }
    if (owmIcon.startsWith("03") || owmIcon.startsWith("04")) {
      return {
        key: "overcast",
        label: "Broken Clouds",
        atmosphere: "cloudy",
        icon: "cloud"
      };
    }
    if (owmIcon.startsWith("09") || owmIcon.startsWith("10")) {
      return {
        key: "rain",
        label: "Rain",
        atmosphere: "rain",
        icon: "cloud-rain"
      };
    }
    if (owmIcon.startsWith("11")) {
      return {
        key: "thunderstorm",
        label: "Thunderstorm",
        atmosphere: "thunderstorm",
        icon: "zap"
      };
    }
    if (owmIcon.startsWith("13")) {
      return {
        key: "snow",
        label: "Snow",
        atmosphere: "snow",
        icon: "snowflake"
      };
    }
    if (owmIcon.startsWith("50")) {
      return {
        key: "fog",
        label: "Mist & Fog",
        atmosphere: "fog",
        icon: "cloud-fog"
      };
    }
  }

  // Default fallback
  return {
    key: isDay ? "clear-day" : "clear-night",
    label: owmMain || "Clear Sky",
    atmosphere: isDay ? "clear-day" : "clear-night",
    icon: isDay ? "sun" : "moon"
  };
};
