# Frontend - Next.js Hotel Management UI

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. **Run development server**
```bash
npm run dev
```

Frontend available at `http://localhost:3000`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run lint` - Lint code

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.js       # Root layout
│   │   ├── page.js         # Home page
│   │   ├── login/
│   │   │   └── page.js
│   │   ├── register/
│   │   │   └── page.js
│   │   ├── dashboard/
│   │   │   └── page.js
│   │   ├── rooms/
│   │   │   └── page.js
│   │   └── bookings/
│   │       └── page.js
│   │
│   ├── components/          # Reusable React components
│   │   └── Navigation.jsx
│   │
│   ├── config/             # Configuration files
│   │   ├── constants.js    # API endpoints and constants
│   │   └── api.js          # Axios instance
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAPI.js       # API operations hooks
│   │   └── useNavigation.js # Route protection hooks
│   │
│   ├── lib/                # Utilities
│   │   └── auth.js         # Authentication helpers
│   │
│   ├── store/              # Zustand state management
│   │   └── index.js        # All stores
│   │
│   └── styles/             # Global styles
│       └── globals.css
│
├── public/                 # Static assets
├── next.config.js          # Next.js config
├── .env.local             # Environment variables
├── package.json
└── README.md
```

## Architecture

### Pages (App Router)

#### Home Page (`/`)
- Welcome screen
- Call-to-action buttons
- Navigation links

#### Login (`/login`)
- Email/password form
- JWT token storage
- Redirect to dashboard

#### Register (`/register`)
- User registration form
- First/last name, email, phone
- Auto-login after registration

#### Dashboard (`/dashboard`)
- User welcome message
- Quick links to main features
- User role display

#### Rooms (`/rooms`)
- Browse all available rooms
- Room cards with details
- Price and capacity info
- Book now button

#### Bookings (`/bookings`)
- View user's bookings
- Booking status badges
- Check-in/out dates
- Total price display

### State Management (Zustand)

Three main stores:

```javascript
// Authentication
useAuthStore: {
  user,           // Current user object
  isLoading,      // Loading state
  error,          // Error message
  setUser,        // Update user
  setLoading,     // Set loading
  setError,       // Set error
  logout          // Clear auth
}

// Bookings
useBookingStore: {
  bookings,       // List of bookings
  selectedBooking, // Currently selected
  filters,        // Applied filters
  isLoading,      // Loading state
  setBookings,    // Update list
  reset           // Clear state
}

// Rooms
useRoomStore: {
  rooms,          // All rooms
  selectedRoom,   // Currently selected
  availableRooms, // Filtered rooms
  isLoading,      // Loading state
  setRooms,       // Update rooms
  reset           // Clear state
}
```

### Custom Hooks

#### useAuth()
Authentication operations:
```javascript
const { user, isLoading, error, register, login, logout, changePassword } = useAuth();

// Usage
await login(email, password);
await register(userData);
await changePassword(oldPassword, newPassword);
logout();
```

#### useRooms()
Room operations:
```javascript
const { isLoading, error, getAllRooms, getAvailableRooms, getRoomById } = useRooms();

// Usage
const rooms = await getAllRooms(page, limit);
const available = await getAvailableRooms(checkIn, checkOut, capacity);
const room = await getRoomById(roomId);
```

#### useBookings()
Booking operations:
```javascript
const { isLoading, error, createBooking, getMyBookings, getBookingById, cancelBooking } = useBookings();

// Usage
const booking = await createBooking(bookingData);
const myBookings = await getMyBookings();
const details = await getBookingById(bookingId);
await cancelBooking(bookingId, reason);
```

#### useRequireAuth()
Route protection:
```javascript
// Protect route, require authentication
useRequireAuth();

// Protect route, require specific role
useRequireAuth(['admin', 'manager']);
```

#### useRedirectIfAuth()
Auto-redirect authenticated users:
```javascript
// Redirect to /dashboard if already logged in
useRedirectIfAuth();
```

## API Integration

### Axios Client (`src/config/api.js`)

Features:
- Auto-inject JWT token in headers
- Auto-refresh token on 401
- Standardized error handling
- Base URL configuration

```javascript
import apiClient from '@/config/api.js';

// Automatically includes Authorization header
const response = await apiClient.get('/api/rooms');

// Automatically refreshes token if expired
const data = await apiClient.post('/api/bookings', bookingData);
```

### API Endpoints (`src/config/constants.js`)

Pre-configured endpoint URLs:
```javascript
API_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  GET_ROOMS: '/rooms',
  CREATE_BOOKING: '/bookings',
  // ... more endpoints
}
```

## Authentication Flow

### Login/Register
1. User submits form
2. `useAuth()` hook calls API
3. Backend returns tokens
4. Tokens stored in cookies
5. User redirected to dashboard

### Protected Routes
1. Page checks authentication with `useRequireAuth()`
2. If not authenticated, redirect to `/login`
3. If authenticated but unauthorized role, redirect to `/unauthorized`

### Token Refresh
1. API client detects 401 response
2. Automatically uses refresh token
3. Gets new access token
4. Retries original request
5. If refresh fails, redirects to login

## Styling

Global CSS in `src/styles/globals.css`:

Utility classes:
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.card` - Card component style
- `.form-group`, `.form-label`, `.form-input` - Form elements
- `.grid`, `.grid-cols-1`, `.grid-cols-2`, `.grid-cols-3` - Grid layout
- `.text-center`, `.text-error`, `.text-success` - Text utilities

## Component Examples

### Login Form
```jsx
'use client';

import { useAuth } from '@/hooks/useAPI.js';

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### Room Card
```jsx
const room = {
  _id: '123',
  roomNumber: '101',
  type: 'double',
  basePrice: 150,
};

return (
  <div className="card">
    <h3>{room.type} Room</h3>
    <p>${room.basePrice}</p>
    <button className="btn btn-primary">Book Now</button>
  </div>
);
```

## Development Tips

### Environment Variables
- Prefix with `NEXT_PUBLIC_` to expose to client
- Store sensitive values in `.env.local`
- Never commit `.env.local`

### Client vs Server Components
- Use `'use client'` for interactive components
- Avoid in page layouts (already client in App Router)
- Minimize JavaScript bundle

### API Calls
- Use hooks for API operations
- Handle loading and error states
- Show user feedback with toast

### Routing
- Use `next/link` for navigation
- Use `next/navigation` for programmatic routing
- Always pass href to Link

## Form Validation

Built-in HTML5:
```jsx
<input type="email" required />
<input type="password" minLength={6} required />
```

Toast notifications:
```jsx
import toast from 'react-hot-toast';

toast.success('Success message');
toast.error('Error message');
toast.loading('Loading...');
```

## Performance

### Optimizations
- Code splitting with dynamic imports
- Image optimization
- Lazy loading of components
- Minimal CSS in production
- Zustand for lightweight state

### Best Practices
- Use `useState` for component state
- Use Zustand for global state
- Memoize expensive computations
- Lazy load heavy components

## Production Build

1. **Build**
```bash
npm run build
```

2. **Test build locally**
```bash
npm start
```

3. **Deploy**
- Push to GitHub
- Connect to Vercel/Netlify
- Deploy automatically

## Environment Variables for Production

Create `.env.local` with production backend URL:
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## Common Issues

### API Connection Error
- Check backend is running
- Verify NEXT_PUBLIC_API_URL
- Check CORS configuration on backend

### Authentication Not Working
- Clear cookies/cache
- Verify tokens in browser storage
- Check backend API response

### Page Not Loading
- Check console for errors
- Verify route path matches
- Ensure required hooks are called

## Support

Refer to the main README.md for full documentation.
