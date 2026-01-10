🌤️ WeatherFinder

WeatherFinder is a modern, responsive React web application that provides real-time weather information for any city using the OpenWeather API.
It features a clean UI, dark/light mode, and robust error handling, making it suitable for learning, portfolios, and deployment on platforms like Netlify.

🚀 Live Demo
[https://weatherfinder.netlify.app
](https://weatherfinder-v1.netlify.app/)


FEATURES

Search weather by city name
Current temperature (°C)
Weather condition with icon
Humidity and 💨 wind speed
Dark / ☀️ Light mode toggle
Fast and responsive UI
Graceful error handling (invalid city / API issues)
Secure API key handling using environment variables

TECHNOLOGIES USED

React.js
JavaScript (ES6+)
CSS3
OpenWeather API
Node.js & npm


WORKING

User enters a city name
The app sends a request to the OpenWeather API:
https://api.openweathermap.org/data/2.5/weather
The API returns real-time weather data
The app displays temperature, condition, humidity, and wind speed
Theme toggle switches between light and dark modes

SETUP

Step 1: Get a Free API Key
Visit 👉 https://home.openweathermap.org/api_keys
Sign up or log in
Generate a new API key
⏳ (New keys may take 10–30 minutes to activate)

Step 2: Configure Environment Variable
Create a .env file in the project root:
REACT_APP_WEATHER_API_KEY=your_api_key_here

⚠️ Notes:
Do not use quotes
No spaces
Variable name must start with REACT_APP_

Step 3: Restart the App
npm start
React reads environment variables only at startup.
💻 Local Development


Prerequisites
Node.js (v16+ recommended)
npm


Installation
# Clone the repository
git clone https://github.com/KaRTh1-s/WeatherFinder.git

# Navigate to the project
cd weatherfinder

# Install dependencies
npm install

# Start the development server
npm start


Open your browser at:

http://localhost:3000


The app handles:

Invalid city names

Network errors

Missing or invalid API keys

Clear, user-friendly messages are shown to the user.
