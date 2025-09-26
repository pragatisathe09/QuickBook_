import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Auth/Login';
import RoomsList from './components/Rooms/RoomsList';
import Signup from './components/Auth/Signup';
import Profile from './components/Profile/Profile';
import MyBookings from './components/Bookings/MyBookings';
import Navbar from './components/Navbar/Navbar';
import PrivateRoute from './components/Auth/PrivateRoute';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './components/Auth/AuthContext';
function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            borderRadius: '8px',
            padding: '16px',
          },
          success: {
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: 'white',
            },
          },
          // Add close button to all toasts
          className: 'relative',
          dismissible: true,
          icon: false,
        }}
      />
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Add LandingPage as the default public route */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/rooms" replace /> : <LandingPage />
        } />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/rooms" replace /> : <Login />
        } />
        <Route path="/signup" element={
          isAuthenticated ? <Navigate to="/rooms" replace /> : <Signup />
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/rooms" element={
          <PrivateRoute>
            <RoomsList />
          </PrivateRoute>
        } />
        <Route path="/my-bookings" element={
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;