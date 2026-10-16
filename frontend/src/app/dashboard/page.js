'use client';

import { useRequireAuth } from '@/hooks/useNavigation.js';
import { useAuthStore } from '@/store/index.js';
import { useEffect } from 'react';
import Navigation from '@/components/Navigation';

export default function DashboardPage() {
  useRequireAuth();

  const { user, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mb-6">
            Role: <span className="font-semibold capitalize">{user?.role}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900">My Bookings</h2>
              <p className="text-blue-700 mt-2">
                <a href="/bookings" className="underline hover:no-underline">
                  View your reservations
                </a>
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-900">Browse Rooms</h2>
              <p className="text-green-700 mt-2">
                <a href="/rooms" className="underline hover:no-underline">
                  Check available rooms
                </a>
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-900">Profile</h2>
              <p className="text-purple-700 mt-2">
                <a href="/profile" className="underline hover:no-underline">
                  Update your profile
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
