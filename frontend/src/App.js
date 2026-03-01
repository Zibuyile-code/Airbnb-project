import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ListingsList from './pages/ListingsList';
import ListingForm from './pages/ListingForm';
import Home from './pages/Home';
import LocationPage from './pages/LocationPage';
import LocationDetails from './pages/LocationDetails';
import Reservations from './pages/Reservations';
import PrivateRoute from './components/PrivateRoute';
import './styles/index.css';

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/locations/:location" element={<LocationPage />} />
          <Route path="/listings/:id" element={<LocationDetails />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/listings"
            element={
              <PrivateRoute>
                <ListingsList />
              </PrivateRoute>
            }
          />

          <Route
            path="/reservations"
            element={
              <PrivateRoute>
                <Reservations />
              </PrivateRoute>
            }
          />

          <Route
            path="/listings/create"
            element={
              <PrivateRoute>
                <ListingForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/add-hotel"
            element={
              <PrivateRoute>
                <ListingForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/listings/edit/:id"
            element={
              <PrivateRoute>
                <ListingForm isEditMode={true} />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
