# 🏡 Capstone Backend API

Welcome to the Capstone Backend API, a production-ready REST API designed for an Airbnb-style accommodation platform. Built using Node.js, Express, and MongoDB, this backend features robust capabilities for handling authentication, accommodations, reservations, and secure file uploads.

## 🚀 Overview

This backend serves as the backbone of the full-stack accommodation platform, delivering secure and scalable REST endpoints for users, listings, and reservations. Key functionalities include authentication, validation, error handling, and image upload support using Multer.

Designed with clean architectural principles, this API boasts modular controllers and reusable utilities, ensuring maintainability and efficiency.

## ✨ Key Features

- **User Authentication (JWT)**
- **User Profile Management**
- **Accommodation CRUD Operations**
- **Reservation Management**
- **Image Uploads with Multer**
- **Centralized Error Handling**
- **Input Validation**
- **CORS Support for Frontend Integration**
- **Environment-Based Configuration**

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (for image uploads)
- dotenv
- CORS

## 🧩 System Architecture
```
┌──────────────────────────────────────────┐
│               React Frontend             │
│------------------------------------------│
│ - Authentication pages                   │
│ - Accommodation listings                 │
│ - Reservation flow                       │
│ - Profile management                     │
└───────────────────────┬──────────────────┘
                        │  HTTPS (Axios)
                        ▼
┌───────────────────────────────────────────────────┐
│             Express Backend API                   │
│---------------------------------------------------│
│ Routes: /users /accommodations /reservations      │
│ Controllers: User, Accommodation, Reservation     │
│ Middleware: Auth, Multer (uploads), Error Handler │
│ Business Logic: Validation, Permissions, Pricing  │
└───────────────────────┬───────────────────────────┘  
                        │  Mongoose ODM
                        ▼
┌──────────────────────────────────────────────────┐
│                 MongoDB                          │
│--------------------------------------------------│
│ Collections: Users, Accommodations, Reservations │
│ Relationships handled via ObjectId refs          │
└──────────────────────────────────────────────────┘
```
## 🗄️ Database Schema (Text Diagram)
```
┌──────────────────────────────────────────┐
│                  User                    │
├──────────────────────────────────────────┤
│ _id: ObjectId                            │
│ name: String                             │
│ email: String (unique)                   │
│ username: String (unique)                │
│ photo: String                            │
│ photoPath: String                        │
│ role: 'user' | 'host'                    │
│ password: String (hashed)                │
└───────────────────────┬──────────────────┘
                        │ 1-to-many (host)
                        ▼
┌───────────────────────────────────────────────┐
│              Accommodation                    │
├───────────────────────────────────────────────┤
│ _id: ObjectId                                 │
│ title: String (unique)                        │
│ description: String                           │
│ type: 'Entire Unit' | 'Room' | 'Whole Villa'  │
│ location: Enum                                │
│ images: [{ url, path }]                       │
│ maxGuests: Number                             │
│ bedrooms: Number                              │
│ bathrooms: Number                             │
│ beds: Number                                  │
│ rating: Number                                │
│ reviews: Number                               │
│ price: Number                                 │
│ enhancedCleaning: Boolean                     │
│ selfCheckIn: Boolean                          │
│ amenities: [String]                           │
│ host_id: ObjectId → User                      │
└───────────────────────┬───────────────────────┘
                        │ 1-to-many (guest)
                        ▼
┌─────────────────────────────────────────────┐
│               Reservation                   │
├─────────────────────────────────────────────┤
│ _id: ObjectId                               │
│ title: String                               │
│ type: String                                │
│ location: String                            │
│ images: [String]                            │
│ maxGuests: Number                           │
│ bedrooms: Number                            │
│ price: Number                               │
│ checkIn: Date                               │
│ checkOut: Date                              │
│ host_id: ObjectId → User                    │
│ user_id: ObjectId → User                    │
│ host: String                                │
│ user: String                                │
│ username: String                            │
│ weeklyDiscount: Number                      │
│ cleaningFee: Number                         │
│ serviceFee: Number                          │
│ occupancyTaxes: Number                      │
│ specificRatings: { cleanliness, checkIn,    │
│ communication, accuracy, location, value }  │
└─────────────────────────────────────────────┘
```

## 🔗 ERD (Entity Relationship Diagram)

```
┌──────────────┐
│     User     │
│   (Host)     │
└───────┬──────┘
       │ 1-to-many
       ▼
┌───────────────┐
│ Accommodation │
└───────┬───────┘
       │ 1-to-many (optional future)
       ▼
┌──────────────┐
│ Reservation  │
└───────┬──────┘
       │ many-to-1
       ▼
┌──────────────┐
│     User     │
│   (Guest)    │
└──────────────┘

```

## 📬 Postman Collection

<img width="1475" height="653" alt="image" src="https://github.com/user-attachments/assets/359c8f7f-6e71-4fd5-a2b4-b31dbb7bec44" />

## 📁 Project Structure

```plaintext
backend/
├── app.js
├── server.js
├── config.env
├── controllers/
├── models/
├── routes/
├── utils/
└── uploads/
```

## 🔌 API Endpoints

### Users

- **POST /api/users/signup** – Register
- **POST /api/users/login** – Login
- **GET /api/users/me** – Get current user

### Accommodations

- **GET /api/accommodations** – List all
- **POST /api/accommodations** – Create
- **GET /api/accommodations/:id** – Get by ID
- **PATCH /api/accommodations/:id** – Update
- **DELETE /api/accommodations/:id** – Delete

### Reservations

- **GET /api/reservations** – List all
- **POST /api/reservations** – Create
- **GET /api/reservations/:id** – Get by ID
- **PATCH /api/reservations/:id** – Update
- **DELETE /api/reservations/:id** – Delete

## ▶️ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas or local MongoDB

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/MatomeGabriel/air-bnb-backend
    cd Capstone/backend
    npm install
    ```

### Environment Variables

Create a config.env file with the following variables:

```plaintext
CLIENT_ORIGIN=
PORT=
DATABASE=
DATABASE_PASSWORD=
DATABASE_USERNAME=
FIREBASE_ADMIN_KEY=
JWT_SECRET=
JWT_EXPIRES_IN=
NODE_ENV=
JWT_COOKIE_EXPIRES_IN=
```

### Run the Server

Start the application with:
```bash
npm run start
```

## 🧠 What I Learned

- Designing REST APIs with a clean, modular architecture
- Implementing secure JWT authentication
- Handling file uploads and validation effectively
- Structuring controllers, routes, and models for scalability
- Managing environment variables and deployment configurations

## ☁️ Deployment

This backend can be deployed on various platforms, including:

- Render
- Railway
- Heroku
- AWS EC2
- DigitalOcean

Feel free to reach out for more information or questions regarding this project!
