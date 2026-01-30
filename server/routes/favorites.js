import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '/models/User.js';
const router = express.Router();

/**
 * @route   GET /api/favorites
 * @desc    Get the logged-in user's favorite cities
 * @access  Private
 */
router.get('/', protect, (req, res) => {
     res.status(200).json({
    favoriteCities: req.user.favoriteCities,
  });

  res.json({
    message: "This will be the user's list of favorite cities.",
    favorites: req.user.favoriteCities, 
  });
});

/**
 * @route   POST /api/favorites
 * @desc    Add a city to the logged-in user's favorites
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  // 1. Extract the city name from the request body.
  const { city } = req.body;

  // 2. Basic validation to ensure a city was provided.
  if (!city) {
    return res.status(400).json({ message: 'City name is required' });
  }

  try {
    // 3. Find the logged-in user by their ID (from the `protect` middleware)
    //    and update their document in a single, atomic operation.
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // The ID of the document to update.
      { 
        // The `$addToSet` operator adds the `city` to the `favoriteCities` array.
        // It will only add the city if it's not already present in the array.
        $addToSet: { favoriteCities: city } 
      },
      { 
        // The `new: true` option is crucial. It tells Mongoose to return the
        // document *after* the update has been applied, so we get the fresh data.
        // Without it, we would get the old document from before the city was added.
        new: true 
      }
    ).select('-password'); // We still select '-password' for security, even on updates.

    // 4. If the user is somehow not found (highly unlikely after `protect` middleware), handle it.
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    // 5. Send a success response back to the client, including the newly updated
    //    list of favorite cities. This is very useful for the frontend to update its state.
    res.status(200).json({
        message: `'${city}' added to favorites successfully.`,
        favoriteCities: updatedUser.favoriteCities,
    });

  } catch (error) {
    // 6. Generic error handling for any other database or server issues.
    console.error('Error adding favorite city:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/favorites
 * @desc    Remove a city from the logged-in user's favorites
 * @access  Private
 */
router.delete('/', protect, async (req, res) => {
  // 1. Extract the city name to be removed from the request body.
  //    Keeping this consistent with the POST route makes our API predictable.
  const { city } = req.body;

  // 2. Validate that a city name was provided.
  if (!city) {
    return res.status(400).json({ message: 'City name is required' });
  }

  try {
    // 3. Find the logged-in user and update their document in one atomic operation.
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // The ID of the user to update, provided by our `protect` middleware.
      {
        // The `$pull` operator removes the specified `city` from the `favoriteCities` array.
        $pull: { favoriteCities: city }
      },
      { new: true } // Return the updated document.
    ).select('-password'); // Exclude the password for security.

    // 4. Handle the unlikely case that the user is not found.
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    // 5. Respond with a success message and the user's new list of favorites.
    //    Sending the updated list back is extremely useful for the frontend.
    res.status(200).json({
        message: `'${city}' removed from favorites successfully.`,
        favoriteCities: updatedUser.favoriteCities,
    });

  } catch (error) {
    // 6. Handle any potential server or database errors.
    console.error('Error removing favorite city:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- END OF NEW/MODIFIED CODE ---

export default router;