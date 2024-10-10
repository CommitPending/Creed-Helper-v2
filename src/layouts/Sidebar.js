import React, { useState, useEffect } from 'react';
import { Button, Nav, NavItem } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa'; // Importing icon for the close button

const navigation = [
  {
    title: "Box Rater",
    href: "/box-rater",
    icon: "bi bi-calculator",
  },
  {
    title: "Quick Trade",
    href: "/quick-trade",
    icon: "bi bi-person-lines-fill",
  },
  {
    title: "Input Rater",
    href: "/input-rater",
    icon: "bi bi-box",
  },
];

const Sidebar = () => {
  const [promo, setPromo] = useState('');
  const [promoImage, setPromoImage] = useState('');

  // Dark Mode State and Effect
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    // Fetch the promo data when the component mounts
    const fetchPromo = async () => {
      try {
        const response = await fetch(
          'https://pokemoncreed.net/ajax/pokedex.php?pokemon=promo'
        );
        const data = await response.json();
        if (data.success) {
          setPromo(data.name); // Set the promo name
          setPromoImage(`https://pokemoncreed.net/sprites/${data.name}.png`); // Set the promo image URL
        } else {
          console.error('Failed to fetch promo data');
        }
      } catch (error) {
        console.error('Error fetching promo data:', error);
      }
    };

    fetchPromo();
  }, []);

  useEffect(() => {
    // Apply or remove the dark-mode class on the body element
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
    // Save the preference to localStorage
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const showMobilemenu = () => {
    document.getElementById('sidebarArea').classList.toggle('showSidebar');
  };
  let location = useLocation();

  return (
    <div className="sidebar">
      {/* Close button for mobile view */}
      <Button
        color="link"
        className="d-lg-none sidebar-close-btn"
        onClick={showMobilemenu}
      >
        <FaTimes size={20} />
      </Button>

      <div className="sidebar-promo text-center">
        {promoImage && (
          <img
            src={promoImage}
            alt="Current Promo"
            className="promo-image mb-2"
          />
        )}
        <div className="promo-text mt-2">
          <strong>Current Promo:</strong> {promo || 'Loading...'}
        </div>
      </div>

      <Nav vertical className="sidebar-nav mt-4">
        {navigation.map((navi, index) => (
          <NavItem key={index} className="sidenav-bg">
            <Link
              to={navi.href}
              className={
                location.pathname === navi.href
                  ? 'nav-link active'
                  : 'nav-link'
              }
            >
              <i className={`${navi.icon} me-2`}></i>
              <span>{navi.title}</span>
            </Link>
          </NavItem>
        ))}
         {/* Disabling night mode for right now 

        <div className="dark-mode-toggle text-center mt-3">
        <button onClick={toggleDarkMode} className="theme-toggle-btn btn ">
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      */}
      </Nav>
    </div>
  );
};

export default Sidebar;
