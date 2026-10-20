/**
 * Weather Service: Coordinates live weather data from OpenWeather and Open-Meteo.
 * Features in-memory caching, request cancellation, stale fallback, and unit consistency.
 */

import { getWeatherCondition } from "../utils/conditionMapper";

const weatherCache = new Map();
const CACHE_TTL = 8 * 60 * 1000; // 8 minutes

export const fetchComprehensiveWeather = async ({
  latitude,
  longitude,
  cityName,
  countryCode,
  admin1,
  timezone = "auto",
  apiKey = process.env.REACT_APP_WEATHER_API_KEY,
  signal
}) => {
  const cacheKey = `${latitude.toFixed(3)}_${longitude.toFixed(3)}`;
  const cached = weatherCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { ...cached.data, isCached: true };
  }

  // 1. Fetch Open-Meteo forecast (Hourly + Daily + Current)
  const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_probability_max,precipitation_sum&timezone=auto`;

  let meteoData = null;
  try {
    const res = await fetch(openMeteoUrl, { signal });
    if (res.ok) {
      meteoData = await res.json();
    }
  } catch (err) {
    if (err.name === "AbortError") throw err;
    console.warn("Open-Meteo fetch failed:", err);
  }

  // 2. Fetch OpenWeather current if API key exists
  let owmData = null;
  if (apiKey) {
    try {
      const owmUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const res = await fetch(owmUrl, { signal });
      if (res.ok) {
        owmData = await res.json();
      }
    } catch (err) {
      if (err.name === "AbortError") throw err;
      console.warn("OpenWeather fetch failed:", err);
    }
  }

  if (!meteoData && !owmData) {
    // If cached exists even if expired, return with stale flag
    if (cached) {
      return { ...cached.data, isStale: true };
    }
    throw new Error("Unable to retrieve weather data from providers. Please check your internet connection.");
  }

  // Normalize Current Data
  const resolvedTimezone = meteoData?.timezone || "UTC";
  const currMeteo = meteoData?.current || {};
  const isDay = currMeteo.is_day !== undefined
    ? currMeteo.is_day
    : owmData?.weather?.[0]?.icon ? (owmData.weather[0].icon.endsWith("d") ? 1 : 0) : 1;

  const wmoCode = currMeteo.weather_code;
  const owmIcon = owmData?.weather?.[0]?.icon || null;
  const owmMain = owmData?.weather?.[0]?.main || null;
  const condition = getWeatherCondition(wmoCode, isDay, owmIcon, owmMain);

  // Current temperature (prefer OpenWeather if available, or Open-Meteo)
  const currentTemp = owmData?.main?.temp ?? currMeteo.temperature_2m ?? null;
  const feelsLike = owmData?.main?.feels_like ?? currMeteo.apparent_temperature ?? currentTemp;
  const humidity = owmData?.main?.humidity ?? currMeteo.relative_humidity_2m ?? null;
  // Wind speed normalized to m/s
  const windMps = owmData?.wind?.speed ?? (currMeteo.wind_speed_10m ? currMeteo.wind_speed_10m / 3.6 : null);
  const windDirection = owmData?.wind?.deg ?? currMeteo.wind_direction_10m ?? null;
  const pressure = owmData?.main?.pressure ?? currMeteo.surface_pressure ?? null;
  const visibilityMeters = owmData?.visibility ?? null;
  const precipitationMm = currMeteo.precipitation ?? (owmData?.rain ? owmData.rain["1h"] : 0);

  // Daily high / low
  const daily = meteoData?.daily || {};
  const todayHigh = daily.temperature_2m_max?.[0] ?? owmData?.main?.temp_max ?? null;
  const todayLow = daily.temperature_2m_min?.[0] ?? owmData?.main?.temp_min ?? null;
  const todayUvMax = daily.uv_index_max?.[0] ?? null;
  const todayPrecipProb = daily.precipitation_probability_max?.[0] ?? null;

  // Hourly Forecast (filter from current hour up to 24-36 hours)
  const hourly = meteoData?.hourly || {};
  const hourlyList = [];
  if (hourly.time && hourly.time.length > 0) {
    const nowIso = currMeteo.time || new Date().toISOString();
    let startIndex = hourly.time.findIndex((t) => t >= nowIso.slice(0, 13));
    if (startIndex < 0) startIndex = 0;

    for (let i = startIndex; i < Math.min(startIndex + 24, hourly.time.length); i++) {
      const hCode = hourly.weather_code?.[i];
      const hHour = hourly.time[i];
      const hourNum = new Date(hHour).getHours();
      const hIsDay = hourNum >= 6 && hourNum < 19 ? 1 : 0;
      const hCond = getWeatherCondition(hCode, hIsDay);

      hourlyList.push({
        time: hHour,
        temp: hourly.temperature_2m?.[i] ?? null,
        feelsLike: hourly.apparent_temperature?.[i] ?? null,
        precipProb: hourly.precipitation_probability?.[i] ?? 0,
        humidity: hourly.relative_humidity_2m?.[i] ?? null,
        windSpeed: hourly.wind_speed_10m?.[i] ? hourly.wind_speed_10m[i] / 3.6 : 0,
        condition: hCond,
        uvIndex: hourly.uv_index?.[i] ?? null
      });
    }
  }

  // 7-Day Forecast
  const dailyList = [];
  if (daily.time && daily.time.length > 0) {
    for (let i = 0; i < Math.min(7, daily.time.length); i++) {
      const dCode = daily.weather_code?.[i];
      const dCond = getWeatherCondition(dCode, 1);

      dailyList.push({
        date: daily.time[i],
        maxTemp: daily.temperature_2m_max?.[i] ?? null,
        minTemp: daily.temperature_2m_min?.[i] ?? null,
        precipProb: daily.precipitation_probability_max?.[i] ?? 0,
        precipSum: daily.precipitation_sum?.[i] ?? 0,
        uvMax: daily.uv_index_max?.[i] ?? null,
        condition: dCond,
        sunrise: daily.sunrise?.[i] ?? null,
        sunset: daily.sunset?.[i] ?? null
      });
    }
  }

  const result = {
    location: {
      name: cityName || owmData?.name || "Selected Location",
      admin1: admin1 || "",
      country: countryCode || owmData?.sys?.country || "",
      latitude,
      longitude,
      timezone: resolvedTimezone
    },
    current: {
      temp: currentTemp,
      feelsLike,
      humidity,
      windSpeed: windMps,
      windDeg: windDirection,
      pressure,
      visibility: visibilityMeters,
      precipitation: precipitationMm,
      todayHigh,
      todayLow,
      todayUvMax,
      todayPrecipProb,
      condition,
      isDay,
      sunrise: daily.sunrise?.[0] ?? (owmData?.sys?.sunrise ? new Date(owmData.sys.sunrise * 1000).toISOString() : null),
      sunset: daily.sunset?.[0] ?? (owmData?.sys?.sunset ? new Date(owmData.sys.sunset * 1000).toISOString() : null),
      description: owmData?.weather?.[0]?.description || condition.label,
      owmIcon: owmIcon
    },
    hourly: hourlyList,
    daily: dailyList,
    lastUpdated: new Date().toISOString(),
    isCached: false,
    isStale: false
  };

  weatherCache.set(cacheKey, { timestamp: Date.now(), data: result });
  return result;
};
