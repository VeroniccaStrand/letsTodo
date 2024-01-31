const Todo = require('../models/todoModel.js');
const User = require('../models/userModel.js');
const asyncHandler = require('express-async-handler');

// Get all todos
const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.status(200).json(todos);
});

// Create a new todo
const createTodo = asyncHandler(async (req, res) => {
  // Check if there is a todo in the request
  if (!req.body.todo) {
    res.status(400);
    throw new Error('Please add a todo');
  }

  // Check if there are instructions in the request
  if (!req.body.instructions) {
    throw new Error('Please add instructions');
  }

  // Create a new todo with information from the request
  const todo = await Todo.create({
    todo: req.body.todo,
    instruction: req.body.instructions,
    user: req.user.id,
  });

  // Send back the created todo as JSON
  res.status(200).json(todo);
});

// Delete a todo
const deleteTodo = asyncHandler(async (req, res) => {
  // Find todo with the specified ID
  const todo = await Todo.findById(req.params.id);

  // If todo is not found, log an error message
  if (!todo) {
    res.status(400);
    console.log('Todo not found');
  }

  const user = await User.findById(req.user.id);
  // Check for user
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  if (todo.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  // Delete todo from the database
  await todo.deleteOne();

  // Send back the ID of the deleted todo as JSON
  res.status(200).json({ id: req.params.id });
});

// Update a todo
const updateTodo = asyncHandler(async (req, res) => {
  // Find todo with the specified ID
  const todo = await Todo.findById(req.params.id);

  // If todo is not found, throw an error message
  if (!todo) {
    res.status(400);
    throw new Error('Todo not found');
  }

  // Update todo with information from the request and return the updated todo
  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  // Send back the updated todo as JSON
  res.status(200).json(updatedTodo);
});

// Export the functions to be used in other files
module.exports = { getTodos, createTodo, deleteTodo, updateTodo };
