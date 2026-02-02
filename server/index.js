import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './db.js';
import authRoutes from './routes/auth.js';
import favoritesRoutes from './routes/favorites.js';
import userRoutes from './routes/user.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Needed for ES modules (__dirname fix)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =======================
   API ROUTES
======================= */

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'Server is running successfully 🚀' });
});

/* =======================
   WEATHER HELPERS
======================= */

const processWeatherData = (currentData, forecastData) => {
  const currentWeather = {
    city: currentData.name,
    temp: currentData.main.temp,
    condition: currentData.weather[0].main,
    description: currentData.weather[0].description,
    icon: currentData.weather[0].icon,
  };

  const dailyForecasts = {};

  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = { temps: [], icons: [], conditions: [] };
    }
    dailyForecasts[date].temps.push(item.main.temp);
    dailyForecasts[date].icons.push(item.weather[0].icon);
    dailyForecasts[date].conditions.push(item.weather[0].main);
  });

  const forecast = Object.keys(dailyForecasts)
    .slice(0, 5)
    .map(date => {
      const day = dailyForecasts[date];
      return {
        date,
        dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        temp: day.temps.reduce((a, b) => a + b, 0) / day.temps.length,
        tempHigh: Math.max(...day.temps),
        tempLow: Math.min(...day.temps),
        condition: day.conditions[0],
        icon: day.icons[0],
      };
    });

  return { current: currentWeather, forecast };
};

/* =======================
   WEATHER ROUTES
======================= */

app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ message: 'City is required' });

  try {
    const apiKey = process.env.WEATHER_API_KEY;

    const [currentRes, forecastRes] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`),
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    ]);

    res.json(processWeatherData(currentRes.data, forecastRes.data));
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

app.get('/api/weather/coords', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude required' });
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY;

    const [currentRes, forecastRes] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    ]);

    res.json(processWeatherData(currentRes.data, forecastRes.data));
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

/* =======================
   FRONTEND (REACT BUILD)
   ⚠️ NO WILDCARD ROUTES
======================= */

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../client/dist')));

  // SPA fallback — MUST use app.use (not app.get)
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

/* =======================
   START SERVER
======================= */
// React dev fallback (prevents 404 on refresh)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.status(200).send('React dev server handles frontend');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
