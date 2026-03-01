const factory = require('./handleFactory');
const Reservation = require('../models/Reservation');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * Create a new reservation
 * @route POST /api/reservations
 */
exports.createReservation = factory.createOne(Reservation);

/**
 * Get all reservations
 * @route GET /api/reservations
 */
exports.getReservations = factory.getAll(Reservation);

/**
 * Delete a reservation by ID
 * @route DELETE /api/reservations/:id
 */
exports.deleteReservation = catchAsync(async (req, res, next) => {
  const query = { _id: req.params.id };

  if (req.queryId.host_id) {
    query.host_id = req.queryId.host_id;
  }

  if (req.queryId.user_id) {
    query.user_id = req.queryId.user_id;
  }

  const deletedDoc = await Reservation.findOneAndDelete(query);

  // 1) if the ID is valid but the document does not exist, send an error;

  // 2) check if we have a deleted document
  if (!deletedDoc)
    return next(
      new AppError(
        'Document not found. It may have been deleted or not belong to your account.',
        404,
      ),
    );

  // 3)
  res.status(200).json({
    status: 'success',
    message: 'Document deleted successfully',
  });
});
