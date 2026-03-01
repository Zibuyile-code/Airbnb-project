import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/LocationPage.css';
import { listingAPI } from '../utils/api';
import { normalizeLocationName } from '../utils/locations';

const buildFallbackListings = (locationValue) => {
  const fallbackLocation = decodeURIComponent(locationValue || 'Bordeaux');
  return [
    {
      _id: `fallback-1-${fallbackLocation}`,
      title: `${fallbackLocation} Getaway`,
      location: fallbackLocation,
      type: 'Entire home',
      guests: 6,
      bedrooms: 5,
      bathrooms: 3,
      amenities: ['Wifi', 'Kitchen', 'Free Parking'],
      rating: 5.0,
      reviews: 318,
      price: 325,
      mainImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    },
    {
      _id: `fallback-2-${fallbackLocation}`,
      title: 'Charming Waterfront Condo',
      location: fallbackLocation,
      type: 'Entire home',
      guests: 6,
      bedrooms: 5,
      bathrooms: 3,
      amenities: ['Wifi', 'Kitchen', 'Free Parking'],
      rating: 5.0,
      reviews: 318,
      price: 200,
      mainImage: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80',
    },
    {
      _id: `fallback-3-${fallbackLocation}`,
      title: 'Historic City Center Home',
      location: fallbackLocation,
      type: 'Entire home',
      guests: 6,
      bedrooms: 5,
      bathrooms: 3,
      amenities: ['Wifi', 'Kitchen', 'Free Parking'],
      rating: 5.0,
      reviews: 318,
      price: 125,
      mainImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    },
  ];
};

const LocationPage = () => {
  const { location } = useParams();
  const navigate = useNavigate();
  const displayLocation = decodeURIComponent(location || '');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const filterPills = ['Free cancellation', 'Type of place', 'Price', 'Instant Book', 'More filters'];

  useEffect(() => {
    const fetchLocationListings = async () => {
      try {
        setLoading(true);
        const response = await listingAPI.getPublicListings();
        const normalizedRouteLocation = normalizeLocationName(decodeURIComponent(location || ''));
        const filteredListings = response.data.listings.filter(
          (listing) => normalizeLocationName(listing.location) === normalizedRouteLocation
        );
        setListings(filteredListings);
      } catch (err) {
        setListings(buildFallbackListings(location));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationListings();
  }, [location]);

  if (loading) {
    return <div className="loading">Loading listings...</div>;
  }

  return (
    <div className="location-page">
      <div className="location-header">
        <p className="header-result-count">
          {Math.max(200, listings.length)}+ Airbnb Luxe stays in {displayLocation}
        </p>
      </div>

      <div className="location-filters" aria-label="Location filters">
        {filterPills.map((pill) => (
          <button key={pill} type="button" className="filter-pill">
            {pill}
          </button>
        ))}
      </div>

      <div className="listings-container">
        {listings.length > 0 ? (
          <div className="listings-list">
            {listings.map((listing, index) => (
              <article
                key={listing._id}
                className="listing-row"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/listings/${listing._id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate(`/listings/${listing._id}`);
                  }
                }}
              >
                <div className="row-image-wrap">
                  {listing.mainImage ? (
                    <img src={listing.mainImage} alt={listing.title} className="row-image" />
                  ) : (
                    <div className="row-image image-placeholder">No image</div>
                  )}
                </div>

                <div className="row-content">
                  <p className="row-subtitle">Entire home in {listing.location}</p>
                  <h2>{listing.title}</h2>
                  <span className="row-divider" />
                  <p className="row-meta">
                    {listing.guests} guests · {listing.type || 'Entire Home'} · {listing.bedrooms} beds · {listing.bathrooms} bath
                  </p>
                  <p className="row-amenities">{(listing.amenities || []).slice(0, 3).join(' · ')}</p>
                  <span className="row-divider" />
                  <div className="row-rating">
                      <span className="rating-value">{listing.rating || 5.0}</span>
                    <span className="star">★</span>
                    <span className="reviews">({listing.reviews || 318} reviews)</span>
                  </div>
                </div>

                <div className="row-right">
                  <button
                    type="button"
                    className={`wish-btn ${index === 1 ? 'active' : ''}`}
                    aria-label="Save listing"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {index === 1 ? '❤' : '♡'}
                  </button>

                  <div className="row-price">
                    <strong>${Math.round(listing.price)}</strong>
                    <span>/night</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-listings">
            <p>No accommodations available in {location} at this time.</p>
            <Link to="/" className="back-button">
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPage;
