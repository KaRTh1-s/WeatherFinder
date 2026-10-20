/**
 * Air Quality Service: Retrieves US AQI, European AQI, PM2.5, PM10, Ozone, and UV index.
 */

const aqiCache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 mins

export const fetchAirQuality = async (latitude, longitude, signal) => {
  const cacheKey = `${latitude.toFixed(3)}_${longitude.toFixed(3)}`;
  const cached = aqiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,us_aqi,pm10,pm2_5,ozone,uv_index&timezone=auto`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`Air quality API status: ${res.status}`);

    const data = await res.json();
    const curr = data.current || {};

    const result = {
      available: true,
      time: curr.time || new Date().toISOString(),
      usAqi: curr.us_aqi ?? null,
      europeanAqi: curr.european_aqi ?? null,
      pm25: curr.pm2_5 !== undefined ? Math.round(curr.pm2_5 * 10) / 10 : null,
      pm10: curr.pm10 !== undefined ? Math.round(curr.pm10 * 10) / 10 : null,
      ozone: curr.ozone !== undefined ? Math.round(curr.ozone * 10) / 10 : null,
      uvIndex: curr.uv_index ?? null,
      source: "Open-Meteo Air Quality"
    };

    aqiCache.set(cacheKey, { timestamp: Date.now(), data: result });
    return result;
  } catch (err) {
    if (err.name === "AbortError") throw err;
    console.warn("Air quality fetch failed:", err);
    return {
      available: false,
      reason: "Air quality data currently unavailable for this coordinates.",
      usAqi: null,
      europeanAqi: null,
      pm25: null,
      pm10: null,
      ozone: null,
      uvIndex: null
    };
  }
};
