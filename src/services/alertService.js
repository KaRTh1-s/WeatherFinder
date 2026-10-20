/**
 * Severe Weather Alerts Service
 * Connects to live official meteorological alert feeds (such as US National Weather Service api.weather.gov)
 * and maps global regions to their respective national weather authorities for authentic coverage.
 */

const getOfficialAuthority = (countryCode, countryName) => {
  const code = (countryCode || "").toUpperCase();
  if (code === "US" || countryName?.toLowerCase() === "united states") {
    return {
      name: "National Weather Service (NOAA)",
      url: "https://www.weather.gov",
      hasLiveFeed: true
    };
  }
  if (code === "IN" || countryName?.toLowerCase() === "india") {
    return {
      name: "India Meteorological Department (IMD)",
      url: "https://mausam.imd.gov.in/",
      hasLiveFeed: false
    };
  }
  if (code === "GB" || countryName?.toLowerCase() === "united kingdom") {
    return {
      name: "Met Office (UK)",
      url: "https://www.metoffice.gov.uk/weather/warnings-and-advice/uk-warnings",
      hasLiveFeed: false
    };
  }
  if (["FR", "DE", "IT", "ES", "NL", "BE", "AT", "CH", "SE", "NO", "DK", "FI", "PL", "PT", "IE", "GR"].includes(code)) {
    return {
      name: "EUMETNET MeteoAlarm (Europe)",
      url: "https://meteoalarm.org/",
      hasLiveFeed: false
    };
  }
  if (code === "CA" || countryName?.toLowerCase() === "canada") {
    return {
      name: "Environment and Climate Change Canada",
      url: "https://weather.gc.ca/warnings/index_e.html",
      hasLiveFeed: false
    };
  }
  if (code === "AU" || countryName?.toLowerCase() === "australia") {
    return {
      name: "Bureau of Meteorology (BOM Australia)",
      url: "http://www.bom.gov.au/australia/warnings/index.shtml",
      hasLiveFeed: false
    };
  }
  if (code === "JP" || countryName?.toLowerCase() === "japan") {
    return {
      name: "Japan Meteorological Agency (JMA)",
      url: "https://www.jma.go.jp/bosai/warning/",
      hasLiveFeed: false
    };
  }

  return {
    name: "WMO Severe Weather Information Centre",
    url: "https://severeweather.wmo.int/",
    hasLiveFeed: false
  };
};

export const fetchWeatherAlerts = async (latitude, longitude, countryCode, countryName, signal) => {
  const authority = getOfficialAuthority(countryCode, countryName);

  // If in US territory or hasLiveFeed, query NWS
  if (authority.hasLiveFeed) {
    try {
      const url = `https://api.weather.gov/alerts/active?point=${latitude.toFixed(4)},${longitude.toFixed(4)}`;
      const res = await fetch(url, {
        signal,
        headers: {
          "User-Agent": "WeatherFinderApp/1.0 (contact@weatherfinder.app)",
          "Accept": "application/geo+json"
        }
      });

      if (!res.ok) {
        return {
          supported: true,
          alerts: [],
          authority,
          message: "No active warnings found for this location."
        };
      }

      const data = await res.json();
      const features = data.features || [];

      const alerts = features.map((f) => {
        const p = f.properties || {};
        return {
          id: p.id || f.id || Math.random().toString(),
          event: p.event || "Weather Advisory",
          severity: p.severity || "Unknown", // Extreme, Severe, Moderate, Minor
          urgency: p.urgency || "Unknown",
          certainty: p.certainty || "Unknown",
          headline: p.headline || p.event,
          description: p.description || "",
          instruction: p.instruction || "",
          areaDesc: p.areaDesc || "",
          effective: p.effective || null,
          expires: p.expires || null,
          senderName: p.senderName || authority.name
        };
      });

      return {
        supported: true,
        alerts,
        authority,
        message: alerts.length === 0 ? "No active weather alerts reported for this area." : null
      };
    } catch (err) {
      if (err.name === "AbortError") throw err;
      console.warn("NWS alerts fetch failed:", err);
      return {
        supported: true,
        alerts: [],
        authority,
        message: "Live alert bulletin feed temporarily unreachable."
      };
    }
  }

  // Non-US location: return honest status and official authority link
  return {
    supported: false,
    alerts: [],
    authority,
    message: `Direct real-time automated alert feed is not supported for this region. Official advisories and active warnings are monitored directly by ${authority.name}.`
  };
};
