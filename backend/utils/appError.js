/**
 * @file AppError Utility
 * @description Custom error class for operational errors, used for consistent error handling across the app.
 */
class AppError extends Error {
  /**
   * Creates a new AppError instance.
   * @param {string} message - Error message to display
   * @param {number} statusCode - HTTP status code associated with the error
   */
  constructor(message, statusCode) {
    super(message);

    /**
     * @property {number} statusCode - HTTP status code
     */
    this.statusCode = statusCode;

    /**
     * @property {'fail'|'error'} status - Error status label based on code
     */
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    /**
     * @property {boolean} isOperational - Flag to identify trusted operational errors
     */
    this.isOperational = true;

    // Removes constructor from stack trace for cleaner debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
