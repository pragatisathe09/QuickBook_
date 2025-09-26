import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function OTPVerification({ email, onVerificationSuccess, onBack }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const inputRefs = Array(6).fill(0).map(() => React.createRef());

    useEffect(() => {
        const timer = timeLeft > 0 && setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleResendOTP = async () => {
        try {
            await fetch('http://localhost:8080/api/auth/request-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ email }).toString()
            });

            setTimeLeft(300);
            toast.success('OTP resent successfully');
        } catch (error) {
            toast.error('Failed to resend OTP');
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            toast.error('Please enter complete OTP');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    email: email,
                    otp: otpString
                }).toString()
            });


            if (response.ok) {
                toast.success('Email verified successfully');
                onVerificationSuccess();
            } else {
                toast.error('Invalid OTP');
            }
        } catch (error) {
            toast.error('Failed to verify OTP');
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg space-y-6 border border-[#E6F7F5]">
            <div className="text-center">
                <div className="bg-[#F6F8FE] w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#1A237E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-[#1A237E]">Email Verification</h3>
                <p className="text-gray-600">
                    We've sent a verification code to<br />
                    <span className="font-medium text-[#1A237E]">{email}</span>
                </p>
            </div>

            <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl border-2 border-[#E6F7F5] rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-[#1A237E] transition-all duration-200 bg-[#F6F8FE]"
                    />
                ))}
            </div>

            <div className="text-center text-sm text-gray-600 flex justify-center items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1A237E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{formatTime(timeLeft)}</span>
            </div>

            <div className="flex flex-col space-y-4">
                <button
                    onClick={handleVerify}
                    className="w-full py-3 px-4 bg-[#283593] text-white rounded-lg hover:bg-[#1A237E] focus:ring-4 focus:ring-[#E6F7F5] transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                    Verify Email
                </button>

                <button
                    onClick={handleResendOTP}
                    disabled={timeLeft > 0}
                    className="text-[#1A237E] hover:text-[#283593] disabled:opacity-50 font-medium py-2 transition-colors duration-200"
                >
                    {timeLeft > 0 ? 'Resend OTP in ' + formatTime(timeLeft) : 'Resend OTP'}
                </button>

                <button
                    onClick={onBack}
                    className="text-gray-600 hover:text-[#1A237E] flex items-center justify-center space-x-1 font-medium py-2 transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Sign Up</span>
                </button>
            </div>
        </div>
    );
}