import React, { useState, useEffect } from 'react';

const Menu = () => {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to add items to your favorites.');
    } else {
      setMessage('');
    }

    // Load favorites from localStorage if any
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleAddToFavorites = (dish) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to add to your favorites.');
      return;
    }

    // Add the dish to favorites and store it in localStorage
    const updatedFavorites = [...favorites, dish];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setMessage('Added to your favorites!');
  };

  const menuItems = [
    {
      name: 'Spaghetti Pomodoro',
      description: 'A classic Italian dish with rich tomato sauce.',
      image: '/assets/DSC_9138.jpg'
    },
    {
      name: 'Grilled Lamb',
      description: 'Perfectly grilled lamb served with a side of risotto.',
      image: '/assets/DSC_9070.jpg'
    },
    {
      name: 'Pasta alla Boscaiola',
      description: 'A hearty pasta with mushrooms, pancetta, and a creamy sauce.',
      image: 'assets/ pastaallaboscaiola.jpeg'
    },
    {
      name: 'Braciole',
      description: 'Italian beef rolls stuffed with herbs and Parmesan cheese.',
      image: '/assets//Braciole.jpg'
    },
    {
      name: 'Fettuccine Alfredo',
      description: 'Delicious pasta in a rich Alfredo sauce.',
      image: '/assets/Fettuccine.jpeg'
    },
    {
      name: 'Funghi e Tartufo Pizza',
      description: 'A gourmet pizza with mushrooms and truffle oil.',
      image: '/assets/FunghiETartufopizza.jpeg'
    },
    {
      name: 'Lasagna',
      description: 'Layers of pasta, ricotta, and meat sauce.',
      image: '/assets/lasagna.jpg'
    },
    {
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh mozzarella and basil.',
      image: '/assets/margaritapizza.jpg'
    },
    {
      name: 'Pannacotta',
      description: 'Rich and creamy dessert topped with berry compote.',
      image: '/assets//pannacotta.jpeg'
    },
    {
      name: 'Tiramisu',
      description: 'Classic Italian dessert made with coffee-soaked ladyfingers.',
      image: '/assets/tiramisu.jpg'
    },
  ];

  return (
    <section className="menu-section py-5">
      <div className="container">
        <h2 className="text-center">Our Menu</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <div className="row g-4 mt-4">
          {menuItems.map((item, index) => (
            <div key={index} className="col-lg-6 col-md-12">
              <img src={item.image} className="img-fluid rounded" alt={item.name} />
              <h4 className="mt-3">{item.name}</h4>
              <p>{item.description}</p>
              <button
                className="btn btn-outline-primary"
                onClick={() => handleAddToFavorites(item)}
              >
                Add to Favorites
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
