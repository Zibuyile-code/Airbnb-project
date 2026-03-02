import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingAPI } from '../utils/api';
import '../styles/ListingsList.css';

const ListingsList = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState('');

  const filterPills = ['Free cancellation', 'Type of place', 'Price', 'Instant Book', 'More filters'];

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await listingAPI.getListings();
      setListings(response.data.listings);
      setInfoMessage('');
    } catch (err) {
      setListings([]);
      setInfoMessage('Listings are temporarily unavailable. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  const primaryLocation = useMemo(() => listings[0]?.location || 'Bordeaux', [listings]);

  return (
    <div className="listings-container">
      <div className="listings-header">
        <p className="header-result-count">
          {Math.max(200, listings.length)}+ Airbnb Luxe stays in {primaryLocation}
        </p>
      </div>

      <div className="listings-filters" aria-label="Listings filters">
        {filterPills.map((pill) => (
          <button key={pill} type="button" className="filter-pill">
            {pill}
          </button>
        ))}
      </div>

      {infoMessage && <div className="error-message">{infoMessage}</div>}

      {loading ? (
        <div className="loading">Loading listings...</div>
      ) : listings.length === 0 ? (
        <div className="empty-state">
          <h2>No listings yet</h2>
          <p>Create your first property listing to get started</p>
          <button
            className="create-btn"
            onClick={() => navigate('/admin/add-hotel')}
          >
            Admin Add Hotel
          </button>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map((listing, index) => (
            <div key={listing._id} className="listing-card">
              <div className="listing-image-wrap">
                {listing.mainImage ? (
                  <img
                    src={listing.mainImage}
                    alt={listing.title}
                    className="listing-image"
                  />
                ) : (
                  <div className="listing-image listing-image-fallback">No image</div>
                )}
              </div>

              <div className="listing-content">
                <p className="listing-subtitle">Entire home in {listing.location}</p>
                <h3 className="listing-title">{listing.title}</h3>
                <span className="listing-divider" />
                <p className="listing-location">
                  4-6 guests · {listing.type || 'Entire Home'} · {listing.bedrooms || 5} beds · {listing.bathrooms || 3} bath
                </p>
                <p className="listing-amenities">
                  {((listing.amenities || []).slice(0, 3).join(' · ') || 'Wifi · Kitchen · Free Parking')}
                </p>

                <span className="listing-divider" />

                <div className="listing-details">
                  <span>{listing.rating || 5.0}</span>
                  <span className="rating-star">★</span>
                  <span className="reviews-count">({listing.reviews || 318} reviews)</span>
                </div>
              </div>

              <div className="listing-right">
                <button
                  type="button"
                  className={`favorite-btn ${index === 1 ? 'active' : ''}`}
                  aria-label="Save listing"
                >
                  {index === 1 ? '❤' : '♡'}
                </button>
                <div className="listing-price">
                  <strong>${Math.round(listing.price)}</strong>
                  <span>/night</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ListingsList;
