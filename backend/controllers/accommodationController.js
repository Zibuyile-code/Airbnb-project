/**
/**
 * Accommodation Controller
 * Handles CRUD operations and image management for accommodations.
 * Uses factory functions for standard operations and custom logic for image deletion and host-specific listings.
 */
const { bucket } = require('../firebaseAdmin');
const Accommodation = require('../models/Accommodation');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

// Place our controllers into an exports object
/**
 * Get all accommodations
 * @route GET /api/accommodations
 */
exports.getAllAccommodations = factory.getAll(Accommodation);

/**
 * Get a single accommodation by ID
 * @route GET /api/accommodations/:id
 */
exports.getAccommodation = factory.getOne(Accommodation);

/**
 * Create a new accommodation
 * @route POST /api/accommodations
 */
exports.createAccommodation = factory.createOne(Accommodation);

/**
 * Update an accommodation by ID
 * @route PATCH /api/accommodations/:id
 */
exports.updateAccommodation = factory.updateOne(Accommodation);

/**
 * Delete an accommodation by ID
 * @route DELETE /api/accommodations/:id
 */
exports.deleteAccommodation = factory.deleteOne(Accommodation);

/**
 * Delete all images for an accommodation
 * @route DELETE /api/accommodations/:id/images
 */
exports.deleteAccommodationImages = catchAsync(async (req, res, next) => {
  const accommodation = await Accommodation.findById(req.params.id);
  if (!accommodation) return next();

  const { images = [] } = accommodation;

  if (images.length > 0) {
    await Promise.all(
      images.map(async ({ path }) => {
        try {
          await bucket.file(path).delete();
          console.log(`🗑️ Deleted: ${path}`);
        } catch (err) {
          console.error(`❌ Failed to delete ${path}:`, err.message);
        }
      }),
    );
  }

  next();
});

/**
 * Remove a single image from an accommodation
 * @route PATCH /api/accommodations/:id/images
 */
exports.removeAccommodationImage = catchAsync(async (req, res, next) => {
  const { imagePath } = req.body;

  // 🔥 Step 1: Delete image from Firebase
  try {
    await bucket.file(imagePath).delete();
    console.log(`🗑️ Deleted from Firebase: ${imagePath}`);
  } catch (err) {
    console.error(`❌ Failed to delete ${imagePath}:`, err.message);
  }

  // 🧾 Step 2: Remove image from accommodation.images array
  const accommodation = await Accommodation.findOneAndUpdate(
    {
      _id: req.params.id,
      host_id: req.user.id,
    },
    { $pull: { images: { path: imagePath } } }, // match by path
    { new: true },
  );

  if (!accommodation) {
    return next(new AppError('Accommodation not found or access denied', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Image deleted successfully',
    data: {
      data: accommodation.images,
    },
  });
});

/**
 * Get all accommodations for the current host
 * @route GET /api/accommodations/host/listings
 */
exports.getAllHostAccommodations = catchAsync(async (req, res, next) => {
  // build a query
  const features = new APIFeatures(
    Accommodation.find({ host_id: req.user._id }),
    req.query,
  ).filter();

  // await our query
  const docs = await features.query;

  // const accommodations = Acc
  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      data: docs,
    },
  });
});

exports.getLocationsSummary = catchAsync(async (req, res, next) => {
  // Aggregate Pipeline
  const doc = await Accommodation.aggregate([
    {
      $group: {
        _id: null,
        locations: { $addToSet: '$location' },
        maxGuest: { $max: '$maxGuests' },
        minGuest: { $min: '$maxGuests' },
        type: { $addToSet: '$type' },
      },
    },
    {
      $project: {
        _id: 0,
        locations: 1,
        maxGuest: 1,
        minGuest: 1,
        type: 1,
      },
    },
  ]);

  // Response
  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
