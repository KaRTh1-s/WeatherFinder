import React, { useState, useEffect, useRef } from "react";
import { searchCities } from "../services/geocodingService";

export const Navbar = ({
  onSelectCity,
  onUseCurrentLocation,
  locating = false,
  unit = "metric",
  onToggleUnit,
  theme = "dark",
  onToggleTheme,
  motionEnabled = true,
  onToggleMotion,
  favorites = [],
  recents = [],
  onSelectSavedCity,
  onRemoveFavorite,
  currentCityName = ""
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hasNoResults, setHasNoResults] = useState(false);

  const searchContainerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setHasNoResults(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setSearching(true);
    setHasNoResults(false);

    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(searchTerm, controller.signal);
        setSuggestions(results);
        setIsOpen(true);
        setActiveIndex(-1);
        setHasNoResults(results.length === 0);
      } catch (err) {
        if (err.name !== "AbortError") {
          setSuggestions([]);
        }
      } finally {
        setSearching(false);
      }
    }, 320);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    onSelectCity(item);
    setSearchTerm("");
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter" && searchTerm.trim()) {
        // Fallback: search term directly
        onSelectCity({ name: searchTerm.trim() });
        setIsOpen(false);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelect(suggestions[activeIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <header className="app-navbar" role="banner">
      <div className="navbar-top-row">
        <div className="brand-group">
          <span className="brand-logo" role="img" aria-label="weather icon">🌤</span>
          <div className="brand-text">
            <h1 className="brand-title">Weather Finder</h1>
            <span className="brand-tagline">Cinematic Atmospheric Intelligence</span>
          </div>
        </div>

        <div className="nav-actions">
          {/* Unit Toggle */}
          <button
            onClick={onToggleUnit}
            className="control-pill-btn unit-btn"
            aria-label={`Toggle temperature unit. Currently ${unit === "metric" ? "Celsius" : "Fahrenheit"}`}
            title="Switch Celsius / Fahrenheit"
          >
            <span className={unit === "metric" ? "active-unit" : ""}>°C</span>
            <span className="unit-sep">/</span>
            <span className={unit === "imperial" ? "active-unit" : ""}>°F</span>
          </button>

          {/* Theme Toggle (Preserves existing feature) */}
          <button
            onClick={onToggleTheme}
            className="control-pill-btn theme-btn"
            aria-label={`Switch theme. Currently ${theme}`}
            title="Toggle Light / Dark Mode"
          >
            {theme === "light" ? "🌙 Dark" : "☀ Light"}
          </button>

          {/* Motion Toggle */}
          <button
            onClick={onToggleMotion}
            className={`control-pill-btn motion-btn ${motionEnabled ? "active" : ""}`}
            aria-label={`Atmospheric animation ${motionEnabled ? "enabled" : "disabled"}`}
            title={motionEnabled ? "Atmospheric Motion: ON" : "Atmospheric Motion: OFF"}
          >
            {motionEnabled ? "✨ Motion" : "⏸ Static"}
          </button>
        </div>
      </div>

      {/* Search and GPS Bar */}
      <div className="search-bar-wrap" ref={searchContainerRef}>
        <div className="search-input-shell">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="text"
            className="search-input"
            placeholder="Search city, region, or capital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            aria-label="City search"
            aria-autocomplete="list"
            aria-controls="city-suggestions-list"
          />

          {searching && (
            <div className="search-spinner" aria-label="Searching locations...">
              <div className="spinner-dot" />
            </div>
          )}

          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm("");
                setSuggestions([]);
                setIsOpen(false);
              }}
              aria-label="Clear search input"
            >
              ✕
            </button>
          )}

          {/* GPS Location Button */}
          <button
            className={`gps-location-btn ${locating ? "locating" : ""}`}
            onClick={onUseCurrentLocation}
            disabled={locating}
            aria-label="Use My Location GPS"
            title="Detect My Location"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="7" />
              <line x1="12" y1="1" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="1" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="23" y2="12" />
            </svg>
            <span className="gps-btn-text">{locating ? "Locating..." : "My Location"}</span>
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && (
          <ul id="city-suggestions-list" className="suggestions-dropdown" role="listbox">
            {suggestions.map((item, idx) => (
              <li
                key={item.id}
                role="option"
                aria-selected={idx === activeIndex}
                className={`suggestion-item ${idx === activeIndex ? "highlighted" : ""}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <div className="suggestion-main">
                  <span className="suggestion-name">{item.name}</span>
                  {item.admin1 && <span className="suggestion-region">, {item.admin1}</span>}
                </div>
                {item.country && (
                  <span className="suggestion-country">{item.country}</span>
                )}
              </li>
            ))}

            {hasNoResults && (
              <li className="suggestion-empty">
                No matching cities found. Check spelling or try a larger nearby city.
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Quick City Chips (Favorites & Recents) */}
      {(favorites.length > 0 || recents.length > 0) && (
        <div className="chips-bar" aria-label="Quick city access chips">
          {favorites.map((fav) => (
            <div key={fav.id || fav.name} className={`chip-badge favorite-chip ${fav.name.toLowerCase() === currentCityName.toLowerCase() ? "current" : ""}`}>
              <button
                className="chip-name-btn"
                onClick={() => onSelectSavedCity(fav)}
              >
                ★ {fav.name}
              </button>
              <button
                className="chip-remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(fav);
                }}
                aria-label={`Remove ${fav.name} from favorites`}
                title="Remove favorite"
              >
                ✕
              </button>
            </div>
          ))}

          {recents
            .filter((r) => !favorites.some((f) => f.name.toLowerCase() === r.name.toLowerCase()))
            .slice(0, 4)
            .map((rec) => (
              <button
                key={rec.id || rec.name}
                className={`chip-badge recent-chip ${rec.name.toLowerCase() === currentCityName.toLowerCase() ? "current" : ""}`}
                onClick={() => onSelectSavedCity(rec)}
              >
                🕒 {rec.name}
              </button>
            ))}
        </div>
      )}
    </header>
  );
};
