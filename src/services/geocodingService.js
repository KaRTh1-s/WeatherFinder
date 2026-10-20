/**
 * Geocoding Service for city search auto-suggestions and reverse geocoding from coordinates.
 */

const searchCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export const searchCities = async (query, signal) => {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim().toLowerCase();
  const cached = searchCache.get(cleanQuery);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=8&language=en&format=json`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error("Geocoding service error");
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      searchCache.set(cleanQuery, { timestamp: Date.now(), data: [] });
      return [];
    }

    const mapped = data.results.map((item) => ({
      id: `${item.latitude}_${item.longitude}_${item.id}`,
      name: item.name,
      admin1: item.admin1 || "",
      country: item.country || "",
      countryCode: item.country_code || "",
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || "UTC",
      population: item.population || null
    }));

    searchCache.set(cleanQuery, { timestamp: Date.now(), data: mapped });
    return mapped;
  } catch (err) {
    if (err.name === "AbortError") return [];
    console.error("Geocoding search failed:", err);
    return [];
  }
};

export const reverseGeocode = async (latitude, longitude, apiKey) => {
  // If OpenWeather API key is provided, try OpenWeather reverse geocoding first
  if (apiKey) {
    try {
      const owmUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
      const res = await fetch(owmUrl);
      if (res.ok) {
        const list = await res.json();
        if (list && list.length > 0) {
          return {
            name: list[0].name,
            admin1: list[0].state || "",
            country: list[0].country || "",
            latitude,
            longitude
          };
        }
      }
    } catch (e) {
      console.warn("OWM reverse geocode fallback:", e);
    }
  }

  // Fallback to BigDataCloud free client-side reverse geocode
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(bdcUrl);
    if (res.ok) {
      const data = await res.json();
      return {
        name: data.city || data.locality || data.principalSubdivision || "Current Location",
        admin1: data.principalSubdivision || "",
        country: data.countryName || "",
        latitude,
        longitude
      };
    }
  } catch (e) {
    console.warn("BigDataCloud reverse geocode fallback:", e);
  }

  return {
    name: "Current Location",
    admin1: "",
    country: "",
    latitude,
    longitude
  };
};
