import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/LocationDetails.css';
import api, { listingAPI } from '../utils/api';
import { getUser } from '../utils/auth';

const ratingRows = [
  { label: 'Cleanliness', value: '5.0', width: '100%' },
  { label: 'Communication', value: '5.0', width: '100%' },
  { label: 'Check-in', value: '5.0', width: '100%' },
  { label: 'Accuracy', value: '5.0', width: '100%' },
  { label: 'Location', value: '4.9', width: '96%' },
  { label: 'Value', value: '4.7', width: '93%' },
];

const fallbackReviewCards = [
  {
    name: 'Jose',
    date: 'December 2021',
    text: 'Host was very attentive.',
  },
  {
    name: 'Luke',
    date: 'December 2021',
    text: 'Nice place to stay!',
  },
  {
    name: 'Shayna',
    date: 'December 2021',
    text: 'Wonderful neighborhood, easy access to restaurants and subway, very cozy studio apartment with a super comfortable bed.',
  },
  {
    name: 'Josh',
    date: 'November 2021',
    text: 'Well designed and fun space, neighborhood has lots of energy and amenities.',
  },
  {
    name: 'Vladko',
    date: 'November 2021',
    text: 'Everything one needs for a monthly business stay. Very clean and organized place.',
  },
  {
    name: 'Jennifer',
    date: 'January 2022',
    text: 'A central place, near to a sub station and a supermarket with everything you need.',
  },
];

const fallbackAmenities = [
  'Garden view',
  'Kitchen',
  'Wifi',
  'Pets allowed',
  'Free washer - in building',
  'Dryer',
  'Central air conditioning',
  'Security cameras on property',
  'Refrigerator',
  'Bicycles',
];

const exploreCities = [
  'Paris', 'Nice', 'Lyon', 'Marseille', 'Lille', 'Aix-en-Provence', 'Rouen', 'Amiens', 'Toulouse', 'Montpellier', 'Dijon', 'Grenoble',
];

const uniqueStays = [
  'Beach House Rentals',
  'Cabin Rentals',
  'Camper Rentals',
  'Tiny House Rentals',
  'Glamping Rentals',
  'Lakehouse Rentals',
  'Treehouse Rentals',
  'Mountain Chalet Rentals',
];

const fallbackDescription = 'Come and stay in this superb duplex T2, in the heart of the historic center of Bordeaux, spacious and bright, in a real Bordeaux building. In requested store, you will enjoy all the charms of the city thanks to its ideal location. Close to many shops, bars and restaurants, you can access the apartment by tram A and C and bus routes 27 and 44.';

const fallbackHostProfile = {
  name: 'Ghazal',
  joined: 'May 2021',
  isSuperhost: true,
  responseRate: '100%',
  responseTime: 'within an hour',
  badges: ['12 Reviews', 'Identity verified', 'Superhost'],
};

const fallbackThingsToKnow = {
  houseRules: [
    'Check-in: After 4:00 PM',
    'Checkout: 10:00 AM',
    'Self check-in with lockbox',
    'Not suitable for infants (under 2 years)',
    'No smoking',
    'No pets',
    'No parties or events',
  ],
  healthSafety: [
    'Committed to Airbnb’s cleaning process. Show more',
    'Airbnb’s social-distancing and other COVID-19-related guidelines apply',
    'Carbon monoxide alarm',
    'Smoke alarm',
    'Security Deposit - if you damage the home, you may be charged up to $566',
  ],
  cancellationPolicy: ['Free cancellation before Feb 14'],
};

const fallbackFooterSupport = {
  support: ['Help Center', 'Safety information', 'Cancellation options', 'Our COVID-19 Response', 'Supporting people with disabilities', 'Report a neighborhood concern'],
  community: ['Airbnb.org disaster relief housing', 'Support Afghan refugees', 'Celebrating diversity & belonging', 'Combating discrimination'],
  hosting: ['Try hosting', 'AirCover: protection for Hosts', 'Explore hosting resources', 'Visit our community forum', 'How to host responsibly'],
  about: ['Newsroom', 'Learn about new features', 'Letter from our founders', 'Careers', 'Investors', 'Airbnb Luxe'],
};

const buildFallbackListing = (listingId) => ({
  _id: listingId || 'fallback-listing',
  title: 'Bluedoor Cozy Apartment in Bordeaux',
  description: fallbackDescription,
  location: 'Bordeaux',
  type: 'Entire rental unit',
  guests: 4,
  bedrooms: 1,
  bathrooms: 1,
  price: 160,
  weeklyDiscount: 10,
  cleaningFee: 40,
  serviceFee: 30,
  occupancyTaxes: 20,
  rating: 5.0,
  reviews: 7,
  amenities: fallbackAmenities,
  images: [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  ],
  mainImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
});

const LocationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await listingAPI.getPublicListing(id);
        setListing(response.data.listing);
      } catch (err) {
        setListing(buildFallbackListing(id));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  useEffect(() => {
    if (!checkInDate || !checkOutDate || !listing) {
      setNumberOfNights(0);
      setTotalPrice(0);
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (nights > 0) {
      setNumberOfNights(nights);
      const base = listing.price * nights;
      const discount = nights >= 7 ? (base * listing.weeklyDiscount) / 100 : 0;
      const subtotal = base - discount;
      setTotalPrice(subtotal + listing.cleaningFee + listing.serviceFee + listing.occupancyTaxes);
    } else {
      setNumberOfNights(0);
      setTotalPrice(0);
    }
  }, [checkInDate, checkOutDate, listing]);

  const handleReservation = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }

    if (numberOfGuests > listing.guests) {
      alert(`Maximum ${listing.guests} guests allowed`);
      return;
    }

    try {
      const reservationData = {
        title: listing.title,
        description: listing.description,
        type: listing.type || 'Entire Unit',
        location: listing.location || 'New York',
        images: listing.images || [],
        maxGuests: listing.guests,
        bedrooms: listing.bedrooms,
        rating: listing.rating || 5,
        reviews: listing.reviews || 0,
        price: listing.price,
        enhancedCleaning: true,
        selfCheckIn: true,
        amenities: listing.amenities || [],
        host_id: listing.host_id || listing.host?._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        host: listing.host?.username || listing.host?.name,
        weeklyDiscount: listing.weeklyDiscount,
        cleaningFee: listing.cleaningFee,
        serviceFee: listing.serviceFee,
        occupancyTaxes: listing.occupancyTaxes,
        specificRatings: {
          cleanliness: 5,
          communication: 5,
          checkIn: 5,
          accuracy: 5,
          location: 5,
          value: 5,
        },
      };

      await api.post('/reservations', reservationData);
      alert('Reservation created successfully!');
      navigate('/reservations');
    } catch (err) {
      alert('Failed to create reservation: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div className="loading">Loading listing details...</div>;
  }

  if (!listing) {
    return <div className="error">Listing not found</div>;
  }

  const galleryImages = listing.images && listing.images.length > 0 ? listing.images : [listing.mainImage].filter(Boolean);
  const mainImage = listing.mainImage || galleryImages[0];
  const sideImages = galleryImages.slice(0, 4);
  const amenities = (listing.amenities && listing.amenities.length > 0 ? listing.amenities : fallbackAmenities).slice(0, 10);
  const listingReviews = (listing.reviewHighlights && listing.reviewHighlights.length > 0
    ? listing.reviewHighlights
    : fallbackReviewCards).slice(0, 6);

  const resolvedHostProfile = {
    name:
      listing.host?.name ||
      listing.host?.username ||
      listing.hostName ||
      fallbackHostProfile.name,
    joined:
      listing.host?.createdAt
        ? new Date(listing.host.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })
        : listing.hostJoined || fallbackHostProfile.joined,
    isSuperhost: listing.isSuperhost ?? fallbackHostProfile.isSuperhost,
    responseRate: listing.hostResponseRate || fallbackHostProfile.responseRate,
    responseTime: listing.hostResponseTime || fallbackHostProfile.responseTime,
    badges: Array.isArray(listing.hostBadges) && listing.hostBadges.length
      ? listing.hostBadges
      : fallbackHostProfile.badges,
  };

  const resolvedThingsToKnow = {
    houseRules: Array.isArray(listing.houseRules) && listing.houseRules.length
      ? listing.houseRules
      : fallbackThingsToKnow.houseRules,
    healthSafety: Array.isArray(listing.healthSafety) && listing.healthSafety.length
      ? listing.healthSafety
      : fallbackThingsToKnow.healthSafety,
    cancellationPolicy: Array.isArray(listing.cancellationPolicy) && listing.cancellationPolicy.length
      ? listing.cancellationPolicy
      : fallbackThingsToKnow.cancellationPolicy,
  };

  const resolvedFooterSupport = {
    support: Array.isArray(listing.footerSupport?.support) && listing.footerSupport.support.length
      ? listing.footerSupport.support
      : fallbackFooterSupport.support,
    community: Array.isArray(listing.footerSupport?.community) && listing.footerSupport.community.length
      ? listing.footerSupport.community
      : fallbackFooterSupport.community,
    hosting: Array.isArray(listing.footerSupport?.hosting) && listing.footerSupport.hosting.length
      ? listing.footerSupport.hosting
      : fallbackFooterSupport.hosting,
    about: Array.isArray(listing.footerSupport?.about) && listing.footerSupport.about.length
      ? listing.footerSupport.about
      : fallbackFooterSupport.about,
  };

  const basePrice = listing.price * numberOfNights;
  const weeklyDiscountAmount = numberOfNights >= 7 ? (basePrice * listing.weeklyDiscount) / 100 : 0;

  return (
    <div className="location-details">
      <div className="details-header">
        <h1>{listing.title}</h1>
        <div className="header-top-meta">
          <span className="meta-rating">
            <svg viewBox="0 0 24 24" className="meta-star-icon" aria-hidden="true" focusable="false">
              <path d="m12 3 2.8 5.67 6.27.91-4.54 4.43 1.07 6.25L12 17.35 6.4 20.26l1.07-6.25L2.93 9.58l6.27-.91L12 3z" fill="currentColor"/>
            </svg>
            <span>{listing.rating || '5.0'}</span>
          </span>
          <span>·</span>
          <span>{listing.reviews || 7} reviews</span>
          <span>·</span>
          <span>{listing.location}</span>
        </div>
        <div className="header-actions">
          <button type="button" className="header-action-btn">
            <svg viewBox="0 0 24 24" className="header-action-icon" aria-hidden="true" focusable="false">
              <path d="M18 8a3 3 0 0 0-2.82 2H8.82A3 3 0 1 0 8.82 12h6.36A3 3 0 1 0 18 8zm0 2a1 1 0 1 1-1 1 1 1 0 0 1 1-1zM6 11a1 1 0 1 1-1 1 1 1 0 0 1 1-1zm12 7a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" fill="currentColor"/>
            </svg>
            <span>Share</span>
          </button>
          <button type="button" className="header-action-btn">
            <svg viewBox="0 0 24 24" className="header-action-icon" aria-hidden="true" focusable="false">
              <path d="M12.1 21.35 10.65 20C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4c1.74 0 3.41.81 4.5 2.09A6.05 6.05 0 0 1 15.5 4 4.5 4.5 0 0 1 20 8.5c0 3.78-3.4 6.86-8.65 11.5l-1.25 1.35z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="image-gallery">
        <div className="gallery-main">
          {mainImage ? (
            <img src={mainImage} alt={listing.title} />
          ) : (
            <div className="image-placeholder">
              <svg viewBox="0 0 24 24" className="camera-placeholder-icon" aria-hidden="true" focusable="false">
                <path d="M9 5h6l1.2 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3.8L9 5zm3 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" fill="currentColor"/>
              </svg>
            </div>
          )}
        </div>

        <div className="gallery-grid">
          {sideImages.map((image, idx) => (
            <div key={idx} className="gallery-tile">
              <img src={image} alt={`${listing.title} ${idx + 1}`} />
              {idx === 3 && <button type="button" className="show-photos-btn">Show all photos</button>}
            </div>
          ))}
          {sideImages.length < 4 &&
            Array.from({ length: 4 - sideImages.length }).map((_, idx) => (
              <div key={`placeholder-${idx}`} className="gallery-tile placeholder-tile">
                Photo
              </div>
            ))}
        </div>
      </div>

      <div className="details-content">
        <div className="left-column">
          <section className="section host-head-section">
            <div>
              <h2>Entire rental unit hosted by {resolvedHostProfile.name}</h2>
              <p>{listing.guests} guests · {listing.bedrooms} bedroom · 1 bed · {listing.bathrooms} bath</p>
            </div>
            <div className="host-head-avatar">G</div>
          </section>

          <section className="section feature-lines">
            <div className="feature-line">
              <span className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M12 4 3 11h2v9h5v-6h4v6h5v-9h2L12 4zm0 2.6 6 4.67V18h-2v-6H8v6H6v-6.73L12 6.6z" fill="currentColor"/>
                </svg>
              </span>
              <div>
                <h4>Entire home</h4>
                <p>You’ll have the apartment to yourself</p>
              </div>
            </div>
            <div className="feature-line">
              <span className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="m12 3 2.1 4.9L19 10l-4.9 2.1L12 17l-2.1-4.9L5 10l4.9-2.1L12 3zm7 10 1 2.3L22.3 16 20 17l-1 2.3L18 17l-2.3-1 2.3-.7L19 13zM5 14l1 2.3L8.3 17 6 17.7 5 20l-1-2.3L1.7 17 4 16.3 5 14z" fill="currentColor"/>
                </svg>
              </span>
              <div>
                <h4>Enhanced Clean</h4>
                <p>This host committed to Airbnb’s cleaning process.</p>
              </div>
            </div>
            <div className="feature-line">
              <span className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M9.5 14A4.5 4.5 0 1 1 13.8 8H23v3h-2v2h-2v2h-2v2h-3.2A4.5 4.5 0 0 1 9.5 14zm0-2A2.5 2.5 0 1 0 7 9.5 2.5 2.5 0 0 0 9.5 12z" fill="currentColor"/>
                </svg>
              </span>
              <div>
                <h4>Self check-in</h4>
                <p>Check yourself in with the keypad.</p>
              </div>
            </div>
            <div className="feature-line">
              <span className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2zm13 8H4v10h16V10zm0-4H4v2h16V6z" fill="currentColor"/>
                </svg>
              </span>
              <div>
                <h4>Free cancellation before Feb 14</h4>
                <p>Flexible options available.</p>
              </div>
            </div>
          </section>

          <section className="section description-section">
            <p>{listing.description || fallbackDescription}</p>
            <button type="button" className="text-link">Show more</button>
          </section>

          <section className="section">
            <h3>Where you'll sleep</h3>
            <div className="sleep-card">
              <img src={mainImage} alt="Bedroom" />
              <strong>Bedroom</strong>
              <span>1 queen bed</span>
            </div>
          </section>

          <section className="section">
            <h3>What this place offers</h3>
            <div className="amenities-grid">
              {amenities.map((amenity, idx) => (
                <div key={idx} className="amenity-row">
                  <span className="amenity-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="m9.55 18.46-4.24-4.24 1.41-1.41 2.83 2.82 7.73-7.72 1.41 1.41-9.14 9.14z" fill="currentColor"/>
                    </svg>
                  </span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
            <button type="button" className="outline-btn">Show all {listing.amenities?.length || amenities.length} amenities</button>
          </section>

          <section className="section date-mock-section">
            <h3>{numberOfNights || 7} nights in {listing.location}</h3>
            <p>Feb 19, 2022 - Feb 26, 2022</p>
            <div className="calendar-mock">
              <div>
                <h4>February 2022</h4>
                <div className="calendar-grid">
                  {Array.from({ length: 35 }).map((_, idx) => <span key={idx}>{idx > 2 && idx < 31 ? idx - 2 : ''}</span>)}
                </div>
              </div>
              <div>
                <h4>March 2022</h4>
                <div className="calendar-grid">
                  {Array.from({ length: 35 }).map((_, idx) => <span key={idx}>{idx > 1 && idx < 33 ? idx - 1 : ''}</span>)}
                </div>
              </div>
            </div>
          </section>

          <section className="section reviews-section">
            <h3 className="reviews-title">
              <svg viewBox="0 0 24 24" className="meta-star-icon" aria-hidden="true" focusable="false">
                <path d="m12 3 2.8 5.67 6.27.91-4.54 4.43 1.07 6.25L12 17.35 6.4 20.26l1.07-6.25L2.93 9.58l6.27-.91L12 3z" fill="currentColor"/>
              </svg>
              <span>{listing.rating || '5.0'} · {listing.reviews || 7} reviews</span>
            </h3>

            <div className="rating-summary-grid">
              {ratingRows.map((row) => (
                <div key={row.label} className="rating-summary-row">
                  <span>{row.label}</span>
                  <div className="rating-line"><i style={{ width: row.width }}></i></div>
                  <strong>{row.value}</strong>
                </div>
              ))}
            </div>

            <div className="review-cards-grid">
              {listingReviews.map((review) => (
                <div key={review.name} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">{review.name.charAt(0)}</div>
                    <div>
                      <h4>{review.name}</h4>
                      <p>{review.date}</p>
                    </div>
                  </div>
                  <p>{review.text}</p>
                </div>
              ))}
            </div>

            <button type="button" className="outline-btn reviews-btn">Show all {Math.max(listing.reviews || listingReviews.length, listingReviews.length)} reviews</button>
          </section>

          <section className="section host-detail-section">
            <div className="host-detail-head">
              <div className="host-head-avatar">G</div>
              <div>
                <h3>Hosted by {resolvedHostProfile.name}</h3>
                <p>Joined {resolvedHostProfile.joined}</p>
              </div>
            </div>
            <div className="host-badges">
              <span className="host-badge">
                <svg viewBox="0 0 24 24" className="host-badge-icon" aria-hidden="true" focusable="false">
                  <path d="m12 3 2.8 5.67 6.27.91-4.54 4.43 1.07 6.25L12 17.35 6.4 20.26l1.07-6.25L2.93 9.58l6.27-.91L12 3z" fill="currentColor"/>
                </svg>
                <span>{resolvedHostProfile.badges[0]}</span>
              </span>
              <span className="host-badge">
                <svg viewBox="0 0 24 24" className="host-badge-icon" aria-hidden="true" focusable="false">
                  <path d="m9.55 18.46-4.24-4.24 1.41-1.41 2.83 2.82 7.73-7.72 1.41 1.41-9.14 9.14z" fill="currentColor"/>
                </svg>
                <span>{resolvedHostProfile.badges[1]}</span>
              </span>
              <span className="host-badge">
                <svg viewBox="0 0 24 24" className="host-badge-icon" aria-hidden="true" focusable="false">
                  <path d="M12 2 9.3 5.7 4.7 6.9l2.9 3.7-.2 4.7L12 13.8l4.6 1.5-.2-4.7 2.9-3.7-4.6-1.2L12 2zm0 6.1a3.9 3.9 0 1 1-3.9 3.9A3.9 3.9 0 0 1 12 8.1z" fill="currentColor"/>
                </svg>
                <span>{resolvedHostProfile.badges[2]}</span>
              </span>
            </div>
            <h4>{resolvedHostProfile.name} is a Superhost</h4>
            <p>Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
            <p>Response rate: {resolvedHostProfile.responseRate}</p>
            <p>Response time: {resolvedHostProfile.responseTime}</p>
            <button type="button" className="outline-btn">Contact Host</button>
          </section>

          <section className="section know-section">
            <h3>Things to know</h3>
            <div className="know-grid">
              <div>
                <h4>House rules</h4>
                {resolvedThingsToKnow.houseRules.slice(0, 4).map((rule) => (
                  <p key={rule}>{rule}</p>
                ))}
                <button type="button" className="text-link">Show more</button>
              </div>
              <div>
                <h4>Health & safety</h4>
                {resolvedThingsToKnow.healthSafety.slice(0, 3).map((item) => (
                  <p key={item}>{item}</p>
                ))}
                <button type="button" className="text-link">Show more</button>
              </div>
              <div>
                <h4>Cancellation policy</h4>
                {resolvedThingsToKnow.cancellationPolicy.map((policy) => (
                  <p key={policy}>{policy}</p>
                ))}
                <button type="button" className="text-link">Show more</button>
              </div>
            </div>
          </section>

          <section className="section explore-section">
            <h3>Explore other options in France</h3>
            <div className="explore-grid">
              {exploreCities.map((city) => (
                <p key={city}>{city}</p>
              ))}
            </div>

            <h4>Unique stays on Airbnb</h4>
            <div className="explore-grid unique-grid">
              {uniqueStays.map((stay) => (
                <p key={stay}>{stay}</p>
              ))}
            </div>
          </section>

          <section className="section listing-footer">
            <div className="footer-columns">
              <div>
                <h4>Support</h4>
                {resolvedFooterSupport.support.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
              <div>
                <h4>Community</h4>
                {resolvedFooterSupport.community.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
              <div>
                <h4>Hosting</h4>
                {resolvedFooterSupport.hosting.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
              <div>
                <h4>About</h4>
                {resolvedFooterSupport.about.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2022 Airbnb, Inc. · Privacy · Terms · Sitemap</p>
              <p>English (US) · $ USD</p>
            </div>
          </section>
        </div>

        <aside className="right-column">
          <div className="cost-calculator">
            <div className="calculator-header">
              <div className="price-display">
                <span className="price">${listing.price}</span>
                <span className="unit">/ night</span>
              </div>
              <div className="mini-rating">
                <svg viewBox="0 0 24 24" className="meta-star-icon" aria-hidden="true" focusable="false">
                  <path d="m12 3 2.8 5.67 6.27.91-4.54 4.43 1.07 6.25L12 17.35 6.4 20.26l1.07-6.25L2.93 9.58l6.27-.91L12 3z" fill="currentColor"/>
                </svg>
                <span>{listing.rating || '5.0'} · {listing.reviews || 7} reviews</span>
              </div>
            </div>

            <div className="reserve-grid">
              <div className="reserve-cell">
                <label>Check-in</label>
                <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
              </div>
              <div className="reserve-cell">
                <label>Checkout</label>
                <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
              </div>
              <div className="reserve-cell full">
                <label>Guests</label>
                <div className="guest-selector">
                  <button type="button" onClick={() => setNumberOfGuests(Math.max(1, numberOfGuests - 1))}>−</button>
                  <input
                    type="number"
                    min="1"
                    max={listing.guests}
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(Math.min(listing.guests, parseInt(e.target.value, 10) || 1))}
                  />
                  <button type="button" onClick={() => setNumberOfGuests(Math.min(listing.guests, numberOfGuests + 1))}>+</button>
                </div>
              </div>
            </div>

            <button className="reserve-button" onClick={handleReservation} disabled={!checkInDate || !checkOutDate}>
              {user ? 'Reserve' : 'Login to Reserve'}
            </button>

            <p className="no-charge">You won't be charged yet</p>

            <div className="price-breakdown">
              <div className="breakdown-item">
                <span>${listing.price} × {numberOfNights || 7} nights</span>
                <span>${(numberOfNights > 0 ? basePrice : listing.price * 7).toFixed(0)}</span>
              </div>

              {weeklyDiscountAmount > 0 && (
                <div className="breakdown-item discount">
                  <span>Weekly discount</span>
                  <span>- ${weeklyDiscountAmount.toFixed(0)}</span>
                </div>
              )}

              <div className="breakdown-item">
                <span>Cleaning fee</span>
                <span>${listing.cleaningFee.toFixed(0)}</span>
              </div>
              <div className="breakdown-item">
                <span>Service fee</span>
                <span>${listing.serviceFee.toFixed(0)}</span>
              </div>
              <div className="breakdown-item">
                <span>Occupancy taxes and fees</span>
                <span>${listing.occupancyTaxes.toFixed(0)}</span>
              </div>
              <div className="breakdown-total">
                <span>Total</span>
                <span>${(totalPrice || listing.price * 7 + listing.cleaningFee + listing.serviceFee + listing.occupancyTaxes).toFixed(0)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LocationDetails;
