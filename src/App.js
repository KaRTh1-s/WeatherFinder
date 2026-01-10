import { useState } from "react";
import "./App.css";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

function App() {
  const [city, setCity] = useState("Madurai");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  const fetchWeatherByCity = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200 || data.cod === "200") {
        setWeather({
          name: data.name,
          temp: data.main.temp,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          desc: data.weather[0].description,
          icon: data.weather[0].icon,
        });
      } else {
        setError(data.message || "City not found");
      }
    } catch (err) {
      setError("Network error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        <header>
          <h1 className="title">🌤 Weather Finder</h1>
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark" : "☀ Light"}
          </button>
        </header>

        <div className="search-section">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeatherByCity()}
          />
          <button onClick={fetchWeatherByCity} disabled={loading}>
            {loading ? "Loading..." : "Get Weather"}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {weather && (
          <div className="weather-card">
            <h2>{weather.name}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="weather"
            />
            <p className="temp">{Math.round(weather.temp)}°C</p>
            <p className="desc">{weather.desc}</p>

            <div className="details">
              <div>💧 Humidity: {weather.humidity}%</div>
              <div>💨 Wind: {weather.wind} m/s</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
