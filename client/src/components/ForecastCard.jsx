import React from 'react';
import { formatTemperature } from '../utils/temperature';
import { getWeatherIcon } from '../utils/weatherIconMap';
const dummyForecastData = {
  day: "Tue",
  icon: "10d",
  tempHigh: 19,
  tempLow: 12,
};
function ForecastCard({ dayData ,unit,condition }) {
  const { day, icon, tempHigh, tempLow } = dayData;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  const unitSymbol = unit === 'metric' ? '°C' : '°F';
  const displayHigh = formatTemperature(tempHigh, unit);
  const displayLow = formatTemperature(tempLow, unit);

  return (
    <div className="forecast-card">
      <h4>{day}</h4>
      {/* 3. Call the utility function to render the forecast icon. */}
      <div className="weather-icon-small">
        {getWeatherIcon(condition, icon)}
      </div>
      <p className="forecast-temp">{Math.round(dayData.temp)}{unitSymbol}</p>
      <h3 className="forecast-day">{day}</h3>
      <img src={iconUrl} alt="Weather icon" className="forecast-icon" />
      <div className="forecast-temps">
        <span className="temp-high">{Math.round(tempHigh)}°</span>
        <span className="temp-low">{Math.round(tempLow)}°</span>
      </div>
    </div>
  );
}
export default ForecastCard;