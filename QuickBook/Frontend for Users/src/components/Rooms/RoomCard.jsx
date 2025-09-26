import React from 'react';
import { Star } from 'lucide-react';

export default function RoomCard({ room, onBook, isBooked = false }) {
  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Good';
    if (rating >= 3.0) return 'Average';
    return 'Fair';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={room.imageURL || '/default-room.jpg'}
          alt={room.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium 
            ${room.availability === 'Available' 
              ? 'bg-green-100 text-green-800' 
              : room.status === 'Booked' 
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
            {room.status || room.availability}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{room.name}</h3>
        <p className="text-gray-600 mb-2">{room.location.replace('_', ' - ')}</p>

        {/* Room Info */}
        <p className="text-sm text-gray-500">
          Capacity: {room.capacity} people
        </p>

        {/* Rating */}
        <div className="mt-2 flex items-center">
          <Star className={`h-4 w-4 ${room.rating >= 4 ? 'text-yellow-400' : 'text-gray-400'}`} fill="currentColor" />
          <span className="ml-1 text-sm font-medium text-gray-600">
            {getRatingLabel(room.rating || 4)}
          </span>
        </div>

        {/* Book Now Button */}
        <div className="mt-4">
          {isBooked ? (
            <button
              disabled
              className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-md font-medium cursor-not-allowed"
            >
              Booked
            </button>
          ) : (
            <button
              onClick={() => onBook(room)}
              className={`w-full px-4 py-2 bg-[#FF6B35] text-white rounded-md font-medium 
                hover:bg-[#ff8559] transition-colors duration-200 ${
                room.availability !== 'Available' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={room.availability !== 'Available'}
            >
              Book Now
            </button>
          )}
        </div>

        {room.nextAvailable && (
          <p className="mt-2 text-xs text-center text-gray-500">
            Available after {room.nextAvailable}
          </p>
        )}
      </div>
    </div>
  );
}