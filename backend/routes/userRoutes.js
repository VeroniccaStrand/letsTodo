const express = require('express');
const router = express.Router();

const {
  registerUser,
  getUsers,
  getMe,
  loginUser,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware.js');
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/', getUsers);
module.exports = router;
