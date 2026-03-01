/**
 * @file User Routes
 * @description Defines RESTful routes for user authentication, profile management, and account operations.
 */
const express = require('express');

// middleware for authentication and authorization
const auth = require('../middleware/auth');
// Middleware for handling user image uploads and resizing
const mediaUpload = require('../middleware/mediaUpload');

const router = express.Router();

/**
 * @route POST /signup
 * @desc Signup a regular user
 * @access Public
 * @middleware auth.setRole('user') - Sets role to 'user'
 * @middleware auth.signUp - Creates user and sends JWT cookie
 */
router.post(
  '/signup',
  // mediaUpload.uploadUserImage,
  // mediaUpload.resizeUserImage,
  auth.setRole('user'),
  auth.signUp,
);
/**
 * @route POST /signup/host
 * @desc Signup a host user
 * @access Public
 * @middleware auth.setRole('host') - Sets role to 'host'
 * @middleware auth.signUp - Creates host and sends JWT cookie
 */
router.post('/signup/host', auth.setRole('host'), auth.signUp);

/**
 * @route POST /login
 * @desc Login user and return JWT cookie
 * @access Public
 */
router.post('/login', auth.login);

/**
 * @route POST /logout
 * @desc Logout user by clearing JWT cookie
 * @access Public
 */
router.post('/logout', auth.logout);

/**
 * @route GET /host/:host_id
 * @desc Get public profile of a host by ID
 * @access Public
 */
router.get('/host/:host_id', auth.getHost);

/**
 * Protect all routes below this line
 * Ensures user is authenticated before accessing profile routes
 */
router.use(auth.protect);

/**
 * @route PATCH /upload-profile-image
 * @desc Upload and resize user profile image
 * @access Protected
 * @middleware mediaUpload.uploadUserImage - Multer upload
 * @middleware mediaUpload.resizeUserImage - Resize and upload to Firebase
 * @middleware auth.updateUserImage - Save image metadata
 */
router.patch(
  '/upload-profile-image',
  mediaUpload.uploadUserImage,
  mediaUpload.resizeUserImage,
  auth.updateUserImage,
);

/**
 * @route GET /me
 * @desc Get current authenticated user's profile
 * @access Protected
 * @middleware auth.getMe - Sets req.params.id to current user ID
 * @middleware auth.getUser - Fetches user document
 */
router.get('/me', auth.getMe, auth.getUser);

module.exports = router;
