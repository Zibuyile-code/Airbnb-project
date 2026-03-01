// Validation functions for form inputs

export const validateEmail = (email) => {
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateNumber = (value, min = 0, max = Infinity) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

export const validateListingForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.title)) {
    errors.title = 'Title is required';
  }

  if (!validateRequired(formData.description)) {
    errors.description = 'Description is required';
  }

  if (!validateRequired(formData.location)) {
    errors.location = 'Location is required';
  }

  if (!formData.type) {
    errors.type = 'Property type is required';
  }

  if (!validateNumber(formData.price, 1)) {
    errors.price = 'Price must be a positive number';
  }

  if (!validateNumber(formData.bedrooms, 1)) {
    errors.bedrooms = 'Bedrooms must be at least 1';
  }

  if (!validateNumber(formData.bathrooms, 1)) {
    errors.bathrooms = 'Bathrooms must be at least 1';
  }

  if (!validateNumber(formData.guests, 1)) {
    errors.guests = 'Guests must be at least 1';
  }

  if (!validateNumber(formData.weeklyDiscount, 0, 100)) {
    errors.weeklyDiscount = 'Weekly discount must be between 0 and 100';
  }

  if (!validateNumber(formData.cleaningFee, 0)) {
    errors.cleaningFee = 'Cleaning fee must be a non-negative number';
  }

  if (!validateNumber(formData.serviceFee, 0)) {
    errors.serviceFee = 'Service fee must be a non-negative number';
  }

  if (!validateNumber(formData.occupancyTaxes, 0)) {
    errors.occupancyTaxes = 'Occupancy taxes must be a non-negative number';
  }

  return errors;
};
