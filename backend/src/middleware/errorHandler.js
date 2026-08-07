/**
 * Global Error Handler Middleware
 * Normalizes different error types (Prisma, Zod, JWT, generic) into a consistent JSON response.
 * Prevents sensitive stack traces from leaking in production.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = null;

  // ─── Prisma Database Errors ───
  if (err.code) {
    if (err.code === 'P2002') {
      // Unique constraint failed
      statusCode = 409;
      message = 'Duplicate record found. This data already exists.';
      details = { target: err.meta?.target };
    } else if (err.code === 'P2025') {
      // Record not found
      statusCode = 404;
      message = 'Requested record not found.';
    } else if (err.code.startsWith('P2')) {
      // Other query engine errors
      statusCode = 400;
      message = 'Database operation failed due to invalid data constraints.';
    }
  }

  // ─── JWT Authentication Errors ───
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication session expired. Please log in again.';
  }

  // ─── Zod Validation Errors ───
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Data validation failed.';
    details = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
  }

  // ─── Log Error ───
  // In production, you would send this to a logging service (Datadog, Sentry, Winston)
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction || statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.error(`Error: ${message}`);
    if (details) console.error('Details:', details);
    if (!isProduction && err.stack) console.error(err.stack);
  }

  // ─── Send Response ───
  res.status(statusCode).json({
    error: message,
    ...(details && { details }),
    ...(isProduction ? {} : { stack: err.stack }) // Only send stack in dev mode
  });
};

module.exports = errorHandler;
