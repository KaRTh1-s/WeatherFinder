import React from "react";

export const Footer = () => {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-title">🌤️ WeatherFinder</span>
          <p className="footer-tagline">
            Cinematic weather telemetry, global forecasts, and atmospheric intelligence.
          </p>
        </div>

        <div className="footer-links-row">
          <div className="footer-col">
            <span className="footer-col-title">Telemetry Sources</span>
            <ul className="footer-list">
              <li>
                <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">
                  OpenWeather API
                </a>
              </li>
              <li>
                <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
                  Open-Meteo High-Res Forecasting
                </a>
              </li>
              <li>
                <a href="https://open-meteo.com/en/docs/air-quality-api" target="_blank" rel="noopener noreferrer">
                  Open-Meteo Air Quality Model
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Official Authorities</span>
            <ul className="footer-list">
              <li>
                <a href="https://www.weather.gov" target="_blank" rel="noopener noreferrer">
                  NOAA National Weather Service
                </a>
              </li>
              <li>
                <a href="https://severeweather.wmo.int/" target="_blank" rel="noopener noreferrer">
                  WMO World Meteorological Org
                </a>
              </li>
              <li>
                <a href="https://meteoalarm.org/" target="_blank" rel="noopener noreferrer">
                  EUMETNET MeteoAlarm
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>Crafted with React & Modern Web Standards • Deployed on Netlify</span>
        </div>
      </div>
    </footer>
  );
};
