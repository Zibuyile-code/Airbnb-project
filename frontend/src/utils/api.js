import axios from 'axios';
import { LOCATION_NAMES, normalizeLocationName } from './locations';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    https://airbnb-project-backend-toxq.onrender.com

const api = axios.create({
  baseURL: API_BASE_URL,
});

const toNumber = (value, fallback = 0) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const toBackendType = (value) => {
  const normalizedValue = String(value || '').toLowerCase();
  if (normalizedValue.includes('room')) return 'Room';
  if (normalizedValue.includes('villa')) return 'Whole Villa';
  return 'Entire Unit';
};

const toBackendLocation = (value) => {
  const normalizedValue = normalizeLocationName(value);
  if (!normalizedValue) {
    return LOCATION_NAMES[0] || 'New York';
  }

  const matchedLocation = LOCATION_NAMES.find(
    (location) => normalizeLocationName(location) === normalizedValue,
  );
  return matchedLocation || String(value).trim();
};

const normalizeAuthResponse = (response) => {
  const user =
    response?.data?.user ||
    response?.data?.data?.user ||
    response?.data?.data?.data ||
    null;

  return {
    ...response,
    data: {
      ...response.data,
      token: response?.data?.token || null,
      user,
    },
  };
};

const normalizeListing = (accommodation = {}) => {
  const imageUrls = Array.isArray(accommodation.images)
    ? accommodation.images
        .map((image) => (typeof image === 'string' ? image : image?.url))
        .filter(Boolean)
    : [];

  const mainImage = accommodation.mainImage || imageUrls[0] || '';

  return {
    ...accommodation,
    _id: accommodation._id,
    title: accommodation.title || '',
    description: accommodation.description || '',
    location: accommodation.location || '',
    type: accommodation.type || 'Entire Unit',
    price: toNumber(accommodation.price, 0),
    weeklyDiscount: toNumber(accommodation.weeklyDiscount, 0),
    cleaningFee: toNumber(accommodation.cleaningFee, 0),
    serviceFee: toNumber(accommodation.serviceFee, 0),
    occupancyTaxes: toNumber(accommodation.occupancyTaxes, 0),
    bedrooms: toNumber(accommodation.bedrooms, 1),
    bathrooms: toNumber(accommodation.bathrooms, 1),
    beds: toNumber(accommodation.beds, toNumber(accommodation.bedrooms, 1)),
    guests: toNumber(accommodation.maxGuests ?? accommodation.guests, 1),
    maxGuests: toNumber(accommodation.maxGuests ?? accommodation.guests, 1),
    amenities: Array.isArray(accommodation.amenities) ? accommodation.amenities : [],
    rating: toNumber(accommodation.rating, 5),
    reviews: toNumber(accommodation.reviews, 0),
    images: imageUrls.length ? imageUrls : mainImage ? [mainImage] : [],
    mainImage,
  };
};

const normalizeListingCollection = (response) => {
  const docs = response?.data?.data?.data || [];
  const listings = Array.isArray(docs) ? docs.map(normalizeListing) : [];

  return {
    ...response,
    data: {
      ...response.data,
      listings,
    },
  };
};

const normalizeListingItem = (response) => {
  const doc = response?.data?.data?.data || null;
  const listing = doc ? normalizeListing(doc) : null;

  return {
    ...response,
    data: {
      ...response.data,
      listing,
    },
  };
};

const toAccommodationPayload = (listingData = {}) => ({
  title: listingData.title,
  description: listingData.description,
  type: toBackendType(listingData.type),
  location: toBackendLocation(listingData.location),
  price: Math.max(1, toNumber(listingData.price, 1)),
  maxGuests: Math.max(1, toNumber(listingData.guests, 1)),
  bedrooms: Math.max(1, toNumber(listingData.bedrooms, 1)),
  bathrooms: Math.max(1, toNumber(listingData.bathrooms, 1)),
  beds: Math.max(1, toNumber(listingData.bedrooms, 1)),
  amenities: Array.isArray(listingData.amenities) ? listingData.amenities : [],
  rating: toNumber(listingData.rating, 5),
  reviews: toNumber(listingData.reviews, 0),
  enhancedCleaning: true,
  selfCheckIn: true,
    hostName: accommodation.hostName || '',
    hostJoined: accommodation.hostJoined || '',
    isSuperhost: accommodation.isSuperhost ?? true,
    hostResponseRate: accommodation.hostResponseRate || '',
    hostResponseTime: accommodation.hostResponseTime || '',
    hostBadges: Array.isArray(accommodation.hostBadges) ? accommodation.hostBadges : [],
    houseRules: Array.isArray(accommodation.houseRules) ? accommodation.houseRules : [],
    healthSafety: Array.isArray(accommodation.healthSafety) ? accommodation.healthSafety : [],
    cancellationPolicy: Array.isArray(accommodation.cancellationPolicy)
      ? accommodation.cancellationPolicy
      : [],
    footerSupport: {
      support: Array.isArray(accommodation.footerSupport?.support)
        ? accommodation.footerSupport.support
        : [],
      community: Array.isArray(accommodation.footerSupport?.community)
        ? accommodation.footerSupport.community
        : [],
      hosting: Array.isArray(accommodation.footerSupport?.hosting)
        ? accommodation.footerSupport.hosting
        : [],
      about: Array.isArray(accommodation.footerSupport?.about)
        ? accommodation.footerSupport.about
        : [],
    },
  hostName: listingData.hostName || '',
  hostJoined: listingData.hostJoined || '',
  isSuperhost: listingData.isSuperhost ?? true,
  hostResponseRate: listingData.hostResponseRate || '',
  hostResponseTime: listingData.hostResponseTime || '',
  hostBadges: Array.isArray(listingData.hostBadges) ? listingData.hostBadges : [],
  houseRules: Array.isArray(listingData.houseRules) ? listingData.houseRules : [],
  healthSafety: Array.isArray(listingData.healthSafety) ? listingData.healthSafety : [],
  cancellationPolicy: Array.isArray(listingData.cancellationPolicy)
    ? listingData.cancellationPolicy
    : [],
  footerSupport: {
    support: Array.isArray(listingData.footerSupport?.support)
      ? listingData.footerSupport.support
      : [],
    community: Array.isArray(listingData.footerSupport?.community)
      ? listingData.footerSupport.community
      : [],
    hosting: Array.isArray(listingData.footerSupport?.hosting)
      ? listingData.footerSupport.hosting
      : [],
    about: Array.isArray(listingData.footerSupport?.about)
      ? listingData.footerSupport.about
      : [],
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: async (data) => {
    const username = data?.username || data?.email?.split('@')?.[0] || `host${Date.now()}`;
    const payload = {
      name: data?.name || username,
      username,
      email: data?.email,
      password: data?.password,
      passwordConfirm: data?.passwordConfirm || data?.password,
    };

    const response = await api.post('/users/signup/host', payload);
    return normalizeAuthResponse(response);
  },
  login: async (data) => {
    const rawIdentifier = (data?.username || data?.email || '').trim();
    const username = rawIdentifier.includes('@')
      ? rawIdentifier.split('@')[0]
      : rawIdentifier;
    const email = rawIdentifier.includes('@') ? rawIdentifier : '';

    const response = await api.post('/users/login', {
      username,
      email,
      password: data?.password,
    });
    return normalizeAuthResponse(response);
  },
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return normalizeAuthResponse(response);
  },
};

// Listing endpoints
export const listingAPI = {
  createListing: async (data) => {
    const response = await api.post('/accommodations', toAccommodationPayload(data));
    return normalizeListingItem(response);
  },
  getListings: async () => {
    const response = await api.get('/accommodations/host/listings');
    return normalizeListingCollection(response);
  },
  getListing: async (id) => {
    const response = await api.get(`/accommodations/${id}`);
    return normalizeListingItem(response);
  },
  getPublicListings: async () => {
    const response = await api.get('/accommodations');
    return normalizeListingCollection(response);
  },
  getPublicListing: async (id) => {
    const response = await api.get(`/accommodations/${id}`);
    return normalizeListingItem(response);
  },
  updateListing: async (id, data) => {
    const response = await api.patch(`/accommodations/${id}`, toAccommodationPayload(data));
    return normalizeListingItem(response);
  },
  deleteListing: (id) => api.delete(`/accommodations/${id}`),
};

export const reservationAPI = {
  getHostReservations: async () => {
    const response = await api.get('/reservations/host');
    return response?.data?.data?.data || [];
  },
  getUserReservations: async () => {
    const response = await api.get('/reservations/user');
    return response?.data?.data?.data || [];
  },
};

export default api;
