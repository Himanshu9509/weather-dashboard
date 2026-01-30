// server/middleware/authMiddleware.js

// 1. Import the necessary libraries.
import jwt from 'jsonwebtoken';
import User from '/models/User.js';

// 2. Define the 'protect' middleware function. It's an async function as it will interact with the database.
const protect = async (req, res, next) => {
  let token;

  // 3. Check if the 'Authorization' header exists and starts with 'Bearer'.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 4. Extract the token from the header string ('Bearer TOKEN' -> 'TOKEN').
      token = req.headers.authorization.split(' ')[1];

      // 5. Verify the token's authenticity and expiration using our JWT_SECRET.
      //    `jwt.verify` will decode the token's payload if the signature is valid.
      //    If it's invalid (tampered with) or expired, it will throw an error.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 6. Find the user in the database using the ID from the decoded token.
      //    We attach the user object to the request (`req.user`).
      //    Crucially, we use `.select('-password')` to exclude the hashed password
      //    from the user object that gets attached to the request. This is a
      //    critical security best practice.
      req.user = await User.findById(decoded.user.id).select('-password');

      // 7. If all is well, call `next()` to pass control to the next middleware
      //    or to the actual route handler.
      next();
    } catch (error) {
      // 8. If an error occurs during token verification (e.g., token expired, invalid),
      //    we catch it here.
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // 9. If there is no token at all in the header.
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 10. Export the middleware so we can use it in our route files.
export { protect };