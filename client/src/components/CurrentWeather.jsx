// client/src/components/CurrentWeather.js

// 1. Import the necessary hooks, our AuthContext, and axios.
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { formatTemperature } from '../utils/temperature';
import { getWeatherIcon } from '../utils/weatherIconMap';

// The component receives props `weatherData` and `onSetDefault` as before.
function CurrentWeather({ weatherData, onSetDefault ,unit}) {
 
  
  
  // 2. Access the global authentication state using the useContext hook.
  //    We get the `isAuthenticated` flag to control rendering and the `token`
  //    to authorize our API call.
  const { isAuthenticated, token } = useContext(AuthContext);

  // 3. Create local state to manage the "Add to Favorites" action.
  //    This provides immediate feedback to the user.
  const [favoriteStatus, setFavoriteStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  const { city, temp, condition, icon } = weatherData;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  const unitSymbol = unit === 'metric' ? '°C' : '°F';
  const displayTemp = formatTemperature(temp, unit);

  // 4. Create the handler function for the "Add to Favorites" button.
  const handleAddFavorite = async () => {
    // Reset status on a new click
    setFavoriteStatus({ loading: true, error: null, success: null });

    try {
      // 5. Create the configuration object for our authenticated axios request.
      const config = {
        headers: {
          // This is the crucial part: we are adding the Authorization header.
          // The `protect` middleware on our backend will look for this.
          'Authorization': `Bearer ${token}`,
        },
      };

      // 6. Make the POST request to our protected endpoint.
      //    The first argument is the URL.
      //    The second argument is the request body (the city name).
      //    The third argument is our config object with the auth header.
      await axios.post('/api/favorites', { city }, config);

      // On success, update the local state to show a success message.
      setFavoriteStatus({ loading: false, success: 'Added to favorites!', error: null });
      // The success message will disappear after 3 seconds.
      setTimeout(() => setFavoriteStatus({ ...favoriteStatus, success: null }), 3000);

    } catch (err) {
      // Handle potential errors, such as the city already being in favorites (though our backend handles this gracefully)
      // or other server issues.
      const message = err.response?.data?.message || 'Could not add to favorites.';
      setFavoriteStatus({ loading: false, error: message, success: null });
    }
  };

  return (
    <div className="current-weather">
      <h2>{city}</h2>
      <div className="weather-details">
         <div className="weather-icon-large">
          {getWeatherIcon(condition, icon)}
        </div>
        <p className="temperature">{Math.round(temp)}{unitSymbol}</p>
        <p className="condition">{condition}</p>
     
        <img src={iconUrl} alt={condition} className="weather-icon" />
        <p className="temperature">{displayTemp}{unitSymbol}</p>
        <p className="condition">{condition}</p>
      </div>

      {/* --- START OF NEW/MODIFIED JSX --- */}

      {/* 7. Conditionally render the "Add to Favorites" button and its related UI.
          This entire block will only be rendered if `isAuthenticated` is true. */}
      {isAuthenticated && (
        <div className="favorites-actions">
          <button 
            onClick={handleAddFavorite} 
            className="btn-favorite"
            disabled={favoriteStatus.loading} // Disable button while loading
          >
            {favoriteStatus.loading ? 'Adding...' : 'Add to Favorites'}
          </button>
          
          {/* Display feedback messages to the user */}
          {favoriteStatus.success && <p className="success-message-local">{favoriteStatus.success}</p>}
          {favoriteStatus.error && <p className="error-message-local">{favoriteStatus.error}</p>}
        </div>
      )}

      {/* The "Set as Default" button remains as it is a guest feature. */}
      <button onClick={() => onSetDefault(city)} className="btn-default">
        Set as Default
      </button>

      {/* --- END OF NEW/MODIFIED JSX --- */}
    </div>
  );
}

export default CurrentWeather;