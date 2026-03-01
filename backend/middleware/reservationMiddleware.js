/**
 * Middleware for enriching requests with user and host context,
 * and for scoping queries based on user roles.
 */
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Accommodation = require('../models/Accommodation');

/**
 * Appends the authenticated user's ID, name, and username to the request body.
 * Prevents clients from spoofing `user_id` manually.
 *
 * @function appendUserId
 * @param {Object} req - Express request object (must include `req.user`)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.appendUserId = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError('Please signup', 400));

  req.body.user_id = req.user._id;
  req.body.user = req.user.name;
  req.body.username = req.user.username;

  next();
});

/**
 * Appends the host's username to the request body based on accommodation ID.
 * Requires `req.body._id` to identify the accommodation.
 *
 * @function appendHostIdAndUsername
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {AppError} If accommodation ID is missing
 *
 * @note ⚠️ Logic issue: `Accommodation.find({ id: ... })` should likely be `findById(...)`
 *       Also, `user.username` will not exist on an array result — needs fix.
 */
exports.appendHostIdAndUsername = catchAsync(async (req, res, next) => {
  if (!req.body._id)
    return next(new AppError('Please provide the accommodation ID', 401));
  const user = await Accommodation.find({
    id: req.body.accommodationId,
  }).populate('host_id');

  req.body.username = user.username;

  next();
});

/**
 * Sets a scoped query object (`req.queryId`) based on the user's role.
 * Hosts get `host_id`, users get `user_id`.
 *
 * @function setQueryId
 * @param {Object} req - Express request object (must include `req.user`)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.setQueryId = catchAsync(async (req, res, next) => {
  if (!req.user)
    return next(
      new AppError('You do not have permission to access this endpoint', 401),
    );

  if (req.user.role === 'host') req.queryId = { host_id: req.user._id };

  if (req.user.role === 'user') req.queryId = { user_id: req.user._id };

  next();
});

exports.setHostQueryId = catchAsync(async (req, res, next) => {
  if (!req.user)
    return next(
      new AppError('You do not have permission to access this endpoint', 401),
    );

  req.queryId = { host_id: req.user._id };
  next();
});

exports.setUserQueryId = catchAsync(async (req, res, next) => {
  if (!req.user)
    return next(
      new AppError('You do not have permission to access this endpoint', 401),
    );

  req.queryId = { user_id: req.user._id };
  next();
});

/**
 * Placeholder middleware to check if a reservation is available.
 * Currently not implemented.
 *
 * @function isReservationAvailable
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.isReservationAvailable = catchAsync(async (req, res, next) => {
  // TODO: Implement reservation availability logic
});
