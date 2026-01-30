// client/src/utils/weatherIconMap.js

import React from 'react';

// 1. Import all the icons we plan to use from the 'Weather Icons' set.
//    This is a great icon set included in react-icons.
import {
  WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, WiCloud,
  WiCloudy, WiRain, WiShowers, WiThunderstorm, WiSnow, WiFog
} from 'react-icons/wi';

/**
 * Maps an OpenWeatherMap weather condition and icon code to a React icon component.
 * @param {string} condition - The main weather condition from the API (e.g., "Clear", "Clouds").
 * @param {string} iconCode - The icon code from the API (e.g., "01d", "01n").
 * @returns {JSX.Element} A React component representing the weather icon.
 */
export const getWeatherIcon = (condition, iconCode) => {
  // 2. First, determine if it's nighttime by checking if the icon code ends with 'n'.
  const isNight = iconCode.endsWith('n');

  // 3. Use a switch statement on the main condition string to determine the base icon.
  switch (condition) {
    case 'Clear':
      // If the condition is "Clear", return a moon for night and a sun for day.
      return isNight ? <WiNightClear /> : <WiDaySunny />;
    case 'Clouds':
      // For clouds, we can have several variations. A simple approach:
      // If it's just 'day cloudy' or 'night cloudy', show a slightly different icon.
      if (iconCode === '02d' || iconCode === '02n') {
        return isNight ? <WiNightAltCloudy /> : <WiDayCloudy />;
      }
      // For more generic "Clouds" (like broken or overcast), use these.
      return <WiCloudy />;
    case 'Rain':
      return <WiRain />;
    case 'Drizzle':
      return <WiShowers />; // Drizzle is like light showers.
    case 'Thunderstorm':
      return <WiThunderstorm />;
    case 'Snow':
      return <WiSnow />;
    case 'Mist':
    case 'Smoke':
    case 'Haze':
    case 'Dust':
    case 'Fog':
    case 'Sand':
    case 'Ash':
    case 'Squall':
    case 'Tornado':
      return <WiFog />;
    default:
      // 4. A default icon for any unhandled conditions.
      return <WiCloud />;
  }
};