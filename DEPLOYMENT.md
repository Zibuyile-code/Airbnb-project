# Deployment Guide

This guide will help you deploy your Airbnb Clone application on Heroku.

## Prerequisites

1. Heroku Account: Sign up at https://www.heroku.com/
2. Heroku CLI: Download from https://devcenter.heroku.com/articles/heroku-cli
3. Git: Make sure Git is installed on your system
4. MongoDB Atlas Account: Sign up at https://www.mongodb.com/cloud/atlas

## Step 1: Set up MongoDB Atlas (Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new account or log in
3. Create a new cluster (choose the free tier)
4. Create a database user with username and password
5. Get your connection string (it should look like):
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>?retryWrites=true&w=majority
   ```
6. Keep this connection string safe - you'll need it later

## Step 2: Prepare Backend for Deployment

1. Create a `.env.production` file in the backend directory with:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/airbnb-clone?retryWrites=true&w=majority
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   NODE_ENV=production
   PORT=5000
   ```

2. Update `backend/package.json` to ensure you have the build script:
   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "nodemon server.js"
   }
   ```

3. Make sure all dependencies are in `package.json` (not in devDependencies):
   - express
   - mongoose
   - cors
   - bcryptjs
   - jwt-simple
   - dotenv

## Step 3: Deploy Backend to Heroku

1. Open terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create a new Heroku app:
   ```bash
   heroku create <your-app-name>
   ```
   Example: `heroku create airbnb-clone-backend`

4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/airbnb-clone?retryWrites=true&w=majority"
   heroku config:set JWT_SECRET="your_super_secure_jwt_secret_key_here"
   heroku config:set NODE_ENV="production"
   ```

5. Deploy to Heroku:
   ```bash
   git push heroku main
   ```

6. View logs to check for errors:
   ```bash
   heroku logs --tail
   ```

7. Your backend should now be live at:
   ```
   https://<your-app-name>.herokuapp.com
   ```

## Step 4: Prepare Frontend for Deployment

1. Create a `.env.production` file in the frontend directory:
   ```
   REACT_APP_API_URL=https://<your-backend-app-name>.herokuapp.com/api
   ```
   Example: `https://airbnb-clone-backend.herokuapp.com/api`

2. Update `frontend/src/utils/api.js` to use the environment variable:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
   ```

3. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

## Step 5: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up (you can use your GitHub account)

2. Connect your GitHub repository

3. Select your repository

4. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Root Directory: `frontend`

5. Add environment variables:
   - Name: `REACT_APP_API_URL`
   - Value: `https://<your-backend-app-name>.herokuapp.com/api`

6. Click "Deploy"

7. Your frontend will be live at the Vercel URL provided

## Alternative: Deploy Frontend to Heroku

If you prefer to deploy both frontend and backend on Heroku:

1. In the root directory, create a Procfile:
   ```
   web: cd frontend && npm run build && cd .. && node backend/server.js
   ```

2. Update backend/server.js to serve static frontend files:
   ```javascript
   const path = require('path');

   // After routes
   app.use(express.static(path.join(__dirname, '../frontend/build')));

   // Serve React app for all other routes
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
   });
   ```

3. Update frontend/src/utils/api.js:
   ```javascript
   const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';
   ```

4. From root directory:
   ```bash
   heroku create <your-app-name>
   heroku config:set MONGODB_URI="..."
   heroku config:set JWT_SECRET="..."
   git push heroku main
   ```

## Step 6: Test Your Deployment

1. Visit your frontend URL
2. Test the login functionality
3. Create a test listing
4. Create a test reservation
5. Check Heroku logs for any errors:
   ```bash
   heroku logs --tail
   ```

## Troubleshooting

### Application Error: H10 (App crashed)
Check logs: `heroku logs --tail`
Usually caused by missing environment variables or MongoDB connection issues.

### CORS Errors
Make sure your backend has CORS enabled and the frontend is making requests to the correct API URL.

### MongoDB Connection Errors
Verify your MongoDB Atlas connection string and ensure your IP is whitelisted in MongoDB Atlas.

### "Cannot find module" errors
Run `npm install` in both frontend and backend directories and redeploy.

## Environment Variables Checklist

**Backend (.env or Heroku config)**:
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] NODE_ENV=production
- [ ] PORT=5000

**Frontend (.env.production)**:
- [ ] REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api

## Final Deployment URLs

Save these URLs for reference:

- Backend URL: https://<your-backend-app-name>.herokuapp.com
- Frontend URL: https://<your-frontend-app-name>.vercel.app or herokuapp.com

## Next Steps

After deployment:
1. Monitor application performance
2. Set up error tracking (Sentry, etc.)
3. Set up monitoring and alerts
4. Enable HTTPS (usually automatic)
5. Consider adding a custom domain

## Support

For issues:
- Heroku docs: https://devcenter.heroku.com
- Vercel docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
