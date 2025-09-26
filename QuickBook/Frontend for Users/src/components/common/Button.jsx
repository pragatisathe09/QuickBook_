import React from 'react';

export default function Button({
    children,
    variant = 'primary',
    className = '',
    disabled = false,
    ...props
}) {
    const baseStyles = "px-4 py-2 rounded-md font-medium transition-all duration-200 transform hover:scale-105";

    const variants = {
        primary: "bg-[#FF6B35] text-white hover:bg-[#ff8559] shadow-md hover:shadow-lg",
        secondary: "bg-white border border-[#FF6B35] text-[#FF6B35] hover:bg-gray-50 shadow-sm hover:shadow",
        success: "bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg",
    };

    const disabledStyles = "opacity-50 cursor-not-allowed";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${disabled ? disabledStyles : ''} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
