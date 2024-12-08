import React from 'react';

const Home = () => {
  // Check if the user is logged in by checking for the token
  const isLoggedIn = !!localStorage.getItem('token'); // Boolean check for token
  const userEmail = localStorage.getItem('userEmail'); // Retrieve user's email from localStorage, if saved

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center text-white d-flex flex-column justify-content-center align-items-center">
        <div className="container">
          <h1 className="display-4">Welcome to Frankie's Restaurant</h1>
          <p className="lead">Authentic Italian Cuisine</p>
          {isLoggedIn ? (
            <p className="text-success">
              Logged in as: {userEmail || 'User'}
            </p>
          ) : (
            <p className="text-warning">
              You are not logged in. Please log in to make reservations.
            </p>
          )}
          <a href="/menu" className="btn btn-primary btn-lg">Explore Our Menu</a>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section className="featured-dishes py-5">
        <div className="container">
          <h2 className="text-center">Our Specialties</h2>
          <div className="row g-4 mt-4">
            <div className="col-md-4 col-sm-6">
              <img src="/assets/pasta.jpeg" className="img-fluid rounded" alt="Pasta" />
              <h4 className="mt-3">Spaghetti Pomodoro</h4>
            </div>
            <div className="col-md-4 col-sm-6">
              <img src="/assets/DSC_9153.jpg" className="img-fluid rounded" alt="Ravioli" />
              <h4 className="mt-3">Ravioli Cream Sauce</h4>
            </div>
            <div className="col-md-4 col-sm-12">
              <img src="/assets/DSC_9194.jpg" className="img-fluid rounded" alt="Grilled Lamb" />
              <h4 className="mt-3">Grilled Lamb</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Hours Section */}
      <section className="hours-section py-5">
        <div className="container">
          <h2 className="text-center">Restaurant Hours</h2>
          <div className="hours-table">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>Monday</td>
                  <td>3:00p.m.–12am</td>
                </tr>
                <tr>
                  <td>Tuesday</td>
                  <td>3:00p.m.–11p.m.</td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>4:00p.m.–11p.m.</td>
                </tr>
                <tr>
                  <td>Thursday</td>
                  <td>3:00p.m.–11p.m.</td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>5:00p.m.–12a.m.</td>
                </tr>
                <tr>
                  <td>Saturday</td>
                  <td>3:00p.m.–1:00a.m.</td>
                </tr>
                <tr>
                  <td>Sunday</td>
                  <td>3:00p.m.–11p.m.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Links to Login and Booking pages */}
      <section className="cta-section text-center py-5">
        <div className="container">
          <h2 className="mb-4">Join Us or Book Your Table!</h2>
          <div className="d-flex justify-content-center">
            {!isLoggedIn ? (
              <>
                <a href="/login" className="btn btn-secondary mx-2">Login</a>
                <a href="/signup" className="btn btn-info mx-2">Sign Up</a>
              </>
            ) : (
              <a href="/booking" className="btn btn-success mx-2">Make a Booking</a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
