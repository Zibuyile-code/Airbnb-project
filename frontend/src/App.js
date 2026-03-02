import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Home from './pages/Home';
import LocationPage from './pages/LocationPage';
import LocationDetails from './pages/LocationDetails';
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
