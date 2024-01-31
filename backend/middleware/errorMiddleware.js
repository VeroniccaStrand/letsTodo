// Define an error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error to the console for debugging purposes
  console.error('Error handled by errorHandler:', err);

  // Get the HTTP status code from the response or default to 500 (Internal Server Error)
  const statusCode = res.statusCode ? res.statusCode : 500;

  // Send a JSON response with the error message and stack trace (in development mode)
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// Export the errorHandler function to be used in other parts of the application
module.exports = errorHandler;
