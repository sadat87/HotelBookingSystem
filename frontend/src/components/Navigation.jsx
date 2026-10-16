import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold">
            🏨 Hotel Management
          </Link>
          <div className="flex space-x-4">
            <Link href="/" className="hover:text-blue-100">
              Home
            </Link>
            <Link href="/rooms" className="hover:text-blue-100">
              Rooms
            </Link>
            <Link href="/bookings" className="hover:text-blue-100">
              Bookings
            </Link>
            <Link href="/login" className="hover:text-blue-100">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
