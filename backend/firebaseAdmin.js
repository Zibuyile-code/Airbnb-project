/**
 * @file firebaseAdmin.js
 * @description Initializes Firebase Admin SDK and exports the storage bucket instance.
 *
 * Loads service account credentials from the FIREBASE_ADMIN_KEY environment variable,
 * sets up Firebase Admin with those credentials, and connects to a specified storage bucket.
 *
 * @usage
 * const { admin, bucket } = require('./firebaseAdmin');
 */
require('dotenv').config();
const admin = require('firebase-admin');

let bucket = null;

if (process.env.FIREBASE_ADMIN_KEY) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'air-bnb-storage.firebasestorage.app',
      });
    }

    bucket = admin.storage().bucket();
    console.log('✅Firebase has been initialized');
  } catch (error) {
    console.warn('⚠️ Firebase disabled: invalid FIREBASE_ADMIN_KEY');
  }
} else {
  console.warn('⚠️ Firebase disabled: FIREBASE_ADMIN_KEY not set');
}

/**
 * @exports admin - Firebase Admin SDK instance
 * @exports bucket - Firebase Storage bucket instance
 */
module.exports = { admin, bucket };
