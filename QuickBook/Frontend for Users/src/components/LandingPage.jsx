import React from 'react';
import { Building, Clock, Calendar, BarChart4, Users, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with background image */}
      <div 
        className="relative text-white py-32 min-h-[600px] flex items-center" 
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A237E]/90 to-[#283593]/80"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight">Simplify Meeting Room Management with QuickBook</h1>
            <p className="text-xl mb-8 text-white/90">The smart way to book, manage, and track meeting spaces across your organization.</p>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="bg-white text-[#1A237E] px-8 py-4 rounded-lg font-semibold hover:bg-[#F6F8FE] transition duration-300 shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-[#283593] border border-white px-8 py-4 rounded-lg font-semibold hover:bg-[#1A237E] transition duration-300 shadow-md hover:shadow-lg"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#1A237E]">Why Choose QuickBook?</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">Our comprehensive platform helps you streamline your meeting space management.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-[#00CD8F]">
              <div className="mb-4 text-[#1A237E]">
                <Clock size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#1A237E]">Real-time Availability</h3>
              <p className="text-gray-600">Check room availability instantly and book spaces with just a few clicks.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-[#00CD8F]">
              <div className="mb-4 text-[#1A237E]">
                <Calendar size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#1A237E]">Smart Scheduling</h3>
              <p className="text-gray-600">Easily schedule recurring meetings and get reminders for upcoming bookings.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-[#00CD8F]">
              <div className="mb-4 text-[#1A237E]">
                <Building size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#1A237E]">Multi-location Support</h3>
              <p className="text-gray-600">Manage rooms across different office locations from a single platform.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <img
                src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b2ZmaWNlJTIwbWVldGluZ3xlbnwwfHwwfHx8MA%3D%3D"
                alt="Office meeting" className="w-full rounded-xl shadow-xl" />
            </div>
            <div className="md:w-1/2 md:pl-16">
              <h2 className="text-3xl font-bold mb-8 text-[#1A237E]">Boost Workplace Efficiency</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#F6F8FE] p-3 rounded-full text-[#1A237E] mr-4">
                    <Users size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#1A237E] mb-2">Reduce Booking Conflicts</h3>
                    <p className="text-gray-600">Eliminate double-bookings and confusion with our real-time system.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#F6F8FE] p-3 rounded-full text-[#1A237E] mr-4">
                    <BarChart4 size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#1A237E] mb-2">Optimize Space Utilization</h3>
                    <p className="text-gray-600">Detailed analytics help you make data-driven decisions about your workspace.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#F6F8FE] p-3 rounded-full text-[#1A237E] mr-4">
                    <CheckCircle size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#1A237E] mb-2">Simplify Room Setup</h3>
                    <p className="text-gray-600">Specify equipment needs and preferences for each meeting in advance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="bg-gradient-to-r from-[#1A237E] to-[#283593] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Trusted by Forward-Thinking Companies</h2>
          <div className="max-w-3xl mx-auto bg-[#1A237E] p-10 rounded-xl shadow-2xl">
            <div className="flex justify-center mb-6">
              <Star className="text-[#F6F8FE] mr-1" size={24} />
              <Star className="text-[#F6F8FE] mr-1" size={24} />
              <Star className="text-[#F6F8FE] mr-1" size={24} />
              <Star className="text-[#F6F8FE] mr-1" size={24} />
              <Star className="text-[#F6F8FE]" size={24} />
            </div>
            <p className="text-xl italic mb-8">"QuickBook transformed our office space management. We've seen a 40% increase in meeting room efficiency since implementing the system."</p>
            <div>
              <p className="font-semibold text-xl">Sarah Johnson</p>
              <p className="text-[#E6F7F5]">Facilities Manager, TechCorp Inc.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#1A237E]">Ready to streamline your workplace?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Join hundreds of companies that have simplified their meeting room management with QuickBook.</p>
          <Link
            to="/signup"
            className="bg-[#283593] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#1A237E] transition duration-300 shadow-lg text-lg"
          >
            Get Started Today
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 QuickBook. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}