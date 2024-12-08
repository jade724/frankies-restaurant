import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem('token'); // Check if user is logged in
  const [userName, setUserName] = useState('');  // Retrieve user name from localStorage

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName); // Set from localStorage if present
    } else if (isLoggedIn) {
      fetchUserName(); // Fetch from API if not in localStorage
    }
  }, [isLoggedIn]);

  // If the user is logged in and there's no userName, we should fetch it from the server.
  const fetchUserName = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserName(data.name); // Set the userName from the response
        localStorage.setItem('userName', data.name); // Store it in localStorage
      } catch (error) {
        console.error(error.message);
      }
    }
  };

 
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/assets/logo.png" alt="Frankie's Logo" height="50" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/menu">Menu</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/booking">Booking</Link>
            </li>

            {/* Account Button for Logged-in Users */}
            {isLoggedIn && userName && (
              <li className="nav-item">
                <Link className="nav-link account-btn" to="/account">
                <i className="bi bi-person-circle me-2" style={{ fontSize: '1.5rem' }}></i> {/* Icon */}
                  <span>{`Hello, ${userName}`}</span> {/* Greet the user */}
                </Link>
              </li>
            )}
            {!isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/signup">Signup</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
