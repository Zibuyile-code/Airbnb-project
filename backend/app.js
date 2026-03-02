/**
 * @file app.js
 * @description Main entry point for configuring middleware, routes, error handling, and CORS for the backend API.
 *
 * Responsibilities:
 * - Serves static files (uploaded images)
 * - Parses requests and cookies
 * - Configures CORS
 * - Registers API routes
 * - Handles errors and unknown routes
 */
const express = require('express');
const qs = require('qs');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const accommodationRoute = require('./routes/accommodationRoutes');
const reservationRoute = require('./routes/reservationRoutes');
const userRoute = require('./routes/userRoutes');

/**
 * Initialize Express app
 * @constant {Express.Application}
 */
const app = express();

/**
 * Configure CORS to allow requests from specified origins
 * and enable credentials (cookies) for cross-origin requests.
 */
const normalizeOrigin = (value = '') => String(value).trim().replace(/\/$/, '');

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map(normalizeOrigin).filter(Boolean)
  : [];

const isDev = process.env.NODE_ENV === 'development';

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (browser top-level navigation, mobile apps, curl)
      if (!origin) return callback(null, true);

      const normalizedRequestOrigin = normalizeOrigin(origin);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(normalizedRequestOrigin)) {
        return callback(null, true);
      }

      console.warn(`Blocked by CORS: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true, // if you're using cookies
  }),
);

/**
 * Use qs library for parsing query strings with depth of 1
 * Allows nested query parameters like ?filter[price][gte]=100
 */
app.set('query parser', (str) => qs.parse(str, { depth: 1 }));

/**
 * Middleware Setup
 * - Serves static files from /uploads
 * - Parses JSON and URL-encoded bodies
 * - Parses cookies
 */
app.use('/uploads', express.static(path.resolve('./uploads')));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());

/**
 * API Routes
 * Registers user, accommodation, and reservation routes under /api
 */
app.use('/api/users', userRoute);
app.use('/api/accommodations', accommodationRoute);
app.use('/api/reservations', reservationRoute);

/**
 * Enable gzip compression for responses
 */
app.use(compression());

/**
 * Serve React frontend build in production
 */
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.resolve(__dirname, '../frontend/build');
  const hasFrontendBuild = fs.existsSync(frontendBuildPath);

  if (hasFrontendBuild) {
    app.use(express.static(frontendBuildPath));

    app.get('/{*any}', (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) return next();
      return res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
  } else {
    app.get('/', (req, res) => {
      return res.status(200).json({
        status: 'success',
        message: 'Backend API is running',
      });
    });
  }
}

/**
 * Catch-all for unhandled routes
 * Passes error to global error handler for unknown endpoints
 */
app.all('/{*any}', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`), 404);
});
/**
 * Global error handler middleware
 * Handles all errors passed via next()
 */
app.use(globalErrorHandler);

module.exports = app;
