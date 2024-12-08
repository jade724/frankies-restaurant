import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to log in.');
      }

      // Save JWT token and user data to localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('userEmail', email); // Optionally save user email

      return { success: true, message: result.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const result = await handleLogin(email, password);

    if (result.success) {
      setMessage('Login successful!');
      navigate('/'); // Redirect to home page
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="login-page">
      <section className="hero-section">
        <div className="container">
          <h1 className="display-4 text-center">Welcome Back!</h1>
          <p className="lead text-center">Please login to continue</p>
        </div>
      </section>

      <div className="login-form-section">
        <div className="container">
          <h2>Login</h2>
          {message && <div className="alert alert-info">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">Login</button>
          </form>

          <div className="create-account-section text-center mt-3">
            <p>Don't have an account? <a href="/signup">Create one here</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
