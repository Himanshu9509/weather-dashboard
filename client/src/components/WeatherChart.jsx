// client/src/components/WeatherChart.js

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function WeatherChart({ data }) {
  return (
    // This div is now styled by the CSS we added to App.css
    <div className="weather-chart-container">
      <h2>5-Day Temperature Trend</h2>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5, right: 30, left: 0, bottom: 5,
          }}
        >
          {/* Change the grid line color for a more subtle look */}
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
          
          {/* Style the X-axis text color and font size */}
          <XAxis 
            dataKey="name" 
            stroke="#6b7280" 
            fontSize={12} 
            tickLine={false} /* Hide the small tick lines */
            axisLine={false} /* Hide the main axis line */
          />
          
          {/* Style the Y-axis text color and font size */}
          <YAxis 
            stroke="#6b7280" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            /* Add ' °C' suffix to each Y-axis tick */
            tickFormatter={(value) => `${value}°C`} 
          />
          
          {/* Customize the tooltip's appearance */ }
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)', /* Semi-transparent white */
              backdropFilter: 'blur(5px)', /* A cool frosted glass effect */
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
          />

          {/* Customize the Legend text color */ }
          <Legend wrapperStyle={{ fontSize: '14px', color: '#374151' }} />
          
          {/* Change the line color and width */ }
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#3b82f6" /* Our primary blue color */
            strokeWidth={2}
            /* Customize the dot that appears on hover */
            activeDot={{ r: 8, strokeWidth: 2, fill: '#3b82f6' }} 
            /* Customize the static dots on the line */
            dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeatherChart;  