import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import { listingAPI } from '../utils/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await listingAPI.getListings();
        setListings(response?.data?.listings || []);
        setInfoMessage('');
      } catch (err) {
        setListings([]);
        setInfoMessage('Dashboard data is temporarily unavailable. Please refresh shortly.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const locationSummary = useMemo(() => {
    const grouped = listings.reduce((acc, listing) => {
      const location = listing.location || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .map(([location, count]) => ({ location, count }));
  }, [listings]);

  const averageNightlyPrice = useMemo(() => {
    if (!listings.length) return 0;
    const total = listings.reduce((sum, listing) => sum + Number(listing.price || 0), 0);
    return Math.round(total / listings.length);
  }, [listings]);

  const quickActions = [
    {
      title: 'My Listings',
      description: 'Review and manage your published properties.',
      icon: '🧾',
      onClick: () => navigate('/listings'),
    },
    {
      title: 'Admin Add Hotel',
      description: 'Add a new hotel with pricing and amenities.',
      icon: '🏠',
      onClick: () => navigate('/admin/add-hotel'),
    },
    {
      title: 'Browse Locations',
      description: 'Open the location results page for guests.',
      icon: '📍',
      onClick: () => navigate('/locations/Sandton'),
    },
  ];

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <p className="hero-label">Host Console</p>
        <h1>Welcome back, {user?.username}.</h1>
        <p>
          Manage your property portfolio, update pricing, and keep listings guest-ready.
        </p>
      </section>

      <section className="dashboard-stats" aria-label="Performance summary">
        <div className="stat-card">
          <span>Active listings</span>
          <strong>{loading ? '...' : listings.length}</strong>
        </div>
        <div className="stat-card">
          <span>Locations covered</span>
          <strong>{loading ? '...' : locationSummary.length}</strong>
        </div>
        <div className="stat-card">
          <span>Avg nightly price</span>
          <strong>{loading ? '...' : `$${averageNightlyPrice}`}</strong>
        </div>
      </section>

      {infoMessage && <p className="dashboard-error">{infoMessage}</p>}

      <section className="quick-actions">
        <h2>Quick actions</h2>
        <div className="actions-grid">
          {quickActions.map((action) => (
            <button
              key={action.title}
              type="button"
              className="action-card"
              onClick={action.onClick}
            >
              <div className="action-icon">{action.icon}</div>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="dashboard-bottom">
        <div className="insight-panel">
          <h3>Listings by location</h3>
          {loading ? (
            <p className="insight-empty">Loading location stats...</p>
          ) : locationSummary.length === 0 ? (
            <p className="insight-empty">No listings yet. Create your first one to see location insights.</p>
          ) : (
            <div className="location-chip-grid">
              {locationSummary.map((item) => (
                <button
                  key={item.location}
                  type="button"
                  className="location-chip"
                  onClick={() => navigate(`/locations/${encodeURIComponent(item.location)}`)}
                >
                  <span>{item.location}</span>
                  <strong>{item.count}</strong>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="insight-panel">
          <h3>Host checklist</h3>
          <ul>
            <li>Add at least 5 high-quality photos to each listing.</li>
            <li>Keep amenities and bed/bath details up to date.</li>
            <li>Review pricing by location before weekends.</li>
          </ul>
        </div>
      </section>

      <section className="dashboard-footer-cta">
        <button type="button" className="cta-btn" onClick={() => navigate('/admin/add-hotel')}>
          Admin Add Hotel
        </button>
      </section>
    </div>
  );
};

export default Dashboard;
