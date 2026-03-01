/**
 * @file Reservation Model
 * @description Defines the schema for reservations, including user, accommodation details, booking dates, pricing, and ratings.
 */
const mongoose = require('mongoose');

/**
 * @typedef {Object} SpecificRatings
 * @property {number} cleanliness - Cleanliness rating
 * @property {number} communication - Communication rating
 * @property {number} checkIn - Check-in experience rating
 * @property {number} accuracy - Accuracy of listing rating
 * @property {number} location - Location rating
 * @property {number} value - Value-for-money rating
 */

/**
 * @typedef {Object} Reservation
 * @property {string} title - Accommodation name
 * @property {string} [description] - Optional description
 * @property {'Entire Unit'|'Room'|'Whole Villa'} type - Type of accommodation
 * @property {'Cape Town'|'Paris'|'New York'|'Tokyo'|'London'|'Barcelona'|'Rome'|'Sydney'|'Dubai'|'Bangkok'} location - Location of accommodation
 * @property {string[]} images - Array of image URLs
 * @property {number} maxGuests - Maximum number of guests
 * @property {number} bedrooms - Number of bedrooms
 * @property {number} [rating] - Average rating
 * @property {number} [reviews] - Number of reviews
 * @property {number} price - Price per night
 * @property {boolean} [enhancedCleaning=true] - Whether enhanced cleaning is offered
 * @property {boolean} [selfCheckIn=true] - Whether self check-in is available
 * @property {string[]} [amenities] - List of amenities
 * @property {mongoose.ObjectId} host_id - Reference to host user
 * @property {Date} checkIn - Check-in date
 * @property {Date} checkOut - Check-out date
 * @property {string} [host] - Host name
 * @property {mongoose.ObjectId} user_id - Reference to booking user
 * @property {string} [user] - User name
 * @property {string} [username] - Username of booking user
 * @property {number} [weeklyDiscount] - Weekly discount amount
 * @property {number} [cleaningFee] - Cleaning fee
 * @property {number} [serviceFee] - Service fee
 * @property {number} [occupancyTaxes] - Occupancy taxes
 * @property {SpecificRatings} specificRatings - Detailed rating breakdown
 */

const reservationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an accommodation name'],
    },
    description: String,
    type: {
      type: String,
      enum: ['Entire Unit', 'Room', 'Whole Villa'],
      required: [true, 'Please provide the type of an accommodation'],
    },
    location: {
      type: String,
      enum: [
        'Cape Town',
        'Paris',
        'New York',
        'Tokyo',
        'London',
        'Barcelona',
        'Rome',
        'Sydney',
        'Dubai',
        'Bangkok',
      ],
      required: [true, 'Please select a valid location'],
    },
    images: [String],
    maxGuests: {
      type: Number,
      required: [true, 'Tell us how many guest are allowed at most.'],
      min: [1, 'At least one guest must be allowed.'],
      default: 1,
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please specify how many bedrooms are available'],
      min: [1, 'At least one bedroom must be provided.'],
      default: 1,
    },
    rating: Number,
    reviews: Number,
    price: {
      type: Number,
      required: [true, 'Please provide the price per night'],
      min: [1, 'Accommodation price must be above 1'],
    },
    enhancedCleaning: {
      type: Boolean,
      default: true,
    },
    selfCheckIn: {
      type: Boolean,
      default: true,
    },
    amenities: [String],
    host_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Each accommodation must be associated with a host'],
      immutable: true,
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    host: String,
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Each accommodation must be associated with a user'],
      immutable: true,
    },
    user: String,
    username: String,
    weeklyDiscount: Number,
    cleaningFee: Number,
    serviceFee: Number,
    occupancyTaxes: Number,
    specificRatings: {
      cleanliness: { type: Number, required: true },
      communication: { type: Number, required: true },
      checkIn: { type: Number, required: true },
      accuracy: { type: Number, required: true },
      location: { type: Number, required: true },
      value: { type: Number, required: true },
    },
  },
  { timestamps: true },
);

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
