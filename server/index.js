import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import connectDB from './db.js';
import authRoutes from './routes/auth.js';
import favoritesRoutes from './routes/favorites.js';
import userRoutes from './routes/user.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

connectDB();
const app = express();
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../client/dist')));
   app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Weather Dashboard API' });
});
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/user', userRoutes);
app.get('/api/weather', );
app.get('/api/weather/coords');
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
      dailyForecasts[date] = {
        temps: [],
        icons: [],
        conditions: [],
      };
    }
    dailyForecasts[date].temps.push(item.main.temp);
    dailyForecasts[date].icons.push(item.weather[0].icon);
    dailyForecasts[date].conditions.push(item.weather[0].main);
  });

  const forecast = Object.keys(dailyForecasts).slice(0, 5).map(date => {
    const dayData = dailyForecasts[date];
    const avgTemp = dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length;
    
    const icon = dayData.icons.sort((a,b) => dayData.icons.filter(v => v===a).length - dayData.icons.filter(v => v===v).length).pop();

    return {
      date,
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      temp: avgTemp,
      tempHigh: Math.max(...dayData.temps),
      tempLow: Math.min(...dayData.temps),
      condition: dayData.conditions[0], 
      icon: icon,
    };
  });

  return { current: currentWeather, forecast };
};
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ message: 'City parameter is required' });
  }

  const apiKey = process.env.WEATHER_API_KEY;
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const [currentWeatherRes, forecastRes] = await Promise.all([
      axios.get(currentWeatherUrl),
      axios.get(forecastUrl),
    ]);
    const processedData = processWeatherData(currentWeatherRes.data, forecastRes.data);
    res.json(processedData);

  } catch (error) {
    console.error('Error fetching weather data:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: 'Failed to fetch weather data' });
  }
});
app.get('/api/weather/coords', async (req, res) => {
  const { lat, lon   } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude parameters are required' });
  }

  const apiKey = process.env.WEATHER_API_KEY;
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  try {
    const [currentWeatherRes, forecastRes] = await Promise.all([
      axios.get(currentWeatherUrl),
      axios.get(forecastUrl),
    ]);
    const processedData = processWeatherData(currentWeatherRes.data, forecastRes.data);
    res.json(processedData);

  } catch (error) {
    console.error('Error fetching weather data by coords:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: 'Failed to fetch weather data' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/api', (req, res) => {
  res.json({ message: 'Server is running successfully 🚀' });
});
app.get('/api/weather', async (req, res) => {
  try {
    const city = req.query.city;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
