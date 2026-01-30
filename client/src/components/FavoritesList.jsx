// client/src/components/FavoritesList.js

// 1. Import all the necessary hooks and libraries.
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // To get the auth token


// 2. Define the FavoritesList component.
function FavoritesList({ onFavoriteClick }) {
  // 3. Set up the component's state.
  const [favorites, setFavorites] = useState([]); // To store the list of cities
  const [loading, setLoading] = useState(true);   // To show a loading indicator
  const [error, setError] = useState(null);      // To display any API errors

  // 4. Access the authentication token from our global AuthContext.
  //    We need this token to prove our identity to the protected backend endpoint.
  const { token } = useContext(AuthContext);

  // 5. Use the useEffect hook to fetch data when the component mounts.
  useEffect(() => {
    // Define an async function to perform the data fetching.
    const fetchFavorites = async () => {
      // Ensure we have a token before trying to fetch data.
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Create the axios config object with the Authorization header.
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Make the authenticated GET request to our backend API.
        const res = await axios.get('/api/favorites', config);

        // On success, update our state with the list of cities from the response.
        setFavorites(res.data.favoriteCities);
        setError(null);
      } catch (err) {
        // If an error occurs, update the error state.
        console.error('Failed to fetch favorites:', err);
        setError('Could not load your favorites.');
      } finally {
        // No matter what, set loading to false once the operation is complete.
        setLoading(false);
      }
    };

    fetchFavorites();
    // The dependency array `[token]` ensures this effect re-runs if the user
    // logs in or out (which changes the token).
  }, [token]);

  // 6. Implement conditional rendering based on the component's state.

  // If we are still loading, show a simple message.
  if (loading) {
    return <div className="favorites-list-container">Loading favorites...</div>;
  }

  // If an error occurred, display the error message.
  if (error) {
    return <div className="favorites-list-container error-message">{error}</div>;
  }

  // 7. Render the main component UI.
  return (
    <div className="favorites-list-container">
      <h4>My Favorite Cities</h4>
      {/* If the user has no favorites, show a helpful message. */}
      {favorites.length === 0 ? (
        <p className="no-favorites">You haven't added any favorites yet.</p>
      ) : (
        // Otherwise, map over the favorites array and display each city.
        <ul className="favorites-list">
          {favorites.map((city) => (
            <li 
            key={city} 
            className="favorite-item-clickable"
            onClick={() => onFavoriteClick(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FavoritesList;