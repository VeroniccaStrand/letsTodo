const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id);
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// Get current user details
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);
  res.status(200).json({
    id: _id,
    name,
    email,
  });
});

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all fields are filled
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  // Check if the user already exists with the provided email address
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error('An account is already registered with that email');
  }

  // Generate a "salt" to use for hashing the password
  const salt = await bcrypt.genSalt(10);
  // Create a hashed password
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user with the provided details
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // If the user is successfully created, send back user information and a JWT token
  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Get all users
const getUsers = asyncHandler(async (req, res) => {
  // Get all users from the database
  const users = await User.find();
  // Send back all users as JSON
  res.status(200).json(users);
});

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Export the functions to be used in other files
module.exports = { registerUser, getUsers, getMe, loginUser };
