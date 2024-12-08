import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [bookings, setBookings] = useState([]); // State for bookings
  const [editBooking, setEditBooking] = useState(null); // State for editing a booking
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', party_size: 1 }); // Booking form state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to access this page.');
        navigate('/login');
        return;
      }

      try {
        // Fetch user details
        const userResponse = await fetch('/api/account', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch account details.');
        }

        const userData = await userResponse.json();
        setFormData({ name: userData.name, email: userData.email });

        // Fetch bookings
        const bookingsResponse = await fetch('/api/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!bookingsResponse.ok) {
          throw new Error('Failed to fetch bookings.');
        }

        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      } catch (error) {
        setMessage(error.message);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessMessage('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to update your account.');
      return;
    }

    try {
      const response = await fetch('/api/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update account.');
      }

      setSuccessMessage('Account updated successfully!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to delete your account.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const response = await fetch('/api/account', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete account.');
      }

      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      navigate('/');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const handleEditBooking = (booking) => {
    setEditBooking(booking);
    setBookingForm({ date: booking.date, time: booking.time, party_size: booking.party_size });
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to update bookings.');
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${editBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking.');
      }

      const updatedBookings = bookings.map((b) =>
        b.id === editBooking.id ? { ...editBooking, ...bookingForm } : b
      );

      setBookings(updatedBookings);
      setEditBooking(null);
      setSuccessMessage('Booking updated successfully!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to delete bookings.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this booking?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete booking.');
      }

      setBookings(bookings.filter((b) => b.id !== bookingId));
      setSuccessMessage('Booking deleted successfully!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="account-page">
      <div className="account-header">
        <h1>My Account</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      {message && <p className="error-message">{message}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* Account Update Form */}
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="New Password"
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm New Password"
        />
        <button type="submit">Update Account</button>
      </form>

      <button onClick={handleDelete}className="logout-button">Delete Account</button>

      {/* Bookings Management */}
      <div className="bookings-section">
        <h2>Your Bookings</h2>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <div className="booking-info">
                <p className="booking-date">Date: {new Date(booking.date).toLocaleDateString()}</p>
                <p className="booking-time">Time: {booking.time}</p>
                <p className="booking-guests">Guests: {booking.party_size}</p>
              </div>
              <div className="actions">
                <button onClick={() => handleEditBooking(booking)} className="btn-edit">Edit</button>
                <button onClick={() => handleDeleteBooking(booking.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No bookings available.</p>
        )}

        {editBooking && (
          <form onSubmit={handleUpdateBooking} className="edit-booking-form">
            <h3>Edit Booking</h3>
            <input
              type="date"
              name="date"
              value={bookingForm.date}
              onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
              required
            />
            <input
              type="time"
              name="time"
              value={bookingForm.time}
              onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
              required
            />
            <input
              type="number"
              name="party_size"
              value={bookingForm.party_size}
              onChange={(e) => setBookingForm({ ...bookingForm, party_size: parseInt(e.target.value, 10) })}
              required
            />
            <button type="submit">Update Booking</button>
          </form>
        )}
      </div>
    </div>
  );
};


export default Account;
