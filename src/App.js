import React, { useState, useEffect, useCallback, useRef } from "react";
import { AtmosphericBackground } from "./components/AtmosphericBackground";
import { Navbar } from "./components/Navbar";
import { CurrentHero } from "./components/CurrentHero";
import { HourlyForecast } from "./components/HourlyForecast";
import { DailyForecast } from "./components/DailyForecast";
import { InteractiveChart } from "./components/InteractiveChart";
import { AirQualityCard } from "./components/AirQualityCard";
import { WeatherAlerts } from "./components/WeatherAlerts";
import { WeatherMetricsGrid } from "./components/WeatherMetricsGrid";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { ErrorBanner } from "./components/ErrorBanner";
import { Footer } from "./components/Footer";

import { fetchComprehensiveWeather } from "./services/weatherService";
import { fetchAirQuality } from "./services/airQualityService";
import { fetchWeatherAlerts } from "./services/alertService";
import { reverseGeocode, searchCities } from "./services/geocodingService";

import "./App.css";

const DEFAULT_CITY = {
  name: "Madurai",
  admin1: "Tamil Nadu",
  country: "India",
  countryCode: "IN",
  latitude: 9.919,
  longitude: 78.1195,
  timezone: "Asia/Kolkata"
};

function App() {
  // Saved user preferences
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem("weatherfinder_unit") || "metric";
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("weatherfinder_theme") || "dark";
  });

  const [motionEnabled, setMotionEnabled] = useState(() => {
    const saved = localStorage.getItem("weatherfinder_motion");
    return saved !== null ? saved === "true" : true;
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("weatherfinder_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recents, setRecents] = useState(() => {
    try {
      const saved = localStorage.getItem("weatherfinder_recents");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Telemetry & UI states
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_CITY);
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [alerts, setAlerts] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);

  const activeAbortRef = useRef(null);

  // Sync preferences to localStorage
  useEffect(() => {
    localStorage.setItem("weatherfinder_unit", unit);
  }, [unit]);

  useEffect(() => {
    localStorage.setItem("weatherfinder_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("weatherfinder_motion", String(motionEnabled));
  }, [motionEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem("weatherfinder_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.warn("Could not save favorites to localStorage", e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem("weatherfinder_recents", JSON.stringify(recents));
    } catch (e) {
      console.warn("Could not save recents to localStorage", e);
    }
  }, [recents]);

  // Main loader for coordinates / location
  const loadWeatherData = useCallback(async (loc, isManualRefresh = false) => {
    if (!loc || loc.latitude === undefined || loc.longitude === undefined) {
      // If coordinates missing (e.g. user typed a plain city name), resolve coordinates first
      try {
        const found = await searchCities(loc.name || loc);
        if (found && found.length > 0) {
          loc = found[0];
        } else {
          setError(`City "${loc.name || loc}" not found. Please verify the spelling.`);
          setLoading(false);
          setRefreshing(false);
          return;
        }
      } catch {
        setError(`Unable to resolve location for "${loc.name || loc}".`);
        setLoading(false);
        setRefreshing(false);
        return;
      }
    }

    if (activeAbortRef.current) {
      activeAbortRef.current.abort();
    }
    const controller = new AbortController();
    activeAbortRef.current = controller;

    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // Fetch Weather, Air Quality, and Alerts concurrently
      const [weatherRes, aqiRes, alertsRes] = await Promise.all([
        fetchComprehensiveWeather({
          latitude: loc.latitude,
          longitude: loc.longitude,
          cityName: loc.name,
          countryCode: loc.countryCode || loc.country,
          admin1: loc.admin1,
          timezone: loc.timezone || "auto",
          signal: controller.signal
        }),
        fetchAirQuality(loc.latitude, loc.longitude, controller.signal),
        fetchWeatherAlerts(
          loc.latitude,
          loc.longitude,
          loc.countryCode || loc.country,
          loc.country,
          controller.signal
        )
      ]);

      setCurrentLocation(loc);
      setWeather(weatherRes);
      setAirQuality(aqiRes);
      setAlerts(alertsRes);

      // Add to recents (max 6, unique by name)
      setRecents((prev) => {
        const filtered = prev.filter(
          (p) => p.name.toLowerCase() !== loc.name.toLowerCase()
        );
        return [loc, ...filtered].slice(0, 6);
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Telemetry loading failed:", err);
        setError(err.message || "Unable to retrieve meteorological data. Please try again.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    loadWeatherData(DEFAULT_CITY);
  }, [loadWeatherData]);

  // Handle GPS location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser. Please search for your city above.");
      return;
    }

    setLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const rev = await reverseGeocode(
            latitude,
            longitude,
            process.env.REACT_APP_WEATHER_API_KEY
          );
          const detectedLoc = {
            name: rev.name,
            admin1: rev.admin1,
            country: rev.country,
            latitude,
            longitude,
            timezone: "auto"
          };
          loadWeatherData(detectedLoc);
        } catch {
          loadWeatherData({
            name: "My Location",
            latitude,
            longitude,
            timezone: "auto"
          });
        } finally {
          setLocating(false);
        }
      },
      (geoErr) => {
        setLocating(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setError("Location permission denied. Please allow location access in your browser settings or search for your city above.");
        } else if (geoErr.code === geoErr.POSITION_UNAVAILABLE) {
          setError("Location information is currently unavailable. Please search for your city manually.");
        } else if (geoErr.code === geoErr.TIMEOUT) {
          setError("Location request timed out. Please check your signal or search for your city above.");
        } else {
          setError("Unable to detect current location. Please search for your city manually.");
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Toggle Favorite city
  const isFavorite = favorites.some(
    (f) => f.name.toLowerCase() === currentLocation.name.toLowerCase()
  );

  const handleToggleFavorite = () => {
    if (isFavorite) {
      setFavorites((prev) =>
        prev.filter((f) => f.name.toLowerCase() !== currentLocation.name.toLowerCase())
      );
    } else {
      setFavorites((prev) => [currentLocation, ...prev]);
    }
  };

  const handleRemoveFavorite = (cityToRemove) => {
    setFavorites((prev) =>
      prev.filter((f) => f.name.toLowerCase() !== cityToRemove.name.toLowerCase())
    );
  };

  // Toggles
  const handleToggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleToggleMotion = () => {
    setMotionEnabled((prev) => !prev);
  };

  const handleRefresh = () => {
    loadWeatherData(currentLocation, true);
  };

  const currentAtmosphere = weather?.current?.condition?.atmosphere || "clear-day";
  const isDay = weather?.current?.isDay ?? true;

  return (
    <div className={`app theme-${theme} ${theme}`}>
      {/* Cinematic Weather Canvas Background */}
      <AtmosphericBackground
        atmosphere={currentAtmosphere}
        isDay={isDay}
        theme={theme}
        motionEnabled={motionEnabled}
      />

      <div className="app-shell">
        {/* Navigation, Search, GPS, Preferences */}
        <Navbar
          onSelectCity={(cityItem) => loadWeatherData(cityItem)}
          onUseCurrentLocation={handleUseCurrentLocation}
          locating={locating}
          unit={unit}
          onToggleUnit={handleToggleUnit}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          motionEnabled={motionEnabled}
          onToggleMotion={handleToggleMotion}
          favorites={favorites}
          recents={recents}
          onSelectSavedCity={(cityItem) => loadWeatherData(cityItem)}
          onRemoveFavorite={handleRemoveFavorite}
          currentCityName={currentLocation.name}
        />

        {/* Global Error Banner */}
        {error && (
          <ErrorBanner
            message={error}
            onRetry={handleRefresh}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Main Content Layout */}
        <main className="dashboard-grid" role="main">
          {loading && !weather ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Primary Column */}
              <div className="dashboard-primary">
                {/* Current Weather Hero */}
                <CurrentHero
                  weather={weather}
                  unit={unit}
                  isFavorite={isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  onRefresh={handleRefresh}
                  refreshing={refreshing}
                />

                {/* 24-Hour Hourly Strip */}
                <HourlyForecast
                  hourly={weather?.hourly}
                  unit={unit}
                  timezone={weather?.location?.timezone}
                />

                {/* Interactive Bézier Chart */}
                <InteractiveChart
                  hourly={weather?.hourly}
                  unit={unit}
                  timezone={weather?.location?.timezone}
                />

                {/* Telemetry Sub-cards: Sun cycle, thermal, pressure */}
                <WeatherMetricsGrid
                  weather={weather}
                  unit={unit}
                />
              </div>

              {/* Secondary Column */}
              <div className="dashboard-secondary">
                {/* 7-Day Forecast */}
                <DailyForecast
                  daily={weather?.daily}
                  unit={unit}
                  timezone={weather?.location?.timezone}
                />

                {/* Air Quality & UV Index */}
                <AirQualityCard
                  airQuality={airQuality}
                  currentUv={weather?.current?.todayUvMax}
                />

                {/* Severe Weather Bulletins */}
                <WeatherAlerts
                  alertData={alerts}
                  timezone={weather?.location?.timezone}
                />
              </div>
            </>
          )}
        </main>

        {/* Footer with attributions */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
