/**
 * Authentication and user-related controller functions.
 * Handles signup, login, role assignment, route protection, user retrieval, and image updates.
 */

const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/User');
const { getOne } = require('../controllers/handleFactory');
const deleteUnmatchedImages = require('../utils/deleteUnmatchedImages');

/**
 * Signs a JWT token for a given user ID.
 *
 * @function signToken
 * @param {string} id - User ID
 * @returns {string} Signed JWT token
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

/**
 * Creates and sends a JWT token via cookie, and returns user data in response.
 *
 * @function createAndSendToken
 * @param {Object} user - User document
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
    cookieOptions.sameSite = 'None';
  }
  // We need to send the jwt as a cookie, no saving in the local storage
  res.cookie('jwt', token, cookieOptions);
  // We do not want to send the password back
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

/**
 * Signs up a new user and sends back a JWT token.
 *
 * @function signUp
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.signUp = catchAsync(async (req, res, next) => {
  // Creates a new user

  const newUser = await User.create({
    // ...(req.tempUserId && { _id: req.tempUserId }),
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    // photo: req.body.photo,
  });

  createAndSendToken(newUser, 201, res);
});

/**
 * Logs in a user and returns a JWT token.
 *
 * @function login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.login = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  const loginIdentifier = username || email;

  // 1. Check if password or email was provided
  // if no password or email, bad request, invalid data
  if (!loginIdentifier || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2. Check if the user exist and if the password is correct
  // Get our user based on the email, and enable the password field
  const userQuery = String(loginIdentifier).includes('@')
    ? { email: String(loginIdentifier).toLowerCase() }
    : { username: loginIdentifier };

  const user = await User.findOne(userQuery).select('+password');

  //  use does not exist or password is wrong, user failed t authenticate
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3. If everything is okay, send token to the client

  createAndSendToken(user, 200, res);
});

/**
 * Middleware to set a specific role on the request body.
 *
 * @function setRole
 * @param {string} role - Role to assign (e.g., 'user', 'host')
 * @returns {Function} Express middleware
 */
exports.setRole = (role) => (req, res, next) => {
  if (!req.body)
    return next(new AppError('Please provide necessary data', 400));

  console.log('About to set roles to', req.body.role);
  // Set the role
  req.body.role = role;

  console.log(req.body.role);
  next();
};

/**
 * Middleware to protect routes by verifying JWT token.
 *
 * @function protect
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.protect = catchAsync(async (req, res, next) => {
  // This function will be used to protect the routes
  // It will check if the user is authenticated
  // If the user is authenticated, it will set the user object on the request
  // If the user is not authenticated, it will return an error
  // we can then use this user on other routes

  let token;
  if (
    req.headers?.authorization &&
    req.headers.authorization.startsWith('Bearer') &&
    req.headers.authorization.split(' ')[1]
  ) {
    token = req.headers.authorization.split(' ')[1];

    // send by cookies
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError('You are not logged in! Please login to gain access', 401),
    );

  // we get the decoded data
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // get the current user

  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('he user belonging to the token does no longer exist.', 401),
    );

  // we put our user on the request object to be used by the subsequent middleware

  req.user = currentUser;
  next();
});

/**
 * Logs out the user by clearing the JWT cookie.
 *
 * @function logout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/', // must match original
  });

  res.status(200).json({
    status: 'success',
  });
};

/**
 * Middleware to restrict access based on user roles.
 *
 * @function restrictTo
 * @param {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 */
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // checks if user role is allowed t perform the subsequent action in the middleware
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };

/**
 * Middleware to set the host ID on the request body.
 *
 * @function setHostId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.setHostId = (req, res, next) => {
  req.body.host_id = req.user._id;
  next();
};

/**
 * Middleware to set the current user's ID on the request params.
 *
 * @function getMe
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

/**
 * Retrieves a user by ID using a generic factory handler.
 *
 * @function getUser
 */
exports.getUser = getOne(User);

/**
 * Updates the current user's image and returns public data.
 *
 * @function updateUserImage
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateUserImage = catchAsync(async (req, res, next) => {
  // 1. cleanup prev images

  // 2. update the image
  const updatedDoc = await User.findByIdAndUpdate(
    req.user._id,
    {
      photo: req.body.photo,
      photoPath: req.body.photoPath,
    },
    { new: true, runValidators: true },
  ).select('-_id');

  // 3. send back the data not token, (the image is public data)
  res.status(200).json({
    status: 'success',
    data: {
      data: updatedDoc,
    },
  });
});

/**
 * Retrieves public host data by host ID.
 *
 * @function getHost
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getHost = catchAsync(async (req, res, next) => {
  const { host_id } = req.params;

  const doc = await User.findById(host_id).select(
    '-email -password -username -__v',
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
