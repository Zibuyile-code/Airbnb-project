// Factory is where we return other functions
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * Factory function to get a single document by ID
 * @param {Model} Model - Mongoose model
 * @returns {Function} Express middleware
 */
exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) return next(new AppError('No document found with that Id', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

/**
 * Factory function to get all documents
 * @param {Model} Model - Mongoose model
 * @returns {Function} Express middleware
 */
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // ...existing code...
    const features = new APIFeatures(
      Model.find(req.queryId),
      req.query,
    ).filter();

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

/**
 * Factory function to create a new document
 * @param {Model} Model - Mongoose model
 * @returns {Function} Express middleware
 */
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc;
    /**
     * When we have images we use the created temporary ID
     * Else allow mongoose to create one automatically
     */
    if (req.tempAccId) {
      // Node.js <8.3.0 does not support object spread, use Object.assign
      // Node.js <8.3.0 does not support object spread, use Object.assign
      const data = Object.assign({ _id: req.tempAccId }, req.body);
      doc = await Model.create(data);
    } else {
      doc = await Model.create(req.body);
    }

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

/**
 * Factory function to update a document by ID
 * @param {Model} Model - Mongoose model
 * @returns {Function} Express middleware
 */
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let updatedDoc;
    // 1) We find and update content that matches our _id and that has the host_id we provided
    // find the content that belongs to this user based on its id
    if (req.body.mode === 'append') {
      updatedDoc = await Model.findOneAndUpdate(
        { _id: req.params.id, host_id: req.user._id },
        { $push: { images: req.body.images } },
        {
          new: true,
          runValidators: true,
        },
      );
    } else {
      updatedDoc = await Model.findOneAndUpdate(
        { _id: req.params.id, host_id: req.user._id },
        { $set: req.body },
        {
          new: true,
          runValidators: true,
        },
      );
    }

    //2) if we did not get anything it means we are not authorized to perform this action
    if (!updatedDoc)
      return next(
        new AppError(
          'Document not found. It may have been deleted or not belong to your account.',
          404,
        ),
      );

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedDoc,
      },
    });
  });

/**
 * Factory function to delete a document by ID
 * @param {Model} Model - Mongoose model
 * @returns {Function} Express middleware
 */
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1)
    const deletedDoc = await Model.findOneAndDelete({
      _id: req.params.id,
      host_id: req.user._id,
    });

    // 2) check if we have a deleted document
    if (!deletedDoc)
      return next(
        new AppError(
          'Accommodation not found. It may have been deleted or not belong to your account.',
          404,
        ),
      );

    // 3)
    res.status(200).json({
      status: 'success',
      message: 'Accommodation deleted successfully',
    });
  });
