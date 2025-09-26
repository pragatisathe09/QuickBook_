import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A237E] to-[#283593]">
      {/* Glassmorphism background elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#E0FFFF] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            QuickBook
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Book Meeting Rooms Effortlessly
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-[#1A237E] rounded-lg font-semibold hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Book a Room
            </Link>
            <Link
              to="/admin"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transform hover:scale-105 transition-all duration-200"
            >
              Admin Login
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Animated wave effect */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white/10"></div>
    </div>
  );
};

export default Hero;