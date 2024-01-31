const express = require('express');
const router = express.Router();
const {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} = require('../controllers/todoController.js');

const { protect } = require('../middleware/authMiddleware.js');
router.route('/').get(protect, getTodos).post(protect, createTodo);
router.route('/:id').delete(protect, deleteTodo).put(protect, updateTodo);

module.exports = router;
