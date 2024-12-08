const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Jadesola7.',
  database: process.env.DB_NAME || 'frankies_restaurant',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database.');
});


// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract Bearer token
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.error('Token expired:', err);
        return res.status(403).json({ error: 'Token expired. Please log in again.' });
      }
      console.error('Invalid token:', err);
      return res.status(403).json({ error: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
};



// **Signup Route for Customers**
app.post('/api/signup', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validation: Ensure all fields are provided
  if (!name || !email || !password || !confirmPassword) {
    console.error('Validation failed: Missing fields');
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Validation: Ensure passwords match
  if (password !== confirmPassword) {
    console.error('Validation failed: Passwords do not match');
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ message: 'Error hashing password' });
    }

    // Check if email already exists
    const query = 'SELECT * FROM customers WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Error checking email' });
      }

      if (results.length > 0) {
        console.error('Validation failed: Email already in use');
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Insert new user with `name`, `email`, and hashed password
      const insertQuery = 'INSERT INTO customers (name, email, password) VALUES (?, ?, ?)';
      db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error saving user:', err);
          return res.status(500).json({ message: 'Error saving user' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET);

        res.status(201).json({ message: 'User created successfully', token });
      });
    });
  });
});

app.get('/api/user', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const query = 'SELECT name, email FROM customers WHERE id = ?';
  
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user data:', err);
      return res.status(500).json({ error: 'Failed to fetch user data' });
    }
    
    // Send back name and email
    res.json({
      name: result[0].name,
      email: result[0].email,
    });
  });
});


// **Login Route for Customers**
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM customers WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).send('Error logging in');
    }
    if (results.length === 0) {
      return res.status(404).send('Customer not found');
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).send('Error checking password');
      }
      if (!isMatch) {
        return res.status(400).send('Invalid password');
      }

      // Generate access token
      const token = jwt.sign({ id: user.id, email: user.email },
        process.env.JWT_SECRET);

      res.json({ message: 'Login successful', token, userName: user.name }); // Make sure userName is returned here
    });
  });
});


// **Account Routes**
// Get account details for logged-in user
app.get('/api/account', authenticateToken, (req, res) => {
  const customerId = req.user.id;
  const sql = 'SELECT name, email FROM customers WHERE id = ?';
  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error('Error fetching account details:', err);
      return res.status(500).json({ error: 'Failed to fetch account details' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result[0]);
  });
});

// Update account details
app.put('/api/account', authenticateToken, (req, res) => {
  const customerId = req.user.id;
  const { name, email, password, confirmPassword } = req.body;

  if (password && password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const updateFields = { name, email };
  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: 'Error hashing password' });
      updateFields.password = hashedPassword;
      updateAccountDetails();
    });
  } else {
    updateAccountDetails();
  }

  function updateAccountDetails() {
    const sql = 'UPDATE customers SET ? WHERE id = ?';
    db.query(sql, [updateFields, customerId], (err, result) => {
      if (err) {
        console.error('Error updating account details:', err);
        return res.status(500).json({ error: 'Failed to update account details' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'Account updated successfully' });
    });
  }
});

// Delete account
app.delete('/api/account', authenticateToken, (req, res) => {
  const customerId = req.user.id;
  const sql = 'DELETE FROM customers WHERE id = ?';
  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error('Error deleting account:', err);
      return res.status(500).json({ error: 'Failed to delete account' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  });
});



// **Secure Booking Route**
// **Bookings Routes**
app.get('/api/bookings', authenticateToken, (req, res) => {
  const customerId = req.user.id;
  const sql = 'SELECT * FROM bookings WHERE customer_id = ?';
  db.query(sql, [customerId], (err, results) => {
    if (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
    res.json(results);
  });
});

app.post('/api/bookings', authenticateToken, (req, res) => {
  const { date, time, party_size } = req.body;
  const customerId = req.user.id;

  if (!date || !time || !party_size) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const sql = 'INSERT INTO bookings (customer_id, date, time, party_size) VALUES (?, ?, ?, ?)';
  db.query(sql, [customerId, date, time, party_size], (err, result) => {
    if (err) {
      console.error('Error creating booking:', err);
      return res.status(500).json({ error: 'Failed to create booking' });
    }
    res.status(201).json({
      id: result.insertId,
      customer_id: customerId,
      date,
      time,
      party_size,
    });
  });
});

// Serve React App
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



// Update a booking
app.put('/api/bookings/:id', authenticateToken, (req, res) => {
  const bookingId = req.params.id;
  const { date, time, party_size } = req.body;
  const customerId = req.user.id;

  const sql =
    'UPDATE bookings SET date = ?, time = ?, party_size = ? WHERE id = ? AND customer_id = ?';
  db.query(
    sql,
    [date, time, party_size, bookingId, customerId],
    (err, result) => {
      if (err) {
        console.error('Error updating booking:', err);
        return res.status(500).json({ error: 'Failed to update booking' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json({ message: 'Booking updated successfully' });
    }
  );
});

// Delete a booking
app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
  const bookingId = req.params.id;
  const customerId = req.user.id;

  const sql = 'DELETE FROM bookings WHERE id = ? AND customer_id = ?';
  db.query(sql, [bookingId, customerId], (err, result) => {
    if (err) {
      console.error('Error deleting booking:', err);
      return res.status(500).json({ error: 'Failed to delete booking' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  });
});

// **CRUD Routes for Items**
// Create Item
app.post('/api/items', (req, res) => {
  const { name, description, price } = req.body;
  const sql = 'INSERT INTO items (name, description, price) VALUES (?, ?, ?)';
  db.query(sql, [name, description, price], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, name, description, price });
  });
});

// Fetch All Items
app.get('/api/items', (req, res) => {
  const sql = 'SELECT * FROM items';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Update Item
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const sql = 'UPDATE items SET name = ?, description = ?, price = ? WHERE id = ?';
  db.query(sql, [name, description, price, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ id, name, description, price });
  });
});

// Delete Item
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM items WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(204).send();
  });
});

// Serve React App
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

