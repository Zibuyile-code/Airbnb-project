/**
 * Normalizes passed fields so that they are always arrays even if one value is provided
 * Our Accommodation schema expects arrays on fields such as amenities[]
 */
const normalizeArrayFields =
  (...fields) =>
  (req, res, next) => {
    /**
     * Works for undefined fields or single fields,
     * Our schema expects these fields to be arrays
     */
    fields.forEach((field) => {
      const value = req.body[field];
      /**
       * If the req.body[field] does not exist set it to an empty array
       */
      if (value === undefined) {
        req.body[field] = [];
      } else if (!Array.isArray(value)) {
        /**
         * If the value is not an array set it to an array
         */
        req.body[field] = [value];
      }
    });

    next();
  };
module.exports = normalizeArrayFields;
