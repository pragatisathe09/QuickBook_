import React from 'react';
import { X } from 'lucide-react';

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    className = ''
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-lg shadow-sm p-6 max-w-md w-full ${className}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[#FF6B35]">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none hover:bg-gray-100 rounded-full p-1 transition-colors duration-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {children}

                {footer && (
                    <div className="flex justify-end space-x-3 mt-6">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
