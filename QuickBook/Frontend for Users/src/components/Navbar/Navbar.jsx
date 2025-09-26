import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reservationsAPI, auth } from '../../services/api';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [notifications, setNotifications] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    checkNotifications();
    fetchUsername();

    // Check every 5 minutes
    const interval = setInterval(checkNotifications, 300000);
    return () => clearInterval(interval);
  }, []);

  const checkNotifications = async () => {
    try {
      const { data } = await reservationsAPI.getAll();

      const currentTime = new Date();
      const notificationsList = [];

      data.forEach(booking => {
        const startTime = new Date(booking.startTime);
        const endTime = new Date(booking.endTime);
        const timeDiff = startTime - currentTime;
        const minutes = Math.floor(timeDiff / 60000);

        // Notify 15 minutes before booking starts
        if (minutes > 0 && minutes <= 15 && booking.status === 'confirmed') {
          notificationsList.push({
            id: booking.id,
            type: 'upcoming',
            message: `Booking for ${booking.room.name} starts in ${minutes} minutes`
          });
        }

        // Notify after booking ends if feedback not given
        if (currentTime > endTime && booking.status === 'completed' && !booking.feedbackProvided) {
          notificationsList.push({
            id: booking.id,
            type: 'feedback',
            message: 'Please provide feedback for your completed booking'
          });
        }
      });

      setNotifications(notificationsList);
      setHasNotifications(notificationsList.length > 0);
    } catch (error) {
      console.error('Failed to check notifications:', error);
    }
  };

  const fetchUsername = async () => {
    try {
      const { data } = await auth.getProfile();
      setUsername(data.name || 'User');
    } catch (error) {
      console.error('Failed to fetch username:', error);
    }
  };

  const handleLogout = () => {
    try {
      auth.logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown || showNotifications) {
        if (!event.target.closest('.dropdown-container')) {
          setShowDropdown(false);
          setShowNotifications(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown, showNotifications]);

  return (
    <nav className="bg-[#1a237e] shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and brand - Left Side */}
          <div className="flex items-center w-1/4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="QuickBook Logo" className="h-8 w-8 rounded" />
              <span className="text-xl font-bold text-white">QuickBook</span>
            </Link>
          </div>

          {/* Navigation links - Center */}
          <div className="flex items-center justify-center w-1/2">
            <div className="flex space-x-8">
              <Link
                to="/rooms"
                className="px-3 py-2 text-white hover:text-[#FF6B35] transition-all duration-200 flex items-center font-medium"
              >
                Rooms
              </Link>
              <Link
                to="/my-bookings"
                className="px-3 py-2 text-white hover:text-[#FF6B35] transition-all duration-200 flex items-center font-medium"
              >
                My Bookings
              </Link>
            </div>
          </div>

          {/* User controls - Right Side */}
          <div className="flex items-center space-x-6 w-1/4 justify-end">
            {/* Notifications */}
            <div className="dropdown-container relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-white rounded-full hover:text-[#FF6B35] transition-colors duration-200"
                aria-label="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {hasNotifications && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && notifications.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-1 z-50 border border-[#E6F7F5]">
                  <div className="p-2 bg-[#F6F8FE] border-b border-[#E6F7F5]">
                    <h3 className="text-sm font-semibold text-[#00B8A6]">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <div
                        key={`${notification.id}-${index}`}
                        className={`px-4 py-3 text-sm border-b last:border-b-0 
                          ${notification.type === 'upcoming'
                            ? 'bg-[#F6F8FE] border-l-4 border-l-[#00B8A6]'
                            : 'bg-yellow-50 border-l-4 border-l-yellow-500'}`}
                      >
                        <div className="flex items-center">
                          {notification.type === 'upcoming' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00B8A6] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                          )}
                          <span className={`font-medium ${notification.type === 'upcoming' ? 'text-purple-800' : 'text-yellow-800'}`}>
                            {notification.message}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

              {/* User profile */}
            <div className="dropdown-container relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-white focus:outline-none group"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 text-white font-semibold group-hover:bg-white/30 transition-colors duration-200">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm hidden md:block font-medium">{username}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900">{username}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FF6B35] transition-colors duration-150"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Profile
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FF6B35] transition-colors duration-150"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
