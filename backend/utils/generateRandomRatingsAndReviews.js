/**
 * @file generateRandomRatingsAndReviews Utility
 * @description Generates mock rating and review count for seeding or demo purposes.
 */

/**
 * Generates a random rating between 4.0 and 5.0 (inclusive)
 * and a random review count between 1 and 500.
 *
 * @function generateRandomReviewsAndRatings
 * @returns {{ rating: string, reviewCount: number }} An object containing a rating and review count
 *
 * @example
 * const { rating, reviewCount } = generateRandomReviewsAndRatings();
 * // rating: "4.7", reviewCount: 312
 */
exports.generateRandomReviewsAndRatings = () => {
  const rating = (Math.random() * 1 + 4).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 500) + 1;
  return { rating, reviewCount };
};
