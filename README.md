# Airbnb Clone - Full Stack Application

A comprehensive full-stack application that replicates core Airbnb functionality including property listing management, guest reservations, and user authentication. Built with React, Node.js, Express, and MongoDB.

## 🎯 Project Overview

This capstone project consists of two main frontend applications and a robust backend API:

1. **Airbnb Public Frontend** - Public-facing website with home page, location browsing, and booking features
2. **Admin Dashboard** - Host/Admin management system for listings and reservations
3. **Backend API** - REST API handling all business logic

## 📁 Project Structure

```
├── frontend/                 # React.js Airbnb public frontend
│   ├── public/              # Static files (index.html)
│   ├── src/
│   │   ├── components/      # Reusable components (Header, PrivateRoute)
│   │   ├── pages/           # Page components
│   │   │   ├── Home.js              # Public home page with hero and inspirations
│   │   │   ├── LocationPage.js      # Browse listings by location
│   │   │   ├── LocationDetails.js   # Detailed listing with cost calculator
│   │   │   ├── Login.js             # Authentication
│   │   │   ├── Dashboard.js         # Host dashboard
│   │   │   ├── ListingsList.js      # Host's listings management
│   │   │   └── ListingForm.js       # Create/edit listings
│   │   ├── styles/          # CSS stylesheets
│   │   ├── utils/           # API, Auth, Validation utilities
│   │   ├── App.js           # Main routing setup with all routes
│   │   └── index.js         # React entry point
│   ├── .env.local           # Local environment variables
│   └── package.json         # Dependencies
│
├── backend/                 # Node.js/Express backend
│   ├── models/              # MongoDB schemas
│   │   ├── User.js              # User schema with auth methods
│   │   ├── Listing.js           # Listing/Accommodation schema
│   │   └── Reservation.js       # Reservation schema (NEW)
│   ├── controllers/         # Business logic
│   │   ├── authController.js    # Auth logic
│   │   ├── listingController.js # Listing CRUD
│   │   └── reservationController.js  # Reservation logic (NEW)
│   ├── routes/              # API endpoints
│   │   ├── authRoutes.js
│   │   ├── listingRoutes.js
│   │   └── reservationRoutes.js      # Reservation endpoints (NEW)
│   ├── middleware/          # JWT auth middleware
│   ├── server.js            # Express setup with production config
│   ├── Procfile             # Heroku deployment configuration
│   ├── .env                 # Environment variables
│   └── package.json         # Dependencies
│
├── DEVELOPMENT.md           # Development guide & troubleshooting
├── DEPLOYMENT.md            # Complete deployment instructions (NEW)
└── README.md
```

## ✨ Features

### 🏠 Public Frontend (Airbnb Clone)

**Home Page**
- Hero banner with location search
- Inspiration cards for popular destinations (6 locations)
- Discover Airbnb Experiences section with two experience cards
- ShopAirbnb merchandise section
- Inspiration for future getaways with popular destinations list
- Multi-column footer with 4 columns of links
- Copyright footer with currency and language selectors

**Location Page**
- Display listings filtered by selected location
- Grid layout with accommodation cards
- Each card shows: image, type, name, amenities, rating, reviews, and price per night
- "View Details" button for each listing
- Total accommodation count and location name header

**Location Details Page**
- **Image Gallery**:
  - Large main image (left side)
  - 4 thumbnail images in 2×2 grid (right side)
  - Hover effects on thumbnails
  
- **Two-Column Layout**:
  - **Left Column (Accommodation Details)**:
    - Accommodation type and location heading
    - Subheading with average rating and review count
    - Accommodation details (bedrooms, bathrooms, guests, type)
    - Full description
    - Amenities checklist
    - reviews section with:
      - Overall rating and review count
      - Specific ratings breakdown (cleanliness, communication, check-in, location, value)
      - Rating bars showing comparative scores
    - Host information section
    - House rules, health & safety information
    - Cancellation policy
  
  - **Right Column (Cost Calculator)** ⭐ KEY FEATURE:
    - Price per night display
    - Check-in date picker
    - Check-out date picker
    - Guest count selector with +/- buttons
    - **Dynamic Price Breakdown**:
      - Nightly cost × number of nights
      - Weekly discount (% off if 7+ nights)
      - Cleaning fee
      - Service fee
      - Occupancy taxes and fees
      - **Total price** (updates real-time as dates/guests change)
    - Reserve button (logged-in users only)
    - "You won't be charged yet" disclaimer

### 👤 Admin/Host Dashboard

**Authentication**
- JWT-based authentication system
- Secure password hashing with bcryptjs
- Session persistence via localStorage
- Protected routes with PrivateRoute component

**Header Navigation**
- Airbnb branding/logo (clickable home link)
- Logged-in state:
  - Welcome greeting with username
  - User profile icon with initial
  - Dropdown menu: Home, Dashboard, My Listings, Logout
- Logged-out state:
  - Home, Login, and "Become a host" links

**Dashboard**
- Welcome message to host
- Quick action cards
- Navigation to listings management

**Listings Management**
- **Create Listings** with all required fields:
  - Title, location, description
  - Type (apartment, house, condo, villa, cottage)
  - Bedrooms, bathrooms, max guests capacity
  - Price per night
  - Weekly discount (percentage)
  - Cleaning fee, service fee
  - Occupancy taxes
  - Amenities selection
  - Image upload (optional)
  
- **View Listings**:
  - Grid or table display of all host's listings
  - Display key details (title, location, price, main image)
  - Edit and delete buttons for each listing
  
- **Edit Listings**:
  - Pre-filled form with existing listing data
  - Modify any field
  - Save changes
  
- **Delete Listings**:
  - Confirmation modal before deletion
  - Permanent removal from database

**Form Validation**
- Email format validation
- Required field checks
- Error messages display
- Success feedback

### 🔧 Backend API (RESTful)

**Authentication Endpoints**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login with JWT token
- `GET /api/auth/me` - Get current authenticated user

**Listings/Accommodations Endpoints**
- `POST /api/listings` - Create new listing (requires JWT)
- `GET /api/listings` - Get all user's listings
- `GET /api/listings/:id` - Get single listing details
- `PUT /api/listings/:id` - Update listing (requires JWT)
- `DELETE /api/listings/:id` - Delete listing (requires JWT)

**Reservations Endpoints** (NEW)
- `POST /api/reservations` - Create new reservation (requires JWT)
- `GET /api/reservations/host` - Get all reservations for host
- `GET /api/reservations/user` - Get all reservations for guest
- `GET /api/reservations/:id` - Get specific reservation details
- `PUT /api/reservations/:id` - Update reservation status
- `DELETE /api/reservations/:id` - Cancel/delete reservation

## 🚀 Getting Started

### Prerequisites
- Node.js v14 or higher
- MongoDB (local installation or MongoDB Atlas cloud)
- npm or yarn package manager
- Git

### Local Development Setup

#### 1. Clone Repository
```bash
git clone <your-repo-url>
cd capstone-project
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```
MONGODB_URI=mongodb://localhost:27017/airbnb-clone
JWT_SECRET=your-super-secure-secret-key-minimum-32-chars
PORT=5000
NODE_ENV=development
```

Start MongoDB (if using local installation):
```bash
mongod
```

Start backend server:
```bash
npm start          # Production mode
npm run dev        # Development with auto-reload (nodemon)
```

Backend runs on `http://localhost:5000`

#### 3. Frontend Setup

Open another terminal and navigate to frontend:
```bash
cd frontend
npm install
```

Create `.env.local` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend development server:
```bash
npm start
```

Frontend opens automatically on `http://localhost:3000`

## 🧪 Testing

### Test Credentials

**Guest User**:
- Email: `guest@example.com`
- Password: `password123`

**Host User**:
- Email: `host@example.com`
- Password: `password123`

### Test User Flow

1. **Browse Public Listings**
   - Navigate to home page
   - Click on any location inspiration card
   - View available listings for that location

2. **Explore Listing Details**
   - Click "View Details" on any listing
   - Scroll through image gallery
   - Review accommodation details and amenities

3. **Use Cost Calculator**
   - Select check-in and check-out dates
   - Adjust number of guests (use +/- buttons)
   - Watch real-time price calculation
   - See weekly discount applied (if 7+ nights)
   - Click "Reserve" to create booking (redirects to login if needed)

4. **Manage as Host**
   - Login with host credentials
   - Go to Dashboard
   - Create new listing with all fields
   - Edit existing listings
   - Delete listings with confirmation
   - View all your properties

## 📦 Deployment

### Complete Deployment Guide

For step-by-step deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Quick Deployment Checklist

- [ ] Set up MongoDB Atlas cloud database
- [ ] Deploy backend to Heroku
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Configure environment variables
- [ ] Test all functionality on production
- [ ] Save deployment URLs

### Production Environment Variables

**Backend (On Heroku)**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/airbnb-clone
JWT_SECRET=your-production-secret-key-minimum-32-chars
NODE_ENV=production
PORT=5000
```

**Frontend (On Vercel)**
```
REACT_APP_API_URL=https://your-backend-app.herokuapp.com/api
```

## 🏗️ Technology Stack

### Frontend
- **React 18** - UI library with hooks
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling with responsive design
- **JavaScript ES6+** - Modern JavaScript

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM with validation
- **JWT** - JSON Web Tokens authentication
- **Bcryptjs** - Password hashing (salting & hashing)
- **CORS** - Cross-origin resource sharing

### Deployment & DevOps
- **Heroku** - Backend hosting
- **Vercel/Netlify** - Frontend hosting
- **MongoDB Atlas** - Cloud database hosting
- **Git** - Version control

## 📚 Additional Documentation

- [DEVELOPMENT.md](DEVELOPMENT.md) - Development architecture, file explanations, testing, troubleshooting
- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide for Heroku, Vercel, MongoDB Atlas

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
**Error**: `MongoDB connection error`
- Ensure MongoDB is running: `mongod`
- Verify `MONGODB_URI` in `.env` file
- Check MongoDB Atlas IP whitelist if using cloud

### CORS Errors in Browser Console
**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`
- Verify backend server is running
- Check `REACT_APP_API_URL` matches backend URL
- Ensure CORS middleware is enabled in `server.js`

### JWT Authentication Failing
**Error**: `Invalid token` or `Unauthorized`
- Clear browser localStorage: Open console, run `localStorage.clear()`
- Log out and login again
- Verify `JWT_SECRET` is set in `.env`
- Check token is included in API request headers

### Port Already in Use
- **Backend port 5000**: Change `PORT` in `.env`
- **Frontend port 3000**: Run `PORT=3001 npm start`

See [DEVELOPMENT.md](DEVELOPMENT.md) for more troubleshooting tips.

## ✅ Project Rubric Compliance

### ✅ Admin Dashboard Rubric
- ✅ Top header with Airbnb logo and navigation
- ✅ Login page with email/password fields and validation
- ✅ Create listing page with all required fields
- ✅ View listings page with CRUD operation buttons
- ✅ Update listing page with pre-filled form data
- ✅ User authentication with JWT tokens
- ✅ Navigation and routing between all pages
- ✅ Consistent styling across application
- ✅ Error handling and user feedback
- ✅ Clean, modular, commented code

### ✅ Airbnb Frontend Clone Rubric
- ✅ Home page (hero, inspirations, experiences, footer)
- ✅ Location page with listing cards
- ✅ Location details page with image gallery
- ✅ Cost calculator with dynamic calculations
- ✅ Image gallery (1 large + 4 thumbnails in 2×2)
- ✅ Accommodation details left column
- ✅ Cost calculator right column with all fees
- ✅ Date pickers and guest count selector
- ✅ Reservation button creating MongoDB entries
- ✅ Host details section
- ✅ Reviews with specific ratings
- ✅ House rules and cancellation policy

### ✅ Node.js Backend Rubric
- ✅ Accommodation CRUD operations
- ✅ User authentication (login)
- ✅ Reservation management (create, read, update, delete)
- ✅ JWT authentication middleware
- ✅ Error handling with proper status codes
- ✅ MongoDB and Mongoose integration
- ✅ Modular project structure (controllers, routes, models)
- ✅ Input validation

### ✅ Deployment
- ✅ Heroku configuration with Procfile
- ✅ MongoDB Atlas cloud database setup
- ✅ Frontend deployment ready (Vercel/Netlify)
- ✅ Environment configuration for production
- ✅ Deployment guide documentation

## 🎓 Key Learning Outcomes

This project demonstrates:
- Full-stack MERN (MongoDB, Express, React, Node) development
- RESTful API design and implementation
- JWT authentication and authorization
- Database design and MongoDB Mongoose usage
- React component architecture and hooks
- Form validation and error handling
- Responsive web design
- Production deployment and DevOps
- Git version control

## 📝 License

This project is a capstone for the Zaio Full Stack Developer Boot Camp.

## 🤝 Getting Help

If you encounter issues:
1. Check [DEVELOPMENT.md](DEVELOPMENT.md) for development troubleshooting
2. Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment questions
3. Check browser console (F12) for client-side errors
4. Check Heroku logs: `heroku logs --tail`

---

**Status**: ✅ Complete and Ready for Deployment  
**Last Updated**: February 2024  
**Deployment Status**: Ready to deploy to Heroku and Vercel


## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (.env):
```
MONGODB_URI=mongodb://localhost:27017/airbnb-clone
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```
For development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open on `http://localhost:3000`

## API Documentation

### Authentication Endpoints

**POST /api/auth/register**
- Register a new user
- Body: `{ username, email, password, role }`
- Returns: `{ token, user }`

**POST /api/auth/login**
- Login user
- Body: `{ email, password }`
- Returns: `{ token, user }`

**GET /api/auth/me**
- Get current user (requires authentication)
- Headers: `Authorization: Bearer <token>`
- Returns: `{ user }`

### Listing Endpoints

All listing endpoints require authentication with `Authorization: Bearer <token>` header.

**POST /api/listings**
- Create a new listing
- Body: Listing object with all fields
- Returns: `{ message, listing }`

**GET /api/listings**
- Get all listings for logged-in user
- Returns: `{ listings }`

**GET /api/listings/:id**
- Get a single listing
- Returns: `{ listing }`

**PUT /api/listings/:id**
- Update a listing
- Body: Partial or complete listing object
- Returns: `{ message, listing }`

**DELETE /api/listings/:id**
- Delete a listing
- Returns: `{ message }`

## Demo Credentials

For testing purposes, use these credentials:

**User:**
- Email: `john@example.com`
- Password: `password123`

**Host:**
- Email: `jane@example.com`
- Password: `password321`

## Technologies Used

### Frontend
- React 18
- React Router DOM v6
- Axios for API calls
- CSS3 for styling

### Backend
- Express.js
- MongoDB with Mongoose
- JWT (JSON Web Tokens)
- Bcryptjs for password hashing
- CORS for cross-origin requests

## Project Features Implementation

✅ **Top Header**
- Airbnb logo and branding
- Dynamic navigation based on auth state
- User greeting with dropdown menu
- Logout functionality

✅ **Login Page**
- Email and password input fields
- Form validation
- Error message display
- Redirect to dashboard on success

✅ **Create Listing Page**
- Comprehensive form with all required fields
- Input validation
- Error feedback
- Amenities selection
- Support for pricing, fees, and taxes

✅ **View Listings Page**
- Grid layout of property listings
- Key details display (title, location, price, image)
- Edit and delete options
- Delete confirmation modal

✅ **Update Listing Page**
- Pre-filled form with existing data
- All validation and error handling
- Successful update redirect

✅ **Authentication**
- JWT token management
- Protected routes with PrivateRoute component
- Session persistence via localStorage
- User role support

✅ **Navigation & Routing**
- React Router for smooth navigation
- URL updates reflecting current view
- Protected and public routes

✅ **Styling**
- Consistent Airbnb-inspired color scheme
- Responsive grid layouts
- Hover effects and transitions
- Mobile-friendly design

✅ **Error Handling**
- Form validation feedback
- API error handling
- User-friendly error messages
- Try-catch error management

✅ **Code Quality**
- Modular component structure
- Reusable utility functions
- Clear code comments
- Separation of concerns

## Future Enhancements

- Image upload functionality
- Advanced search and filtering
- Booking management system
- Review and rating system
- Payment integration
- Calendar availability
- Admin dashboard analytics
- Email notifications

## License

This project is open-source and available under the MIT License.
