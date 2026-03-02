import React, { useEffect, useState } from 'react';
import { reservationAPI } from '../utils/api';
import '../styles/Reservations.css';

const formatDate = (value) => {
  if (!value) return '—';
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return '—';
  return parsedDate.toLocaleDateString();
};

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationAPI.getHostReservations();
        setReservations(Array.isArray(data) ? data : []);
        setInfoMessage('');
      } catch (error) {
        setReservations([]);
        setInfoMessage('Reservations are temporarily unavailable. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="reservations-page">
      <div className="reservations-header">
        <h1>Reservations</h1>
        <p>View reservation activity for your hosted listings.</p>
      </div>

      {infoMessage && <p className="reservations-info">{infoMessage}</p>}

      {loading ? (
        <p className="reservations-loading">Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <div className="reservations-empty">
          <h2>No reservations yet</h2>
          <p>Your reservation table will appear here once guests start booking.</p>
        </div>
      ) : (
        <div className="reservations-table-wrap">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Listing</th>
                <th>Location</th>
                <th>Check in</th>
                <th>Check out</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{reservation.username || reservation.user || 'Guest'}</td>
                  <td>{reservation.title || 'Listing'}</td>
                  <td>{reservation.location || '—'}</td>
                  <td>{formatDate(reservation.checkIn)}</td>
                  <td>{formatDate(reservation.checkOut)}</td>
                  <td>${Math.round(Number(reservation.totalPrice || reservation.price || 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reservations;
