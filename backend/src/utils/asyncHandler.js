/**
 * Wraps an async controller function to automatically catch errors 
 * and pass them to the global Express error handler.
 * This eliminates the need for try-catch blocks in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
