# Airbnb Admin Dashboard - Development Guide

## Getting Started

This guide will help you set up and run the Airbnb Clone Admin Dashboard project.

## Quick Start

### 1. Start MongoDB

Make sure MongoDB is running on your system. You can start it with:

```bash
mongod
```

Or use MongoDB Atlas (cloud) by updating the MONGODB_URI in the .env file.

### 2. Start the Backend

```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:5000`

### 3. Start the Frontend

In a new terminal:

```bash
cd frontend
npm install
npm start
```

The frontend will open on `http://localhost:3000`

## Project Overview

### Frontend Architecture

- **React 18** with functional components and hooks
- **React Router v6** for navigation
- **Axios** for HTTP requests with interceptors for JWT tokens
- **CSS3** for styling with a responsive design approach

### Key Components

1. **Header** - Navigation with user profile dropdown
2. **Login** - Authentication form with validation
3. **Dashboard** - Welcome page with quick actions
4. **ListingsList** - Grid view of all listings
5. **ListingForm** - Form for creating/editing listings
6. **PrivateRoute** - Protected route wrapper

### Backend Architecture

- **Express.js** server with modular structure
- **MongoDB** for data persistence
- **Mongoose** for schema validation and ODM
- **JWT** for authentication
- **Bcryptjs** for password hashing

### Key Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

**Listings:**
- `POST /api/listings` - Create listing
- `GET /api/listings` - Get user's listings
- `GET /api/listings/:id` - Get single listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

## File Structure Explanation

### Frontend Files

- `src/App.js` - Main routing setup
- `src/components/Header.js` - Top navigation bar
- `src/components/PrivateRoute.js` - Route protection
- `src/pages/Login.js` - Login page
- `src/pages/Dashboard.js` - Main dashboard
- `src/pages/ListingsList.js` - Listings grid
- `src/pages/ListingForm.js` - Create/edit form
- `src/utils/api.js` - API configuration and endpoints
- `src/utils/auth.js` - Authentication utilities
- `src/utils/validation.js` - Form validation functions

### Backend Files

- `server.js` - Express server setup
- `models/User.js` - User schema and methods
- `models/Listing.js` - Listing schema
- `controllers/authController.js` - Auth logic
- `controllers/listingController.js` - Listing logic
- `routes/authRoutes.js` - Auth endpoints
- `routes/listingRoutes.js` - Listing endpoints
- `middleware/auth.js` - JWT verification

## Testing the Application

### Create a Demo User

1. Login with demo credentials:
   - Email: john@example.com
   - Password: password123

### Create a Listing

1. Click "Create New Listing" button
2. Fill in all required fields
3. Select amenities
4. Click "Create Listing"

### Update a Listing

1. Click "Edit" on any listing
2. Modify the details
3. Click "Update Listing"

### Delete a Listing

1. Click "Delete" on any listing
2. Confirm deletion in modal

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify MongoDB is accessible on localhost:27017

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Specify port with `PORT=3001 npm start`

### CORS Errors
- Ensure backend is running
- Check API_BASE_URL in frontend code
- Verify CORS is enabled in server.js

### JWT Token Issues
- Clear localStorage and login again
- Check JWT_SECRET in .env
- Verify token is being sent in Authorization header

## Development Tips

1. **Use React DevTools** - Install browser extension for debugging
2. **Check Console** - Open browser console to see errors
3. **Network Tab** - Monitor API requests
4. **Postman** - Test API endpoints directly
5. **VS Code Extensions** - Install ES7+ and Prettier for better development

## Making Changes

### Frontend Changes
- Edit files in `src/` folder
- Changes auto-refresh in browser
- Check console for errors

### Backend Changes
- Use `npm run dev` for auto-reload with nodemon
- Restart server after changing models or middleware
- Test endpoints with Postman

## Performance Tips

- Use React.memo() for expensive components
- Implement pagination for large listing lists
- Cache API responses with localStorage
- Lazy load images
- Minimize bundle size

## Security Notes

- Never commit .env files
- Change JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting
- Validate all user inputs
- Use environment-specific configurations

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
```

### Backend (Heroku/Railway/Render)
```bash
# Update MONGODB_URI to cloud MongoDB
# Update JWT_SECRET
# Deploy with your chosen platform
```

## Support & Resources

- React Documentation: https://react.dev
- Express.js: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- React Router: https://reactrouter.com
- Axios: https://axios-http.com
