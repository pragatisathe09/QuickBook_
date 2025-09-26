import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const navItems = [
  { title: 'Dashboard', path: '/admin/dashboard' },
  { title: 'Rooms', path: '/admin/rooms' },
  { title: 'Users', path: '/admin/users' },
  { title: 'Reservations', path: '/admin/reservations' },
  { title: 'Feedbacks', path: '/admin/feedbacks' }
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logging out...');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/admin/dashboard" className={styles.brand}>
          QuickBook <span className={styles.adminText}>Admin</span>
        </Link>

        {/* Hamburger Menu Button */}
        <button 
          className={`${styles.menuButton} ${isMenuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={styles.hamburger}></span>
        </button>

        {/* Navigation Links */}
        <div className={`${styles.navContent} ${isMenuOpen ? styles.show : ''}`}>
          <ul className={styles.navLinks}>
            {navItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.path}
                  className={`${styles.navLink} ${
                    location.pathname === item.path ? styles.active : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;