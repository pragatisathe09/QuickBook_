import React, { useState, useEffect } from 'react';
import { reservationsAPI, feedback } from '../../services/api';
import FeedbackModal from '../common/FeedbackModal';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('All');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const locations = ['All', 'Pune_Baner', 'Pune_Wadgaonsheri', 'Hyderabad'];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await reservationsAPI.getMy();
      console.log('Fetched bookings:', data);
      setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    }
  };



  const canCancelBooking = (startTime) => {
    const currentTime = new Date();
    const bookingStartTime = new Date(startTime);
    return currentTime < bookingStartTime;
  };

  const handleCancelBooking = async (booking) => {
    try {
      if (!window.confirm('Are you sure you want to cancel this booking?')) {
        return;
      }

      await reservationsAPI.cancel(booking.id);
      toast.success('Booking cancelled successfully');
      await fetchBookings();
    } catch (error) {
      console.error('Cancel booking error:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const statusMatch = statusFilter === 'all' ? true : booking.status === statusFilter;
    const locationMatch = locationFilter === 'All' ? true : booking.room.location === locationFilter;
    return statusMatch && locationMatch;
  });

  // Format date for calendar display
  const formatDateForCalendar = (dateString) => {
    const date = new Date(dateString);

    // Get day of the month with suffix (1st, 2nd, 3rd, etc.)
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : (day % 100 - day % 10 != 10 ? day % 10 : 0)];

    // Format the date
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return {
      dayName: dayNames[date.getDay()],
      day: day,
      suffix: suffix,
      month: monthNames[date.getMonth()],
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };



  return (
    <div className="container mx-auto p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 text-sm mt-1">View and manage your upcoming and past reservations.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-6">
          {/* Status Filter */}
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Filter by Status
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  statusFilter === 'all' ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {['confirmed', 'cancelled', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded text-sm font-medium capitalize ${
                    statusFilter === status ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location
            </label>
            <select 
              className="w-full p-2 border border-gray-200 rounded-lg text-sm"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location.replace('_', ', ')}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Date Range
            </label>
            <input 
              type="date" 
              className="w-full p-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => {
            const startDate = formatDateForCalendar(booking.startTime);
            const endDate = formatDateForCalendar(booking.endTime);

            return (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col space-y-4">
                  {/* Header with Title and Status */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{booking.title}</h3>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{startDate.dayName}, {startDate.day} {startDate.month} {new Date(booking.startTime).getFullYear()}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Time and Location Details */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {startDate.time} - {endDate.time}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {booking.room.location.replace("_", ", ")}
                    </div>
                  </div>

                  {/* Room Details and Amenities */}
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">{booking.room.name}</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {booking.amenities.split(",")
                            .map(item => item.trim())
                            .map(item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-4">
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          disabled={!canCancelBooking(booking.startTime)}
                          className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded transition-colors duration-200 ${
                            canCancelBooking(booking.startTime)
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                      )}
                      
                      {booking.status === 'completed' && (
                        booking.feedbackProvided ? (
                          <button
                            disabled
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded bg-gray-100 text-gray-400 cursor-not-allowed"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Feedback Submitted
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowFeedbackModal(true);
                            }}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded bg-[#FF6B35] text-white hover:bg-[#FF5722] transition-colors duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Give Feedback
                          </button>
                        )
                      )}

                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {statusFilter !== 'all' || locationFilter !== 'All'
                ? 'Try adjusting your filters'
                : 'You haven\'t made any bookings yet'}
            </p>
            <Link to="/rooms" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-[#FF6B35] text-white hover:bg-[#FF5722] transition-colors duration-200">
              Browse Rooms
            </Link>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setSelectedBooking(null);
        }}
        onSubmit={async (feedbackData) => {
          try {
            const payload = {
              reservationId: selectedBooking.id,
              rating: feedbackData.rating,
              comment: feedbackData.feedback
            };
            
            console.log('Submitting feedback:', payload);
            await feedback.create(payload);
            
            setBookings(prevBookings =>
              prevBookings.map(booking =>
                booking.id === selectedBooking.id
                  ? { ...booking, feedbackProvided: true }
                  : booking
              )
            );

            setShowFeedbackModal(false);
            toast.success('Feedback submitted successfully');
          } catch (error) {
            console.error('Feedback submission error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
            throw error;
          }
        }}
      />
      
    </div>
  );
}