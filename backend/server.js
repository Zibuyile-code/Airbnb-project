/**
 * @file server.js
 * @description Entry point for the backend server.
 * - Loads environment variables
 * - Connects to MongoDB
 * - Initializes Firebase Admin SDK
 * - Starts Express server
 * - Handles unhandled promise rejections
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

/**
 * Load environment variables from config.env file
 */
dotenv.config({ path: './config.env' });

/**
 * Import Express app instance
 */
const app = require('./app');

/**
 * Build MongoDB connection string from environment variables
 * Replaces <PASSWORD> placeholder with actual password
 * @constant {string}
 */
const DB = process.env.DATABASE
  ? process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD || '')
  : null;

/**
 * Connect to MongoDB using Mongoose
 * Logs success or failure
 */
if (DB) {
  mongoose
    .connect(DB)
    .then(() => {
      console.log('DB Connection Successful');
    })
    .catch((err) => console.log(err));
} else {
  console.warn('⚠️ DATABASE is not set. MongoDB connection skipped.');
}

/**
 * Initialize Firebase Admin SDK
 * Required before using Firebase Storage
 */
require('./firebaseAdmin');

/**
 * Start Express server on configured port
 * @constant {number}
 */
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}....`);
});

/**
 * Handle unhandled promise rejections
 * Gracefully shuts down the server and exits process
 */
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 🔥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
