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
        primary: "bg-[#009B8A] text-white hover:bg-[#00AC99] shadow-md hover:shadow-lg",
        secondary: "bg-white border border-[#009B8A] text-[#009B8A] hover:bg-teal-50 shadow-sm hover:shadow",
        success: "bg-green-600 text-white hover:bg-green-500 shadow-md hover:shadow-lg",
        danger: "bg-red-600 text-white hover:bg-red-500 shadow-md hover:shadow-lg",
    };

    const disabledStyles = "opacity-50 cursor-not-allowed transform-none hover:scale-100";

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