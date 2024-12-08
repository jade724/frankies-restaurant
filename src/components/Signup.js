import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Function to send signup data to the server
  const handleSignup = async (name, email, password, confirmPassword) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
  
      let result;
  
      // Attempt to parse JSON; fallback to plain text
      try {
        result = await response.json();
      } catch (error) {
        result = { message: await response.text() };
      }
  
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create account.');
      }
  
      return { success: true, message: result.message, token: result.token };
    } catch (error) {
      console.error('Signup error:', error.message);
      return { success: false, message: error.message };
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
  
    if (!name || !email || !password || !confirmPassword) {
      setMessage('All fields are required.');
      return;
    }
  
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
  
    const result = await handleSignup(name, email, password, confirmPassword);
  
    if (result.success) {
      setMessage('Account created successfully!');
      navigate('/login');
    } else {
      setMessage(result.message);
    }
  };
  

  return (
    <div className="signup-container">
      <section className="hero-section">
        <div className="container">
          <h1 className="display-4 text-center">Create Your Account</h1>
        </div>
      </section>
        
      <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            />
        </div>
        
        </form>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {message && <p>{message}</p>}

          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
