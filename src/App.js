import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Menu from './components/Menu';
import Login from './components/Login';  
import Booking from './components/Booking';  
import Signup from './components/Signup';  
import Footer from './components/Footer';
import Account from './components/Account';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/signup" element={<Signup />} /> {/* Add Signup route */}
        <Route path="/login" element={<Login />} />  {/* Add route for Login */}
        <Route path="/booking" element={<Booking />} />  {/* Add route for Booking */}
        <Route path="/account" element={<Account />} />
      </Routes>
      <Footer />
    </Router>
    
  );
}

export default App;
