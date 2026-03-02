import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { listingAPI } from '../utils/api';
import { validateListingForm } from '../utils/validation';
import { LOCATION_NAMES } from '../utils/locations';
import '../styles/ListingForm.css';

const PROPERTY_TYPES = [
  'apartment',
  'house',
  'condo',
  'villa',
  'cottage',
];

const AMENITIES = [
  'WiFi',
  'Kitchen',
  'Air conditioning',
  'Heating',
  'Washer',
  'Dryer',
  'Parking',
  'Pool',
  'Hot tub',
  'Gym',
  'TV',
  'Workspace',
];

const toMultilineText = (value) => (Array.isArray(value) ? value.join('\n') : '');
const parseMultilineText = (value) =>
  String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const ListingForm = ({ isEditMode = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    price: '',
    weeklyDiscount: '',
    cleaningFee: '',
    serviceFee: '',
    occupancyTaxes: '',
    bedrooms: '',
    bathrooms: '',
    guests: '',
    amenities: [],
    hostName: '',
    hostJoined: '',
    hostResponseRate: '',
    hostResponseTime: '',
    hostBadgesText: '',
    houseRulesText: '',
    healthSafetyText: '',
    cancellationPolicyText: '',
    footerSupportText: '',
    footerCommunityText: '',
    footerHostingText: '',
    footerAboutText: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await listingAPI.getListing(id);
        setFormData({
          title: response.data.listing.title || '',
          description: response.data.listing.description || '',
          location: response.data.listing.location || '',
          type: response.data.listing.type || '',
          price: response.data.listing.price || '',
          weeklyDiscount: response.data.listing.weeklyDiscount || '',
          cleaningFee: response.data.listing.cleaningFee || '',
          serviceFee: response.data.listing.serviceFee || '',
          occupancyTaxes: response.data.listing.occupancyTaxes || '',
          bedrooms: response.data.listing.bedrooms || '',
          bathrooms: response.data.listing.bathrooms || '',
          guests: response.data.listing.guests || '',
          amenities: response.data.listing.amenities || [],
          hostName: response.data.listing.hostName || '',
          hostJoined: response.data.listing.hostJoined || '',
          hostResponseRate: response.data.listing.hostResponseRate || '',
          hostResponseTime: response.data.listing.hostResponseTime || '',
          hostBadgesText: toMultilineText(response.data.listing.hostBadges),
          houseRulesText: toMultilineText(response.data.listing.houseRules),
          healthSafetyText: toMultilineText(response.data.listing.healthSafety),
          cancellationPolicyText: toMultilineText(response.data.listing.cancellationPolicy),
          footerSupportText: toMultilineText(response.data.listing.footerSupport?.support),
          footerCommunityText: toMultilineText(response.data.listing.footerSupport?.community),
          footerHostingText: toMultilineText(response.data.listing.footerSupport?.hosting),
          footerAboutText: toMultilineText(response.data.listing.footerSupport?.about),
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode && id) {
      fetchListing();
    }
  }, [isEditMode, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prevState) => {
      const amenities = prevState.amenities.includes(amenity)
        ? prevState.amenities.filter((a) => a !== amenity)
        : [...prevState.amenities, amenity];
      return {
        ...prevState,
        amenities,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateListingForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      ...formData,
      hostBadges: parseMultilineText(formData.hostBadgesText),
      houseRules: parseMultilineText(formData.houseRulesText),
      healthSafety: parseMultilineText(formData.healthSafetyText),
      cancellationPolicy: parseMultilineText(formData.cancellationPolicyText),
      footerSupport: {
        support: parseMultilineText(formData.footerSupportText),
        community: parseMultilineText(formData.footerCommunityText),
        hosting: parseMultilineText(formData.footerHostingText),
        about: parseMultilineText(formData.footerAboutText),
      },
    };

    try {
      if (isEditMode) {
        await listingAPI.updateListing(id, payload);
      } else {
        await listingAPI.createListing(payload);
      }
      navigate('/listings');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        `Failed to ${isEditMode ? 'update' : 'create'} listing`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading listing...</div>;
  }

  return (
    <div className="listing-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Listing' : 'Create New Listing'}</h1>
        <p>{isEditMode ? 'Update your property details' : 'Add a new property to your portfolio'}</p>
      </div>

      {error && <div style={{ color: '#d32f2f', marginBottom: '20px' }}>{error}</div>}

      <form className="listing-form" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-section">
          <h2>Basic Information</h2>

          <div className="form-row full">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Cozy apartment in downtown"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>
          </div>

          <div className="form-row full">
            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property..."
                className={errors.description ? 'error' : ''}
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={errors.location ? 'error' : ''}
              >
                <option value="">Select location</option>
                {LOCATION_NAMES.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              {errors.location && (
                <span className="error-message">{errors.location}</span>
              )}
            </div>

            <div className="form-group">
              <label>Property Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={errors.type ? 'error' : ''}
              >
                <option value="">Select property type</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              {errors.type && (
                <span className="error-message">{errors.type}</span>
              )}
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="form-section">
          <h2>Property Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Bedrooms *</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                min="1"
                className={errors.bedrooms ? 'error' : ''}
              />
              {errors.bedrooms && (
                <span className="error-message">{errors.bedrooms}</span>
              )}
            </div>

            <div className="form-group">
              <label>Bathrooms *</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                min="1"
                className={errors.bathrooms ? 'error' : ''}
              />
              {errors.bathrooms && (
                <span className="error-message">{errors.bathrooms}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Guests *</label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                min="1"
                className={errors.guests ? 'error' : ''}
              />
              {errors.guests && (
                <span className="error-message">{errors.guests}</span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="form-section">
          <h2>Pricing</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Price per Night ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={errors.price ? 'error' : ''}
              />
              {errors.price && (
                <span className="error-message">{errors.price}</span>
              )}
            </div>

            <div className="form-group">
              <label>Weekly Discount (%)</label>
              <input
                type="number"
                name="weeklyDiscount"
                value={formData.weeklyDiscount}
                onChange={handleInputChange}
                min="0"
                max="100"
                className={errors.weeklyDiscount ? 'error' : ''}
              />
              {errors.weeklyDiscount && (
                <span className="error-message">{errors.weeklyDiscount}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cleaning Fee ($)</label>
              <input
                type="number"
                name="cleaningFee"
                value={formData.cleaningFee}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={errors.cleaningFee ? 'error' : ''}
              />
              {errors.cleaningFee && (
                <span className="error-message">{errors.cleaningFee}</span>
              )}
            </div>

            <div className="form-group">
              <label>Service Fee ($)</label>
              <input
                type="number"
                name="serviceFee"
                value={formData.serviceFee}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={errors.serviceFee ? 'error' : ''}
              />
              {errors.serviceFee && (
                <span className="error-message">{errors.serviceFee}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Occupancy Taxes ($)</label>
              <input
                type="number"
                name="occupancyTaxes"
                value={formData.occupancyTaxes}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={errors.occupancyTaxes ? 'error' : ''}
              />
              {errors.occupancyTaxes && (
                <span className="error-message">{errors.occupancyTaxes}</span>
              )}
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="form-section">
          <h2>Amenities</h2>

          <div className="amenities-list">
            {AMENITIES.map((amenity) => (
              <div key={amenity} className="amenity-checkbox">
                <input
                  type="checkbox"
                  id={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                />
                <label htmlFor={amenity}>{amenity}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Listing Information (Optional)</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Host Name</label>
              <input
                type="text"
                name="hostName"
                value={formData.hostName}
                onChange={handleInputChange}
                placeholder="e.g., Ghazal"
              />
            </div>

            <div className="form-group">
              <label>Host Joined</label>
              <input
                type="text"
                name="hostJoined"
                value={formData.hostJoined}
                onChange={handleInputChange}
                placeholder="e.g., May 2021"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Host Response Rate</label>
              <input
                type="text"
                name="hostResponseRate"
                value={formData.hostResponseRate}
                onChange={handleInputChange}
                placeholder="e.g., 100%"
              />
            </div>

            <div className="form-group">
              <label>Host Response Time</label>
              <input
                type="text"
                name="hostResponseTime"
                value={formData.hostResponseTime}
                onChange={handleInputChange}
                placeholder="e.g., within an hour"
              />
            </div>
          </div>

          <div className="form-row full">
            <div className="form-group">
              <label>Host Badges (one per line)</label>
              <textarea
                name="hostBadgesText"
                value={formData.hostBadgesText}
                onChange={handleInputChange}
                placeholder={'12 Reviews\nIdentity verified\nSuperhost'}
              />
            </div>
          </div>

          <div className="form-row full">
            <div className="form-group">
              <label>House Rules (one per line)</label>
              <textarea
                name="houseRulesText"
                value={formData.houseRulesText}
                onChange={handleInputChange}
                placeholder={'Check-in: After 4:00 PM\nCheckout: 10:00 AM\nNo smoking'}
              />
            </div>
          </div>

          <div className="form-row full">
            <div className="form-group">
              <label>Health &amp; Safety (one per line)</label>
              <textarea
                name="healthSafetyText"
                value={formData.healthSafetyText}
                onChange={handleInputChange}
                placeholder={'Smoke alarm\nCarbon monoxide alarm\nCleaning process'}
              />
            </div>
          </div>

          <div className="form-row full">
            <div className="form-group">
              <label>Cancellation Policy (one per line)</label>
              <textarea
                name="cancellationPolicyText"
                value={formData.cancellationPolicyText}
                onChange={handleInputChange}
                placeholder={'Free cancellation before Feb 14'}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Footer Support Links (one per line)</label>
              <textarea
                name="footerSupportText"
                value={formData.footerSupportText}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Footer Community Links (one per line)</label>
              <textarea
                name="footerCommunityText"
                value={formData.footerCommunityText}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Footer Hosting Links (one per line)</label>
              <textarea
                name="footerHostingText"
                value={formData.footerHostingText}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Footer About Links (one per line)</label>
              <textarea
                name="footerAboutText"
                value={formData.footerAboutText}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="button-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting
              ? 'Saving...'
              : isEditMode
              ? 'Update Listing'
              : 'Create Listing'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/listings')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListingForm;
