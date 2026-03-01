/**
 * @file APIFeatures Utility
 * @description Provides filtering, sorting, and field limiting for Mongoose queries based on request parameters.
 */
class APIFeatures {
  /**
   * Creates an instance of APIFeatures.
   * @param {Object} query - Mongoose query object
   * @param {Object} queryString - Express request query parameters
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Filters the query based on request parameters.
   * Supports advanced filtering with operators: gte, gt, lte, lt.
   * Excludes reserved fields: page, sort, limit, fields.
   *
   * @returns {APIFeatures} The current APIFeatures instance
   */

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // Remove excluded fields
    excludedFields.forEach((el) => delete queryObj[el]);

    //  Advanced Filtering
    // 1B) convert the object into a string, by stringify it
    // replace the gt, gte, lt, lte by appending the $ e.g gte -> $gte
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  /**
   * Sorts the query results based on request parameters.
   * Supports multiple fields separated by commas.
   * Defaults to descending `createdAt` if no sort is provided.
   *
   * @returns {APIFeatures} The current APIFeatures instance
   */

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');

      this.query = this.query.sort(sortBy);
      // sort('price ratingsAverage)
    } else {
      // default order, where the latest are shown first
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /**
   * Limits the fields returned in the query results.
   * Supports comma-separated field selection.
   * Defaults to excluding `__v` if no fields are specified.
   *
   * @returns {APIFeatures} The current APIFeatures instance
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }
}

module.exports = APIFeatures;
