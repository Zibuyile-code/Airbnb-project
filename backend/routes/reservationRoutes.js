/**
 * @file Reservation Routes
 * @description Defines RESTful routes for reservation CRUD operations and host/user-specific queries.
 */

const express = require('express');
const auth = require('../middleware/auth');
const reservationController = require('../controllers/reservationController');
const reservationMiddleware = require('../middleware/reservationMiddleware');

const router = express.Router();

/**
 * Middleware to protect all reservation routes.
 * Ensures user is authenticated before accessing any endpoint.
 */

router.use(auth.protect);

router.get(
  '/host',
  reservationMiddleware.setHostQueryId,
  reservationController.getReservations,
);

router.get(
  '/user',
  reservationMiddleware.setUserQueryId,
  reservationController.getReservations,
);

/**
 * @route GET /
 * @desc Get reservations for the current user or host
 * @access Protected
 * @middleware reservationMiddleware.setQueryId - Scopes query based on user role
 *
 * @route POST /
 * @desc Create a new reservation
 * @access Protected
 * @middleware reservationMiddleware.appendUserId - Appends user ID from auth context
 * @middleware reservationController.createReservation - Saves reservation and returns it
 */
router
  .route('/')
  .get(reservationMiddleware.setQueryId, reservationController.getReservations)
  .post(
    reservationMiddleware.appendUserId,
    reservationController.createReservation,
  );

/**
 * @route DELETE /:id
 * @desc Delete a reservation by ID
 * @access Protected
 * @middleware reservationMiddleware.setQueryId - Ensures user owns the reservation
 */
router
  .route('/:id')
  .delete(
    reservationMiddleware.setQueryId,
    reservationController.deleteReservation,
  );

module.exports = router;
