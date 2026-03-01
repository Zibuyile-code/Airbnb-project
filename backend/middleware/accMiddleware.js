/**
 * Middleware functions for handling accommodation-related request preprocessing.
 * Includes utilities for setting default images, validating ownership, stripping fields,
 * and generating random reviews and ratings.
 */

const Accommodation = require('../models/Accommodation');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const {
  generateRandomReviewsAndRatings,
} = require('../utils/generateRandomRatingsAndReviews');

/**
 * Sets the `images` field in the request body to a default placeholder.
 * This is used when images are uploaded via a separate endpoint.
 *
 * @function setDefaultImages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.setDefaultImages = (req, res, next) => {
  req.body.images = [{ path: '__', url: '__' }];
  next();
};

/**
 * Checks if the accommodation exists and belongs to the authenticated user.
 * Throws a 403 error if not found or unauthorized.
 *
 * @function isAccommodationAvailable
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {AppError} If accommodation is not found or doesn't belong to user
 */
exports.isAccommodationAvailable = catchAsync(async (req, res, next) => {
  if (
    !(await Accommodation.findOne({ _id: req.params.id, host_id: req.user.id }))
  ) {
    return next(
      new AppError(
        "We couldn't find the accommodation, or it may not belong to you.",
        403,
      ),
    );
  }
  next();
});

/**
 * Removes the `images` field from the request body if present.
 * Useful for endpoints that shouldn't accept image updates.
 *
 * @function stripImagesFromBody
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.stripImagesFromBody = (req, res, next) => {
  if ('images' in req.body) {
    delete req.body.images;
  }
  next();
};

/**
 * Removes the `location` field from the request body if present.
 * Useful for endpoints that shouldn't accept location updates.
 *
 * @function stripLocationFromBody
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.stripLocationFromBody = (req, res, next) => {
  if ('location' in req.body) {
    delete req.body.location;
  }
  next();
};

/**
 * Generates random review count and rating, and sets them in the request body.
 * Used for seeding or mocking accommodation data.
 *
 * @function setReviewsAndRatings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.setReviewsAndRatings = (req, res, next) => {
  const { rating, reviewCount } = generateRandomReviewsAndRatings();
  req.body.reviews = reviewCount;
  req.body.rating = rating;
  next();
};
