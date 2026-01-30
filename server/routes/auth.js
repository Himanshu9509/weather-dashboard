import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '/models/User.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: 'User with this email already exists',
      });
    }

    // Basic password validation
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
      });
    }

    // Create new user
    user = new User({
      email,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid Credentials',
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid Credentials',
      });
    }

    // JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
         const userToReturn = {
      id: user.id,
      email: user.email,
      favoriteCities: user.favoriteCities,
      unitPreference: user.unitPreference, // Include the new preference!
    };
    res.json({ token, user: userToReturn });
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).send('Server error');
  }
});

export default router;
