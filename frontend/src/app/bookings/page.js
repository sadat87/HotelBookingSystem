'use client';

import { useRequireAuth } from '@/hooks/useNavigation.js';
import { useBookings } from '@/hooks/useAPI.js';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';

export default function BookingsPage() {
  useRequireAuth();

  const { getMyBookings, isLoading } = useBookings();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings();
        setBookings(data.data || []);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      }
    };

    fetchBookings();
  }, [getMyBookings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            My Bookings
          </h1>

          {isLoading ? (
            <p className="text-gray-600">Loading bookings...</p>
          ) : (
            <div>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Booking #{booking.bookingReference}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Room {booking.room?.roomNumber}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-gray-500">Check-in</p>
                          <p className="font-semibold">
                            {new Date(booking.checkInDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Check-out</p>
                          <p className="font-semibold">
                            {new Date(booking.checkOutDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-sm text-gray-500">Total Price</p>
                          <p className="text-2xl font-bold text-blue-600">
                            ${booking.totalPrice}
                          </p>
                        </div>
                        <button className="btn btn-secondary">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center">
                  You have no bookings yet.{' '}
                  <a href="/rooms" className="text-blue-600 hover:underline">
                    Browse available rooms
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
