import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Calendar, Clock, Search } from 'lucide-react';
import { roomsAPI, reservationsAPI } from "../../services/api";
import toast from 'react-hot-toast';
import BookingForm from '../Bookings/BookingForm';
import RoomCard from './RoomCard';

export default function RoomsList() {
  const getNextHalfHour = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const additionalMinutes = minutes <= 30 ? 30 - minutes : 60 - minutes;

    now.setMinutes(minutes + additionalMinutes);
    now.setSeconds(0);
    now.setMilliseconds(0);

    return now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('all');
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(getNextHalfHour());
  const [endTime, setEndTime] = useState('18:00');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);


  useEffect(() => {
    fetchRooms();
    fetchReservations();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.getAll();
      setRooms(response.data);
    } catch (error) {
      toast.error('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const [filteredRooms, setFilteredRooms] = useState(rooms);

  const fetchReservations = async () => {
    try {
      const response = await reservationsAPI.getAll();
      setReservations(response.data);
    } catch (error) {
      toast.error('Failed to fetch reservations');
    }
  };

  // Update filtered rooms when rooms data changes
  useEffect(() => {
    setFilteredRooms(rooms);
  }, [rooms]);

  const handleSearch = () => {
    performSearch(location);
  };

  const getRoomStatus = (room) => {
    if (room.availability === 'Under_Maintenance') {
      return 'Under_Maintenance';
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const selectedStart = new Date(`${currentDate}T${startTime}`).getTime();
    const selectedEnd = new Date(`${currentDate}T${endTime}`).getTime();

    const isBooked = reservations.some(reservation => {
      if (reservation.status !== 'confirmed' || reservation.room.id !== room.id) {
        return false;
      }

      const reservationStart = new Date(reservation.startTime).getTime();
      const reservationEnd = new Date(reservation.endTime).getTime();

      // Check if the reservation is for today and overlaps with current time
      return (
        (selectedStart >= reservationStart && selectedStart < reservationEnd) ||
        (selectedEnd > reservationStart && selectedEnd <= reservationEnd) ||
        (selectedStart <= reservationStart && selectedEnd >= reservationEnd)
      );
    });

    return (room.availability === 'Available' && isBooked) ? 'booked' : room.availability;
  };

  const performSearch = (loc) => {
    let results = rooms;

    if (loc !== 'all') {
      results = results.filter(room => room.location === loc);
    }

    setFilteredRooms(results);
    setSearchPerformed(true);
  };

  const handleBooking = (room) => {
    const currentDate = new Date().toISOString().split('T')[0];
    setSelectedRoom({
      ...room,
      bookingDate: currentDate,
      startTime: startTime,
      endTime: endTime
    });
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = async () => {
    await fetchReservations();
    performSearch(location);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Filters Sidebar */}
      <div className="w-72 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          
          {/* Location Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-1 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
            >
              <option value="all">Select Location</option>
              <option value="Pune_Baner">Pune - Baner</option>
              <option value="Pune_Wadgaonsheri">Pune - Wadgaonsheri</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>



          <button
            onClick={handleSearch}
            className="w-full py-2 bg-[#FF6B35] text-white rounded-md hover:bg-[#ff8559] transition-colors duration-200"
          >
            Search Rooms
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Rooms</h1>

        <div>
          {filteredRooms.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No meeting rooms found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onBook={handleBooking}
                  isBooked={room.status === 'booked'}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isBookingModalOpen && selectedRoom && (
        <BookingForm
          room={selectedRoom}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
