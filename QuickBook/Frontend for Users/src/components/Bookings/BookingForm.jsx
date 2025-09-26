import React, { useState } from 'react';
import { reservationsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Select from 'react-select';

const amenityOptions = [
  { value: 'projector', label: 'Projector' },
  { value: 'mic-speakers', label: 'Mic & Speakers' },
  { value: 'table', label: 'Table' },
  { value: 'whiteboard-marker', label: 'Whiteboard & Marker' }
];

export default function BookingForm({ room, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    startTime: `${room.bookingDate}T${room.startTime}`,
    endTime: `${room.bookingDate}T${room.endTime}`,
    amenities: []
  });

  const validateTimeConstraints = (start, end) => {
    const startHour = new Date(start).getHours();
    const endHour = new Date(end).getHours();
    const duration = (new Date(end) - new Date(start)) / (1000 * 60);

    if (startHour < 9 || endHour > 18) {
      toast.error('Bookings only allowed between 9 AM and 6 PM');
      return false;
    }
    if (duration < 15) {
      toast.error('Minimum booking duration is 30 minutes');
      return false;
    }
    if (duration > 540) {
      toast.error('Maximum booking duration is 9 hours');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateTimeConstraints(formData.startTime, formData.endTime)) {
      return;
    }

    try {
      await reservationsAPI.create({
        roomId: room.id,
        ...formData,
        amenities: formData.amenities.map(a => a.value).join(', ')
      });

      // Show booking confirmation with start time
      const startTime = new Date(formData.startTime);
      toast.success(
        `Room booked successfully! Your booking starts at ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} on ${startTime.toLocaleDateString()}`,
        { duration: 5000 }
      );

      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to book the room. Please try a different time slot..');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-150 shadow-xl max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-6 text-gray-900">Book Room: {room.name}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#FF6B35] focus:border-[#FF6B35]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Amenities
            </label>
            <Select
              isMulti
              options={amenityOptions}
              value={formData.amenities}
              onChange={(selectedOptions) =>
                setFormData({ ...formData, amenities: selectedOptions || [] })
              }
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select amenities..."
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: '#FF6B35',
                  primary25: '#fff5f0',
                  primary50: '#ffece5',
                },
              })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#FF6B35] focus:border-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#FF6B35] focus:border-[#FF6B35]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FF6B35] text-white rounded-md hover:bg-[#ff8559] transition-colors duration-200 font-medium"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}