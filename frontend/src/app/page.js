import Navigation from '@/components/Navigation';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Hotel Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your hotel operations efficiently and effectively
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Login
            </a>
            <a
              href="/register"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Register
            </a>
            <a
              href="/rooms"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              Browse Rooms
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
