import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({ date: '', time: '', party_size: 1 });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch existing bookings
  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to view bookings.');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/api/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 403) {
            setMessage('Session expired. Please log in again.');
            localStorage.removeItem('token');
            navigate('/login');
          } else {
            throw new Error('Failed to fetch bookings.');
          }
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        setMessage(error.message);
      }
    };

    fetchBookings();
  }, [navigate]);

  // Handle booking creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.date || !formData.time || formData.party_size <= 0) {
      setMessage('Please fill in all fields correctly.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to create a booking.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 403) {
          setMessage('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create booking.');
        }
      }

      const newBooking = await response.json();
      setBookings([...bookings, newBooking]);
      setMessage('Booking created successfully!');
      setFormData({ date: '', time: '', party_size: 1 });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="booking-page">
      <h1>Booking</h1>
      {message && <div className="alert">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="party_size">Party Size:</label>
          <input
            type="number"
            id="party_size"
            name="party_size"
            value={formData.party_size}
            onChange={(e) => setFormData({ ...formData, party_size: parseInt(e.target.value, 10) })}
            required
          />
        </div>
        <button type="submit">Create Booking</button>
      </form>

      <div className="booking-list">
        <h2>Your Bookings</h2>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <div className="booking-info">
                <p className="booking-date">Date: {new Date(booking.date).toLocaleDateString()}</p>
                <p className="booking-time">Time: {booking.time}</p>
                <p className="booking-guests">Guests: {booking.party_size}</p>
              </div>
              <p className="edit-info">
                To edit or delete this booking, please visit your <a href="/account">Account</a> page.
              </p>
            </div>
          ))
        ) : (
          <p>No bookings available.</p>
        )}
      </div>
    </div>
  );
};

export default Booking;
