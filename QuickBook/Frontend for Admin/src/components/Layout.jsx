import React, { useState, useMemo } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import styles from './Layout.module.css';
import { useAuth } from '../hooks/useAuth.jsx';

const Layout = () => {
  const { logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Ensure user is authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    try {
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
      console.error('Logout error:', error);
    }
  };

  const breadcrumbs = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const items = [];
    let currentPath = '';
    items.push({ name: 'Dashboard', path: '/' });
    parts.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      items.push({ name: label, path: currentPath });
    });
    return items.length > 1 ? items : [{ name: 'Dashboard', path: '/' }];
  }, [location.pathname]);

  return (
    <div className={styles.container}>


      {/* Top bar */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <div className={styles.logoContainer}>
            <img src="/logo.jpg" alt="QuickBook Logo" className={styles.logoImage} />
            <div className={styles.logoText}>QuickBook Admin</div>
          </div>
        </div>
        <nav className={styles.topbarNav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.topNavLink} ${isActive ? styles.topNavActive : ''}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `${styles.topNavLink} ${isActive ? styles.topNavActive : ''}`
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/rooms"
            className={({ isActive }) =>
              `${styles.topNavLink} ${isActive ? styles.topNavActive : ''}`
            }
          >
            Rooms
          </NavLink>
          <NavLink
            to="/reservations"
            className={({ isActive }) =>
              `${styles.topNavLink} ${isActive ? styles.topNavActive : ''}`
            }
          >
            Reservations
          </NavLink>
          <NavLink
            to="/feedbacks"
            className={({ isActive }) =>
              `${styles.topNavLink} ${isActive ? styles.topNavActive : ''}`
            }
          >
            Feedbacks
          </NavLink>
        </nav>
        <div className={styles.topbarRight}>
          <button 
            onClick={handleLogout} 
            className={styles.logoutButtonTopbar}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
            <main className={styles.mainContent}>
        <div className={styles.mainContentPadding}>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>© {new Date().getFullYear()} QuickBook</span>
          <span className={styles.footerText}>Admin Panel</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
