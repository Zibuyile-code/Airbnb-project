/**
 * @file Accommodation Routes
 * @description Defines RESTful routes for accommodation CRUD operations and image management.
 */

const express = require('express');

const accommodationController = require('../controllers/accommodationController');
const auth = require('../middleware/auth');
const mediaUpload = require('../middleware/mediaUpload');
const accMiddleware = require('../middleware/accMiddleware');

const router = express.Router();

/**
 * @route GET /
 * @desc Get all accommodations
 * @access Public
 *
 * @route POST /
 * @desc Create a new accommodation
 * @access Protected (host, super-admin)
 * @middleware auth.protect - Authenticate user
 * @middleware auth.restrictTo - Restrict to host or super-admin
 * @middleware auth.setHostId - Attach host ID after multer parsing
 * @middleware accMiddleware.setDefaultImages - Set placeholder image array
 * @middleware accMiddleware.setReviewsAndRatings - Generate mock reviews and ratings
 */

router
  .route('/')
  .get(accommodationController.getAllAccommodations)
  .post(
    auth.protect,
    auth.restrictTo('host', 'super-admin'),
    auth.setHostId,
    accMiddleware.setDefaultImages,
    accMiddleware.setReviewsAndRatings,
    accommodationController.createAccommodation,
  );

/**
 * @route GET /:id
 * @desc Get a single accommodation by ID
 * @access Public
 */
router.get('/:id', accommodationController.getAccommodation);

/**
 * @route GET /locations/summary
 * @desc Get summary of accommodation locations
 * @access Public
 */
router.get('/locations/summary', accommodationController.getLocationsSummary);

/**
 * Protect all routes below this line
 * @middleware auth.protect - Authenticate user
 * @middleware auth.restrictTo - Restrict to host or super-admin
 */
router.use(auth.protect, auth.restrictTo('host', 'super-admin'));

/**
 * @route GET /host/listings
 * @desc Get all accommodations listed by the current host
 * @access Protected (host, super-admin)
 */
router
  .route('/host/listings')
  .get(accommodationController.getAllHostAccommodations);

/**
 * @route PATCH /:id
 * @desc Update accommodation by ID
 * @access Protected (host, super-admin)
 * @middleware accMiddleware.stripImagesFromBody - Prevent image updates via this route
 * @middleware accMiddleware.stripLocationFromBody - Prevent location updates via this route
 *
 * @route DELETE /:id
 * @desc Delete accommodation and its images
 * @access Protected (host, super-admin)
 */
router
  .route('/:id')
  .patch(
    accMiddleware.stripImagesFromBody,
    accMiddleware.stripLocationFromBody,
    accommodationController.updateAccommodation,
  )
  .delete(
    accommodationController.deleteAccommodationImages,
    accommodationController.deleteAccommodation,
  );

/**
 * @route POST /:id/images
 * @desc Upload new accommodation images (replace or append)
 * @access Protected (host, super-admin)
 * @middleware mediaUpload.uploadAccommodationImages - Multer image upload
 * @middleware accMiddleware.isAccommodationAvailable - Validate ownership
 * @middleware mediaUpload.resizeAccommodationImages - Resize and upload to Firebase
 * @middleware accommodationController.updateAccommodation - Save image metadata
 *
 * @route PATCH /:id/images
 * @desc Append new images to existing accommodation
 * @access Protected (host, super-admin)
 * @middleware mediaUpload.updateAccommodationImages - Determine replace/append mode
 *
 * @route DELETE /:id/images
 * @desc Delete a specific accommodation image
 * @access Protected (host, super-admin)
 */
router
  .route('/:id/images')
  .post(
    mediaUpload.uploadAccommodationImages,
    accMiddleware.isAccommodationAvailable,
    mediaUpload.resizeAccommodationImages,
    accommodationController.updateAccommodation,
  )
  .patch(
    mediaUpload.uploadAccommodationImages,
    mediaUpload.updateAccommodationImages,
    mediaUpload.resizeAccommodationImages,
    accommodationController.updateAccommodation,
  )
  .delete(
    accMiddleware.isAccommodationAvailable,
    accommodationController.removeAccommodationImage,
  );

module.exports = router;
