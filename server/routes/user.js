// server/routes/user.js

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '/models/User.js';

const router = express.Router();

/**
 * @route   PUT /api/user/preferences
 * @desc    Update user preferences (e.g., temperature unit)
 * @access  Private
 */
router.put('/preferences', protect, async (req, res) => {
  // We expect the new preference to be in the request body, e.g., { unit: 'imperial' }
  const { unit } = req.body;

  // Validate the input to ensure it's one of our allowed values.
  if (!unit || !['metric', 'imperial'].includes(unit)) {
    return res.status(400).json({ message: 'Invalid unit preference provided.' });
  }

  try {
    // Find the user by the ID from our `protect` middleware and update their field.
    await User.findByIdAndUpdate(req.user.id, { unitPreference: unit });

    // Send a success response. We don't need to send any data back, just confirm it worked.
    res.status(200).json({ message: 'Preferences updated successfully.' });

  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ message: 'Server error while updating preferences.' });
  }
});

export default router;