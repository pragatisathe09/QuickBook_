import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function StatusBadge({ status, className = '' }) {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Available':
                return { color: 'bg-green-100 text-green-800', text: 'Available' };
            case 'booked':
                return { color: 'bg-red-100 text-red-800', text: 'Booked' };
            case 'Under_Maintenance':
                return { color: 'bg-yellow-100 text-yellow-800', text: 'Under Maintenance' };
            case 'confirmed':
                return {
                    color: 'bg-blue-100 text-blue-800',
                    text: 'Confirmed',
                    icon: <CheckCircle className="h-4 w-4 mr-1" />
                };
            case 'completed':
                return {
                    color: 'bg-green-100 text-green-800',
                    text: 'Completed',
                    icon: <CheckCircle className="h-4 w-4 mr-1" />
                };
            case 'cancelled':
                return {
                    color: 'bg-red-100 text-red-800',
                    text: 'Cancelled',
                    icon: <XCircle className="h-4 w-4 mr-1" />
                };
            default:
                return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}>
            {config.icon}
            {config.text}
        </span>
    );
}
