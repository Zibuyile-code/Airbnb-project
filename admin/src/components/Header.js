import React, { useState, useEffect } from 'react';
import { Link, NavLink, matchPath, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { getUser, clearAuth } from '../utils/auth';
import { DESTINATION_OPTIONS } from '../utils/locations';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const destinationOptions = DESTINATION_OPTIONS;
  const isHomePage = location.pathname === '/';
  const isListingDetailsPage = Boolean(matchPath('/listings/:id', location.pathname))
    && location.pathname !== '/listings/create'
    && !Boolean(matchPath('/listings/edit/:id', location.pathname));
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [destinationDropdownOpen, setDestinationDropdownOpen] = useState(false);
  const [locationsDropdownOpen, setLocationsDropdownOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSearch = (destinationOverride) => {
    const destination = destinationOverride || selectedDestination || 'New York';
    const query = new URLSearchParams();

    if (checkInDate) query.set('checkIn', checkInDate);
    if (checkOutDate) query.set('checkOut', checkOutDate);
    if (guestCount) query.set('guests', String(guestCount));

    const searchString = query.toString();
    navigate(`/locations/${encodeURIComponent(destination)}${searchString ? `?${searchString}` : ''}`);
  };

  const handleSelectDestination = (destination) => {
    setSelectedDestination(destination);
    setDestinationDropdownOpen(false);
    setLocationsDropdownOpen(false);
    handleSearch(destination);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  if (isHomePage) {
    return (
      <header className="header home-header">
        <div className="header-container home-top-row">
          <Link to="/" className="header-logo home-logo" aria-label="Go to homepage">
            airbnb
          </Link>

          <nav className="home-main-links" aria-label="Primary">
            <div className="home-locations-wrap">
              <button
                type="button"
                className="home-locations-btn"
                onClick={() => setLocationsDropdownOpen(!locationsDropdownOpen)}
              >
                Locations
              </button>
              {locationsDropdownOpen && (
                <div className="home-locations-dropdown" role="listbox" aria-label="Locations">
                  {destinationOptions.map((destination) => (
                    <button
                      key={destination.name}
                      type="button"
                      className="home-locations-option"
                      onClick={() => handleSelectDestination(destination.name)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleSelectDestination(destination.name);
                        }
                      }}
                    >
                      {destination.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={() => setLocationsDropdownOpen(false)}>Experiences</button>
            <button type="button" onClick={() => setLocationsDropdownOpen(false)}>Online Experiences</button>
          </nav>

          <div className="home-actions">
            {user ? (
              <div className="profile-section">
                <button
                  type="button"
                  className="profile-icon"
                  onClick={handleToggleDropdown}
                  aria-label="Open account menu"
                >
                  <span className="profile-lines">☰</span>
                  <span className="profile-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/" onClick={() => setDropdownOpen(false)}>
                      Home
                    </Link>
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/reservations" onClick={() => setDropdownOpen(false)}>
                      View Reservations
                    </Link>
                    <Link to="/listings" onClick={() => setDropdownOpen(false)}>
                      My Listings
                    </Link>
                    <Link to="/admin/add-hotel" onClick={() => setDropdownOpen(false)}>
                      Admin Add Hotel
                    </Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button type="button" className="home-host-btn" onClick={() => navigate('/login')}>
                  Become a host
                </button>
                <button type="button" className="home-circle-btn" aria-label="Select language">🌐</button>
                <button type="button" className="home-menu-btn" onClick={() => navigate('/login')}>
                  <span>☰</span>
                  <span className="home-avatar">☺</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="home-search-wrap">
          <div className="home-search-row">
            <button
              type="button"
              className="home-search-segment where-segment"
              onClick={() => setDestinationDropdownOpen(!destinationDropdownOpen)}
            >
              <span className="segment-label">Where</span>
              <span className="segment-value">{selectedDestination || 'Search destinations'}</span>
            </button>
            <div className="home-search-segment">
              <span className="segment-label">Check in</span>
              <input
                type="date"
                className="segment-input"
                value={checkInDate}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setDestinationDropdownOpen(false)}
                onChange={(event) => {
                  const nextCheckInDate = event.target.value;
                  setCheckInDate(nextCheckInDate);
                  if (checkOutDate && nextCheckInDate && checkOutDate < nextCheckInDate) {
                    setCheckOutDate('');
                  }
                }}
              />
            </div>
            <div className="home-search-segment">
              <span className="segment-label">Check out</span>
              <input
                type="date"
                className="segment-input"
                value={checkOutDate}
                min={checkInDate || undefined}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setDestinationDropdownOpen(false)}
                onChange={(event) => setCheckOutDate(event.target.value)}
              />
            </div>
            <div className="home-search-segment who-segment">
              <span className="segment-label">Who</span>
              <input
                type="number"
                className="segment-input"
                min="1"
                value={guestCount}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setDestinationDropdownOpen(false)}
                onChange={(event) => {
                  const nextGuestCount = Number(event.target.value);
                  setGuestCount(nextGuestCount > 0 ? nextGuestCount : 1);
                }}
              />
            </div>
            <button
              type="button"
              className="home-search-btn"
              onClick={handleSearch}
            >
              🔍
            </button>
          </div>

          {destinationDropdownOpen && (
            <div className="destination-dropdown" role="listbox" aria-label="Suggested destinations">
              {destinationOptions.map((destination) => (
                <button
                  key={destination.name}
                  type="button"
                  className="destination-option"
                  onClick={() => handleSelectDestination(destination.name)}
                >
                  <img src={destination.image} alt={destination.name} className="destination-option-image" />
                  <span>{destination.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>
    );
  }

  if (isListingDetailsPage) {
    return (
      <header className="header listing-header">
        <div className="header-container listing-header-container">
          <Link to="/" className="header-logo" aria-label="Go to homepage">
            airbnb
          </Link>

          <button type="button" className="listing-search-pill" aria-label="Start your search">
            <span>Start your search</span>
            <span className="listing-search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="icon-svg" focusable="false">
                <path d="M10.5 4a6.5 6.5 0 0 1 5.1 10.53l4.44 4.43-1.42 1.42-4.43-4.44A6.5 6.5 0 1 1 10.5 4zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z" fill="currentColor" />
              </svg>
            </span>
          </button>

          <div className="listing-header-actions">
            <button type="button" className="listing-host-btn" onClick={() => (user ? navigate('/dashboard') : navigate('/login'))}>
              Become a Host
            </button>
            <button type="button" className="listing-globe-btn" aria-label="Select language">
              <svg viewBox="0 0 24 24" className="icon-svg" focusable="false">
                <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 2a8 8 0 0 0-5.65 2.35h2.07c.63-1.37 1.53-2.26 2.58-2.35zm0 16c-1.05-.09-1.95-.98-2.58-2.35H6.35A8 8 0 0 0 12 20zm5.65-2.35h-2.07c-.63 1.37-1.53 2.26-2.58 2.35a8 8 0 0 0 4.65-2.35zM13 4.28c.75.33 1.48 1.18 2 2.07H9c.52-.89 1.25-1.74 2-2.07zm-4.9 4.07h7.8c.14.53.23 1.09.23 1.65s-.09 1.12-.23 1.65H8.1A7.2 7.2 0 0 1 7.87 10c0-.56.09-1.12.23-1.65zm7.42 5.3H8.48c.45.99 1.03 1.88 1.67 2.35h3.7c.64-.47 1.22-1.36 1.67-2.35zm2.13-7.3h-2.07c.29.59.53 1.22.69 1.88h2.45A8.03 8.03 0 0 0 17.65 6.35zm1.07 7.3h-2.45a9.5 9.5 0 0 1-.69 1.88h2.07a8.03 8.03 0 0 0 1.07-1.88z" fill="currentColor"/>
              </svg>
            </button>

            {user ? (
              <div className="profile-section listing-profile-section">
                <button
                  type="button"
                  className="profile-icon"
                  onClick={handleToggleDropdown}
                  aria-label="Open account menu"
                >
                  <span className="profile-lines" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="icon-svg menu-icon" focusable="false">
                      <path d="M4 7h16v2H4V7zm0 4h16v2H4v-2zm0 4h16v2H4v-2z" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="profile-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/" onClick={() => setDropdownOpen(false)}>
                      Home
                    </Link>
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/reservations" onClick={() => setDropdownOpen(false)}>
                      View Reservations
                    </Link>
                    <Link to="/listings" onClick={() => setDropdownOpen(false)}>
                      My Listings
                    </Link>
                    <Link to="/admin/add-hotel" onClick={() => setDropdownOpen(false)}>
                      Admin Add Hotel
                    </Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button type="button" className="listing-menu-btn" onClick={() => navigate('/login')}>
                <span className="profile-lines" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="icon-svg menu-icon" focusable="false">
                    <path d="M4 7h16v2H4V7zm0 4h16v2H4v-2zm0 4h16v2H4v-2z" fill="currentColor" />
                  </svg>
                </span>
                <span className="listing-avatar-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="icon-svg" focusable="false">
                    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.31 0-6 2.02-6 4.5V20h12v-1.5c0-2.48-2.69-4.5-6-4.5z" fill="currentColor" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`header ${isHomePage ? 'home-header' : ''}`}>
      <div className="header-container">
        <Link to="/" className="header-logo" aria-label="Go to homepage">
          airbnb
        </Link>

        <nav className="header-nav">
          {user ? (
            <div className="profile-section">
              <span className="greeting">{user.username}</span>
              <button
                type="button"
                className="profile-icon"
                onClick={handleToggleDropdown}
                aria-label="Open account menu"
              >
                <span className="profile-lines">☰</span>
                <span className="profile-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/" onClick={() => setDropdownOpen(false)}>
                    Home
                  </Link>
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/reservations" onClick={() => setDropdownOpen(false)}>
                    View Reservations
                  </Link>
                  <Link to="/listings" onClick={() => setDropdownOpen(false)}>
                    My Listings
                  </Link>
                  <Link to="/admin/add-hotel" onClick={() => setDropdownOpen(false)}>
                    Admin Add Hotel
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/login">Login</NavLink>
              <button
                type="button"
                className="host-link"
                onClick={() => navigate('/login')}
              >
                Become a host
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
