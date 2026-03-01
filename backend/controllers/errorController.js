// Global Error Controller

// Technical Errors In Development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
};

/**
 * Global error handling middleware
 * Handles operational and programming errors, sends appropriate responses.
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports = (err, req, res, next) => {
  //   status Code & status
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  sendErrorDev(err, res);
};
