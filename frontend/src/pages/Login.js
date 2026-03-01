import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { setToken, setUser } from '../utils/auth';
import { validatePassword } from '../utils/validation';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Username or email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await authAPI.login(formData);
      
      // Store token and user data
      setToken(response.data.token);
      setUser(response.data.user);

      setMessageType('success');
      setMessage('Login successful! Redirecting...');

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      const enteredIdentifier = String(formData.email || '').trim().toLowerCase();
      const isDemoCredentials =
        (enteredIdentifier === 'princessheaven82' || enteredIdentifier === 'princessheaven82@gmail.com') &&
        formData.password === 'password123';

      if (!error.response && process.env.NODE_ENV !== 'production' && isDemoCredentials) {
        const demoUser = {
          username: 'princessheaven82',
          email: 'princessheaven82@gmail.com',
          role: 'host',
        };
        setToken('dev-offline-token');
        setUser(demoUser);
        setMessageType('success');
        setMessage('Logged in with demo mode (API unavailable). Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
        return;
      }

      setMessageType('error');
      setMessage(
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-shell">
        <section className="login-showcase" aria-label="Login preview">
          <div className="showcase-overlay">
            <p className="showcase-kicker">Host tools</p>
            <h1>Manage listings with a clean Airbnb-like console</h1>
            <p className="showcase-text">
              Control inventory, pricing, and reservation readiness from one dashboard.
            </p>
          </div>
        </section>

        <section className="login-card">
          <div className="airbnb-logo">airbnb</div>
          <h2>Welcome back</h2>

          {message && (
            <div className={`alert alert-${messageType}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Username or Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="username or name@email.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          {process.env.NODE_ENV !== 'production' && (
            <div className="demo-credentials">
              <p>Demo credentials</p>
              <p>Username: princessheaven82</p>
              <p>Password: password123</p>
            </div>
          )}
        </section>
      </div>

      <div className="login-mobile-note">
        <p>Sign in to manage listings and host operations.</p>
      </div>
    </div>
  );
};

export default Login;
