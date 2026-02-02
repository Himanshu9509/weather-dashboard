import React from "react";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';

import SearchForm from './components/SearchForm';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import WeatherChart from './components/WeatherChart';
import Navbar from './components/Navbar';
import FavoritesList from './components/FavoritesList';
import ToggleSwitch from './components/ToggleSwitch';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';




import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [geolocationError, setGeolocationError] = useState('');
  const [unit, setUnit] = useState(() => localStorage.getItem('unit') || 'metric');

  const { isAuthenticated, user, token } = useContext(AuthContext);

  /* ---------------- UNIT PREFERENCE ---------------- */

  useEffect(() => {
    if (isAuthenticated && user?.unitPreference) {
      setUnit(user.unitPreference);
    } else {
      setUnit(localStorage.getItem('unit') || 'metric');
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('unit', unit);

    if (isAuthenticated && token) {
      const syncPreference = async () => {
        try {
          await axios.put(
            '/api/user/preferences',
            { unit },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error('Failed to sync unit preference:', err);
        }
      };
      syncPreference();
    }
  }, [unit, isAuthenticated, token]);

  const handleUnitToggle = () => {
    setUnit(prev => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  /* ---------------- WEATHER FETCH ---------------- */

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get('/api/weather', { params: { city } });
      setWeatherData(res.data);

      const newCity = res.data.current.city;
      const updatedHistory = [
        newCity,
        ...searchHistory.filter(c => c.toLowerCase() !== newCity.toLowerCase()),
      ].slice(0, 8);

      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- GEOLOCATION ---------------- */

  const handleGeolocationClick = () => {
    setError(null);
    setGeolocationError('');

    if (!navigator.geolocation) {
      setGeolocationError('Geolocation not supported by your browser');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await axios.get('/api/weather/coords', {
            params: { lat: coords.latitude, lon: coords.longitude },
          });
          setWeatherData(res.data);
        } catch (err) {
          setError('Failed to fetch weather for your location');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        const messages = {
          1: 'Permission denied',
          2: 'Location unavailable',
          3: 'Request timed out',
        };
        setGeolocationError(messages[err.code] || 'Unknown error');
        setLoading(false);
      }
    );
  };

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) setSearchHistory(JSON.parse(storedHistory));

    const defaultCity = localStorage.getItem('defaultCity');
    if (defaultCity) fetchWeather(defaultCity);
  }, []);

  const handleSetDefault = (city) => {
    localStorage.setItem('defaultCity', city);
    alert(`${city} set as default city`);
  };

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <Navbar />
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <header>
                  <h1>Weather Dashboard</h1>
                  <ToggleSwitch unit={unit} onToggle={handleUnitToggle} />

                  <div className="search-container">
                    <SearchForm onSearch={fetchWeather} />
                    <button onClick={handleGeolocationClick}>
                      Use My Location
                    </button>

                    {geolocationError && <p className="error-message">{geolocationError}</p>}
                    {isAuthenticated && <FavoritesList onFavoriteClick={fetchWeather} />}
                  </div>
                </header>

                <main>
                  {loading && <p>Loading...</p>}
                  {error && <p className="error-message">{error}</p>}

                  {weatherData && (
                    <>
                      <CurrentWeather
                        weatherData={weatherData.current}
                        onSetDefault={handleSetDefault}
                      />
                      <Forecast forecastData={weatherData.forecast} />

                      <WeatherChart
                        data={weatherData.forecast.map(day => ({
                          name: day.day,
                          temperature: Math.round(day.tempHigh),
                        }))}
                      />
                    </>
                  )}
                </main>
              </>
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
