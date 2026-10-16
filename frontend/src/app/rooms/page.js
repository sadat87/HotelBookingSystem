'use client';

import { useRequireAuth } from '@/hooks/useNavigation.js';
import { useRooms } from '@/hooks/useAPI.js';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';

export default function RoomsPage() {
  useRequireAuth();

  const { getAllRooms, isLoading } = useRooms();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms();
        setRooms(data.data || []);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
      }
    };

    fetchRooms();
  }, [getAllRooms]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Available Rooms
          </h1>

          {isLoading ? (
            <p className="text-gray-600">Loading rooms...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <div key={room._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32 flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">
                        {room.roomNumber}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg capitalize mb-2">
                        {room.type} Room
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {room.description}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                          ${room.basePrice}
                        </span>
                        <span className="text-sm text-gray-500">
                          Capacity: {room.capacity}
                        </span>
                      </div>
                      <button className="w-full btn btn-primary">
                        Book Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 col-span-full text-center">
                  No rooms available
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
