import React from 'react';
import ForecastCard from './ForecastCard';
const dummyForecastData = [
  { day: 'Mon', icon: '02d', tempHigh: 22, tempLow: 14 },
  { day: 'Tue', icon: '10d', tempHigh: 19, tempLow: 12 },
  { day: 'Wed', icon: '04d', tempHigh: 20, tempLow: 13 },
  { day: 'Thu', icon: '01d', tempHigh: 24, tempLow: 16 },
  { day: 'Fri', icon: '03d', tempHigh: 23, tempLow: 15 },
];
function Forecast({ forecastData ,unit }) {
  return (
    <div className="forecast-container">
       <h3>5-Day Forecast</h3>
      <div className="forecast-cards">
      {forecastData.map((day, index) => (
        <ForecastCard key = {index} dayData={day} unit={unit} />
      ))}
      </div>
    </div>
  );
}

export default Forecast;
