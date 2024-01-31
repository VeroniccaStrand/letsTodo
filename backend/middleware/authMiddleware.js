const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel.js');

// Middleware to protect routes with authentication
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the request has an Authorization header starting with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Decode the token using the JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user information (excluding password) to the request
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized');
    }

  // If no token is found in the Authorization header, throw an error
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };
