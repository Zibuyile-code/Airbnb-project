/**
 * @file User Model
 * @description Defines the schema for users, including authentication, profile, and role information.
 */

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

/**
 * @typedef {Object} User
 * @property {string} name - Full name of the user
 * @property {string} email - Unique email address, validated and lowercased
 * @property {string} username - Unique username
 * @property {string} [photo] - Public URL or path to profile photo
 * @property {string} [photoPath] - Internal storage path for photo
 * @property {'user'|'host'} role - Role assigned to the user
 * @property {string} password - Hashed password (not selected by default)
 * @property {string} passwordConfirm - Must match the password on creation
 */

// This is our User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please tell us your name.'] },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Please give us your username'],
  },
  photo: {
    type: String,
    default: 'uploads/defaults/default.jpg',
  },
  photoPath: String,
  role: {
    type: String,
    enum: {
      values: ['user', 'host'],
      message: 'Role is either user or host',
    },
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [8, 'Password must be at least 8 characters long'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password should match',
    },
  },
});

// this is for the password encryption
// We use the document middleware to encrypt our password
// right before we save or create our document

/**
 * Pre-save middleware to hash password before saving.
 * Only runs if password is modified.
 *
 * @function
 * @memberof userSchema
 * @param {Function} next - Express next middleware function
 */
userSchema.pre('save', async function (next) {
  // only run if the password was actually modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 12);
    // reset the password confirm to undefined
    this.passwordConfirm = undefined;
    next();
  } catch (err) {
    next(err);
  }
});

// Static/Instance method for password comparison

/**
 * Compares a candidate password with the hashed password stored in the database.
 *
 * @function correctPassword
 * @memberof userSchema.methods
 * @param {string} candidatePassword - Plain text password entered by user
 * @param {string} userPassword - Hashed password from database
 * @returns {Promise<boolean>} Whether the passwords match
 */
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// This is our User Model
const User = mongoose.model('User', userSchema);
module.exports = User;
