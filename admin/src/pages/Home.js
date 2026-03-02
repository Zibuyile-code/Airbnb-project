import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import giftCardsImage from '../assets/gift-cards.jpg';

const TRIP_CARDS = [
  {
    id: 'sandton-city-hotel',
    name: 'Sandton City Hotel',
    distance: '53 km away',
    color: 'trip-red',
    location: 'Sandton',
    image:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'joburg-city-hotel',
    name: 'Joburg City Hotel',
    distance: '168 km away',
    color: 'trip-purple',
    location: 'Johannesburg',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'woodmead-hotel',
    name: 'Woodmead Hotel',
    distance: '30 miles away',
    color: 'trip-pink',
    location: 'Woodmead',
    image:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'hyde-park-hotel',
    name: 'Hyde Park Hotel',
    distance: '34 km away',
    color: 'trip-orange',
    location: 'Hyde Park',
    image:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80',
  },
];

const futureColumns = [
  {
    title: 'Destinations for arts & culture',
    links: ['Phoenix', 'Hot Springs', 'Los Angeles', 'San Diego'],
  },
  {
    title: 'Destinations for outdoor adventure',
    links: ['Phoenix', 'Hot Springs', 'Los Angeles', 'San Diego'],
  },
  {
    title: 'Mountain cabins',
    links: ['Mentone', 'Sedona', 'Helen', 'Idyllwild'],
  },
  {
    title: 'Beach destinations',
    links: ['Myrtle Beach', 'Dauphin Island', 'Maui', 'Fort Myers'],
  },
];

const getawayTabs = [
  'Destinations for arts & culture',
  'Destinations for outdoor adventure',
  'Mountain cabins',
  'Beach destinations',
  'Popular destinations',
  'Unique Stays',
];

const footerColumns = [
  {
    title: 'Support',
    links: ['Help Center', 'Safety information', 'Cancellation options', 'Our COVID-19 Response', 'Supporting people with disabilities', 'Report a neighborhood concern'],
  },
  {
    title: 'Community',
    links: ['Airbnb.org: disaster relief housing', 'Support Afghan refugees', 'Celebrating diversity & belonging', 'Combating discrimination'],
  },
  {
    title: 'Hosting',
    links: ['Try hosting', 'AirCover for Hosts', 'Explore hosting resources', 'Visit our community forum', 'How to host responsibly'],
  },
  {
    title: 'About',
    links: ['Newsroom', 'Learn about new features', 'Letter from our founders', 'Careers', 'Investors', 'Airbnb Luxe'],
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [tripCards, setTripCards] = useState(TRIP_CARDS);

  useEffect(() => {
    setTripCards(TRIP_CARDS);
  }, []);

  return (
    <div className="home">
      <section className="home-top-shell">
        <section className="hero-banner">
          <div className="hero-content">
            <h1>Not sure where to go? Perfect.</h1>
            <button type="button" className="hero-flex-button" onClick={() => navigate('/locations/Sandton')}>
              I'm Flexible
            </button>
          </div>
        </section>

        <section className="category-strip">
          <div className="category-inner">
            <button type="button" className="category-pill">Nearby</button>
            <button type="button" className="category-pill">Live for anywhere</button>
            <button type="button" className="category-pill">Pets</button>
            <button type="button" className="category-pill">Unique stays</button>
            <button type="button" className="category-pill">Entire homes</button>
            <button type="button" className="category-pill">Experiences</button>
          </div>
        </section>
      </section>

      <div className="home-content-shell">
        <section className="inspiration-section">
          <h2>Inspiration for your next trip</h2>
          <div className="trip-cards-grid">
            {tripCards.map((card) => (
              <button
                key={card.id}
                type="button"
                className={`trip-card ${card.color}`}
                onClick={() => navigate(`/locations/${encodeURIComponent(card.location)}`)}
              >
                <img src={card.image} alt={card.name} />
                <div className="trip-card-body">
                  <h3>{card.name}</h3>
                  <p>{card.distance}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="experiences-section">
          <h2>Discover Airbnb Experiences</h2>
          <div className="experience-row">
            <article className="experience-card on-trip">
              <div className="experience-content">
                <h3>Things to do on your trip</h3>
                <button type="button" className="experience-button">Experiences</button>
              </div>
            </article>
            <article className="experience-card at-home">
              <div className="experience-content">
                <h3>Things to do from home</h3>
                <button type="button" className="experience-button">Online Experiences</button>
              </div>
            </article>
          </div>
        </section>

        <section className="shop-section">
          <div className="shop-content">
            <div className="shop-text">
              <h2>Shop Airbnb gift cards</h2>
              <button type="button" className="shop-button">Learn more</button>
            </div>
            <div className="shop-image">
              <img
                src={giftCardsImage}
                alt="Airbnb gift cards"
              />
            </div>
          </div>
        </section>

        <section className="hosting-banner">
          <div className="hosting-overlay">
            <h2>Questions about hosting?</h2>
            <button type="button" className="hosting-button">Ask a Superhost</button>
          </div>
        </section>

        <section className="future-getaways-section">
          <h2>Inspiration for future getaways</h2>
          <div className="future-tabs" role="tablist" aria-label="Getaway categories">
            {getawayTabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={`future-tab ${index === 0 ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="future-grid">
            {futureColumns.map((column) => (
              <div key={column.title} className="future-column">
                <h4>{column.title}</h4>
                {column.links.map((link) => (
                  <button key={link} type="button" className="plain-link">{link}</button>
                ))}
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            {footerColumns.map((column) => (
              <div key={column.title} className="footer-column">
                <h4>{column.title}</h4>
                {column.links.map((link) => (
                  <button key={link} type="button" className="plain-link">{link}</button>
                ))}
              </div>
            ))}
          </div>
        </footer>

        <div className="copyright-footer">
          <div className="copyright-content">
            <p>© 2026 Airbnb, Inc. · Privacy · Terms · Sitemap</p>
            <div className="footer-social">
              <span>English (US)</span>
              <span>$ USD</span>
              <a href="#" className="social-icon-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M14 8h2V5h-2c-2.21 0-4 1.79-4 4v2H8v3h2v5h3v-5h2.11l.39-3H13V9c0-.55.45-1 1-1z" fill="currentColor" />
                </svg>
              </a>
              <a href="#" className="social-icon-link" aria-label="Twitter">
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M20 7.54a5.57 5.57 0 0 1-1.6.44 2.79 2.79 0 0 0 1.22-1.54 5.52 5.52 0 0 1-1.76.67 2.77 2.77 0 0 0-4.72 2.52A7.86 7.86 0 0 1 7.1 6.9a2.77 2.77 0 0 0 .86 3.69 2.75 2.75 0 0 1-1.25-.35v.03a2.77 2.77 0 0 0 2.22 2.72c-.3.08-.61.12-.94.12-.23 0-.45-.02-.67-.06a2.78 2.78 0 0 0 2.59 1.92A5.58 5.58 0 0 1 6 16.09a7.88 7.88 0 0 0 4.25 1.25c5.1 0 7.89-4.22 7.89-7.88l-.01-.36A5.6 5.6 0 0 0 20 7.54z" fill="currentColor" />
                </svg>
              </a>
              <a href="#" className="social-icon-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M12 7.2A4.8 4.8 0 1 0 16.8 12 4.81 4.81 0 0 0 12 7.2zm0 8A3.2 3.2 0 1 1 15.2 12 3.2 3.2 0 0 1 12 15.2zm5.6-8.18a1.12 1.12 0 1 1-1.12 1.12 1.12 1.12 0 0 1 1.12-1.12z" fill="currentColor" />
                  <path d="M12 3.6c2.74 0 3.06.01 4.14.06 1 .05 1.55.21 1.91.35a3.2 3.2 0 0 1 1.15.75c.35.35.6.76.75 1.15.14.36.3.91.35 1.91.05 1.08.06 1.4.06 4.14s-.01 3.06-.06 4.14c-.05 1-.21 1.55-.35 1.91a3.2 3.2 0 0 1-.75 1.15c-.35.35-.76.6-1.15.75-.36.14-.91.3-1.91.35-1.08.05-1.4.06-4.14.06s-3.06-.01-4.14-.06c-1-.05-1.55-.21-1.91-.35a3.2 3.2 0 0 1-1.15-.75 3.2 3.2 0 0 1-.75-1.15c-.14-.36-.3-.91-.35-1.91C3.61 15.06 3.6 14.74 3.6 12s.01-3.06.06-4.14c.05-1 .21-1.55.35-1.91a3.2 3.2 0 0 1 .75-1.15c.35-.35.76-.6 1.15-.75.36-.14.91-.3 1.91-.35C8.94 3.61 9.26 3.6 12 3.6zm0-1.6C9.22 2 8.87 2.01 7.78 2.06c-1.09.05-1.84.22-2.49.47A4.8 4.8 0 0 0 3.56 3.6a4.8 4.8 0 0 0-1.07 1.73c-.25.65-.42 1.4-.47 2.49C2.01 8.87 2 9.22 2 12s.01 3.13.06 4.22c.05 1.09.22 1.84.47 2.49.24.63.6 1.2 1.07 1.73.53.53 1.1.83 1.73 1.07.65.25 1.4.42 2.49.47C8.87 21.99 9.22 22 12 22s3.13-.01 4.22-.06c1.09-.05 1.84-.22 2.49-.47a4.8 4.8 0 0 0 1.73-1.07c.53-.53.83-1.1 1.07-1.73.25-.65.42-1.4.47-2.49.05-1.09.06-1.44.06-4.22s-.01-3.13-.06-4.22c-.05-1.09-.22-1.84-.47-2.49A4.8 4.8 0 0 0 20.44 3.6a4.8 4.8 0 0 0-1.73-1.07c-.65-.25-1.4-.42-2.49-.47C15.13 2.01 14.78 2 12 2z" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
