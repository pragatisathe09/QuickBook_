import React, { useState, useEffect } from 'react';
import { auth } from '../../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await auth.getProfile();
      setProfile(data);
    } catch (error) {
      toast.error(error.message || 'Failed to load profile');
      setProfile(null);
    }
  };

  if (!profile) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl text-gray-600">
        Unable to load profile. Please try again later.
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white shadow-sm rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-[#FF6B35]">Profile Information</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-teal-400 mb-1">Name</label>
            <div className="text-base text-gray-900 p-3 bg-gray-50 rounded-lg">{profile.name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-400 mb-1">Email</label>
            <div className="text-base text-gray-900 p-3 bg-gray-50 rounded-lg">{profile.email}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-400 mb-1">Role</label>
            <div className="text-base text-gray-900 p-3 bg-gray-50 rounded-lg capitalize">{profile.role}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-400 mb-1">Member Since</label>
            <div className="text-base text-gray-900 p-3 bg-gray-50 rounded-lg">{new Date(profile.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
