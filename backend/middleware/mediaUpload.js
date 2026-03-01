/**
 * Middleware for handling image uploads, resizing, and Firebase storage.
 * Supports user profile images and accommodation gallery uploads.
 */
const sharp = require('sharp');
const multer = require('multer');
const { bucket } = require('../firebaseAdmin');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const fsHelper = require('../utils/fsHelper');
const Accommodation = require('../models/Accommodation');

const ensureFirebaseBucket = (next) => {
  if (!bucket) {
    return next(
      new AppError(
        'Image uploads are unavailable because Firebase is not configured',
        503,
      ),
    );
  }
  return null;
};

/**
 * Multer memory storage configuration.
 * Stores uploaded files in memory for further processing.
 */
const multerStorage = multer.memoryStorage();

/**
 * Multer file filter to allow only image uploads.
 *
 * @function multerFilter
 * @param {Object} req - Express request object
 * @param {Object} file - Uploaded file object
 * @param {Function} cb - Callback to signal acceptance or rejection
 */
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

/**
 * Multer middleware to handle multiple accommodation images.
 * Accepts up to 10 images under the field name 'images'.
 */
exports.uploadAccommodationImages = upload.array('images', 10);

exports.uploadUserImage = upload.single('photo');

/**
 * Resizes and uploads user profile image to Firebase.
 * Deletes previous image if it exists and attaches new URL and path to request body.
 *
 * @function resizeUserImage
 */
exports.resizeUserImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const firebaseError = ensureFirebaseBucket(next);
  if (firebaseError) return firebaseError;

  const id = req.user._id;

  // 🔥 Step 1: Delete old image if it exists
  if (req.user.photoPath) {
    try {
      await bucket.file(req.user.photoPath).delete();
      console.log(`🗑️ Deleted old image: ${req.user.photoPath}`);
    } catch (err) {
      console.error('❌ Failed to delete old image:', err.message);
    }
  }

  // Step 2: Resize and upload new image
  const fileName = `users/user-${id}-${Date.now()}.jpeg`;

  const resizedBuffer = await sharp(req.file.buffer)
    .resize(300, 300)
    .toFormat('jpeg')
    .jpeg({ quality: 80, progressive: true, chromaSubsampling: '4:4:4' })
    .toBuffer();

  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    metadata: { contentType: 'image/jpeg' },
  });

  await new Promise((resolve, reject) => {
    blobStream.on('error', reject);
    blobStream.on('finish', resolve);
    blobStream.end(resizedBuffer);
  });

  // 🔗 Step 3: Generate signed URL
  const [url] = await blob.getSignedUrl({
    action: 'read',
    expires: '03-01-2030',
  });

  // 🧾 Step 4: Attach to request body
  req.body.photo = url;
  req.body.photoPath = fileName;

  next();
});

/**
 * Resizes and uploads accommodation images to Firebase.
 * Stores signed URLs and paths in `req.body.images`.
 *
 * @function resizeAccommodationImages
 */
exports.resizeAccommodationImages = catchAsync(async (req, res, next) => {
  // Set Images to an empty array
  req.body.images = [];
  if (!req.files) return next();

  const firebaseError = ensureFirebaseBucket(next);
  if (firebaseError) return firebaseError;

  /**
   * Get our ID from req.params
   */
  const { id } = req.params;

  // 2. Using Fire Storage

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `accommodations/${id}/accommodation-${id}-${Date.now()}-${i + 1}.jpeg`;

      // Resize image in memory
      const resizedBuffer = await sharp(file.buffer)
        .resize(1440, 960, { fit: 'cover' })
        .toFormat('jpeg')
        .jpeg({ quality: 90, progressive: true, chromaSubsampling: '4:4:4' })
        .toBuffer();

      console.log(`🖼️ Resized image ${i + 1}: ${resizedBuffer.length} bytes`);

      // Upload to Firebase
      const blob = bucket.file(filename);
      const blobStream = blob.createWriteStream({
        metadata: { contentType: 'image/jpeg' },
      });

      await new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
          console.log('FIrebase error', err);
          reject(err);
        });
        blobStream.on('finish', resolve);
        blobStream.end(resizedBuffer);
      });

      // Generate signed URL
      const [url] = await blob.getSignedUrl({
        action: 'read',
        expires: '03-01-2030',
      });

      console.log(`✅ Uploaded image ${i + 1}:`, { path: filename, url });

      // Push to req.body.images
      req.body.images.push({ path: filename, url });
    }),
  );

  next();
});

// 1. know what is the method are we replacing, amending or deleting

// if we are replacing, we need to get all the images
//  then delete them from our server
// save our new images and generate urls
// then save the urls to the server

// if we are appending,
// generate our image urls
// then we append and save the images on the server

/**
 * Determines whether to replace or append accommodation images.
 * If replacing, deletes existing images from Firebase.
 *
 * @function updateAccommodationImages
 */
exports.updateAccommodationImages = catchAsync(async (req, res, next) => {
  if (!req.body.mode || req.body.mode === 'replace') {
    req.body.mode = 'replace';
    const { images } = await Accommodation.findById(req.params.id);
    await fsHelper.deleteFiles(images);
    return next();
  }
  req.body.mode = 'append';
  next();
});
