/**
 * Global error handler middleware.
 * Catches unhandled errors from route handlers and sends a clean JSON response.
 */
const errorHandler = (err, req, res, next) => {
  console.error('🔴 Error:', err.message);
  console.error(err.stack);

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Duplicate entry. A record with this value already exists.',
      detail: err.message,
    });
  }

  // MySQL foreign key constraint
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      error: 'Invalid reference. The referenced record does not exist.',
      detail: err.message,
    });
  }

  // Validation errors (thrown manually)
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Default 500
  res.status(500).json({
    error: 'Internal server error.',
    ...(process.env.NODE_ENV !== 'production' && { detail: err.message }),
  });
};

export default errorHandler;
