import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../services/api';
import toast from 'react-hot-toast';
import OTPVerification from '../OTPVerification';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.endsWith('@jadeglobal.com')) {
      newErrors.email = 'Email must be a JadeGlobal email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // First request OTP
      const response = await fetch('http://localhost:8080/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ email: formData.email }).toString()
      });


      if (response.ok) {
        setVerifiedEmail(formData.email);
        setShowOTPVerification(true);
        toast.success('Verification code sent to your email');
      } else {
        throw new Error('Failed to send verification code');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = async () => {
    try {
      setIsLoading(true);
      await auth.signup(formData.name, formData.email, formData.password);
      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (showOTPVerification) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <OTPVerification
            email={verifiedEmail}
            onVerificationSuccess={handleVerificationSuccess}
            onBack={() => setShowOTPVerification(false)}
          />
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    if (passwordStrength === 4) return 'Strong';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 1) return 'text-red-500';
    if (passwordStrength === 2) return 'text-yellow-500';
    if (passwordStrength === 3) return 'text-blue-500';
    if (passwordStrength === 4) return 'text-green-500';
    return '';
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-[#1A237E] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#1A237E] hover:text-[#151B60] transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-5">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`pl-10 appearance-none block w-full px-3 py-3 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8A6] focus:border-[#00B8A6] transition-all duration-200 bg-[#F6F8FE]`}
                  placeholder="Name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 appearance-none block w-full px-3 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8A6] focus:border-[#00B8A6] transition-all duration-200 bg-[#F6F8FE]`}
                  placeholder="username@jadeglobal.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 appearance-none block w-full px-3 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8A6] focus:border-[#00B8A6] transition-all duration-200 bg-[#F6F8FE]`}
                  placeholder="••••••••"
                />
              </div>
              
              {/* Password Strength Indicator */}
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs text-gray-500">Password strength</div>
                  <div className={`text-xs font-medium ${getPasswordStrengthColor()}`}>
                    {getPasswordStrengthLabel()}
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => {
                    let bgColor = 'bg-gray-200';
                    if (passwordStrength >= 1 && i === 0) bgColor = 'bg-red-500';
                    if (passwordStrength >= 2 && i === 1) bgColor = 'bg-yellow-500';
                    if (passwordStrength >= 3 && i === 2) bgColor = 'bg-blue-500';
                    if (passwordStrength >= 4 && i === 3) bgColor = 'bg-green-500';
                    
                    return (
                      <div
                        key={i}
                        className={`h-1.5 w-full rounded transition-colors duration-300 ${bgColor}`}
                      />
                    );
                  })}
                </div>
              </div>
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 appearance-none block w-full px-3 py-3 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8A6] focus:border-[#00B8A6] transition-all duration-200 bg-[#F6F8FE]`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1A237E] hover:bg-[#151B60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A237E] transition-colors duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
        
        
      </div>
      
      <p className="mt-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} QuickBook. All rights reserved.
      </p>
    </div>
  );
}