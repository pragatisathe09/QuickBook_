import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = true,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      transition={{ duration: 0.2 }}
      className={`
        relative overflow-hidden rounded-xl bg-white p-6
        shadow-lg backdrop-blur-lg backdrop-filter
        border border-[#E6F7F5]
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const RoomCard = ({ room, onBook }) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h3>
        <div className="space-y-2">
          <p className="text-gray-600">Capacity: {room.capacity} people</p>
          <p className="text-gray-600">Location: {room.location}</p>
          <div className="flex items-center gap-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CBA9]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>Available Now</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onBook(room)}
          className="px-4 py-2 bg-[#00CD8F] text-white rounded-lg hover:bg-[#00B8A6] transition-colors duration-200"
        >
          Book Now
        </button>
      </div>
    </Card>
  );
};

export default Card;