/**
 * @file catchAsync Utility
 * @description Wraps async route handlers to catch errors and pass them to Express error middleware.
 */

/**
 * Wraps an async function and automatically forwards any errors to Express error handling middleware.
 * Prevents repetitive try/catch blocks in route handlers.
 *
 * @function catchAsync
 * @param {Function} fn - An async Express route handler (req, res, next)
 * @returns {Function} Wrapped Express middleware with error forwarding
 *
 * @example
 * // Usage in a route
 * router.get('/example', catchAsync(async (req, res, next) => {
 *   const data = await SomeModel.find();
 *   res.status(200).json({ data });
 * }));
 */
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
