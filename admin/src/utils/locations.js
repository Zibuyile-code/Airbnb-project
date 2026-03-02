export const DESTINATION_OPTIONS = [
  {
    name: 'New York',
    image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'London',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Paris',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Sydney',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Barcelona',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Rome',
    image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Amsterdam',
    image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Singapore',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=400&q=80',
  },
];

export const LOCATION_NAMES = DESTINATION_OPTIONS.map((destination) => destination.name);

export const normalizeLocationName = (value = '') => String(value).trim().toLowerCase();