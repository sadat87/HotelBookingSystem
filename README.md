# Hotel Management System - Complete Documentation

## Overview

A production-ready hotel management system built with:
- **Backend**: Node.js + Express + MongoDB with strict MVC architecture
- **Frontend**: Next.js 14 (App Router) with React
- **Authentication**: JWT + Refresh Tokens
- **Authorization**: Role-Based Access Control (RBAC)

## Project Structure

```
hotel/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and configuration
│   │   ├── constants/       # Constants and enums
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── index.js         # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/             # Next.js pages (App Router)
    │   ├── components/      # React components
    │   ├── config/          # API configuration
    │   ├── hooks/           # Custom React hooks
    │   ├── lib/             # Utilities and auth
    │   ├── store/           # Zustand stores
    │   └── styles/          # CSS files
    ├── public/              # Static assets
    ├── next.config.js
    └── package.json
```

## Backend Architecture

### MVC Pattern Implementation

#### 1. **Models** (`src/models/`)
- `User.js` - User schema with roles and refresh tokens
- `Room.js` - Room details with amenities and pricing
- `Booking.js` - Booking information with payment status
- `Pricing.js` - Seasonal pricing configurations

Key features:
- Proper indexing for performance
- Validation at schema level
- Relationships via ObjectId references

#### 2. **Controllers** (`src/controllers/`)
- `AuthController.js` - Registration, login, token refresh, password change
- `RoomController.js` - CRUD operations for rooms
- `BookingController.js` - Booking lifecycle management
- `UserController.js` - User management (admin only)

Controllers handle:
- Request/response validation
- Delegating to services
- Standard response formatting

#### 3. **Services** (`src/services/`)
- `AuthService.js` - Authentication logic (password hashing, JWT generation)
- `RoomService.js` - Room availability checking, calendar generation
- `BookingService.js` - Complex booking operations
- `UserService.js` - User management and statistics

Services contain:
- Complex business logic
- Database operations
- Cross-entity transactions

#### 4. **Middleware** (`src/middleware/`)
- `auth.js` - JWT verification and role-based authorization
- `validation.js` - Request body validation with Joi
- `errorHandler.js` - Global error handling

#### 5. **Routes** (`src/routes/`)
RESTful API endpoints with proper HTTP methods and status codes:
- `auth.js` - Public and protected auth routes
- `rooms.js` - Room CRUD with role restrictions
- `bookings.js` - Booking operations with access control
- `users.js` - User management (admin only)

### Database Schema

#### User
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: ['admin', 'manager', 'staff', 'customer'],
  address: { street, city, state, postalCode, country },
  isActive: Boolean,
  lastLogin: Date,
  refreshTokens: [{ token, createdAt }],
  timestamps
}
```

#### Room
```javascript
{
  roomNumber: String (unique),
  type: ['single', 'double', 'suite', 'deluxe', 'penthouse'],
  floor: Number,
  capacity: Number,
  basePrice: Number,
  description: String,
  amenities: [String],
  images: [{ url, caption }],
  isAvailable: Boolean,
  maintenanceScheduled: Date,
  timestamps
}
```

#### Booking
```javascript
{
  bookingReference: String (unique),
  guest: ObjectId (ref: User),
  room: ObjectId (ref: Room),
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: Number,
  numberOfNights: Number,
  roomPrice: Number,
  totalPrice: Number,
  specialRequests: String,
  status: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'],
  payment: {
    status: ['pending', 'completed', 'failed', 'refunded'],
    method: String,
    transactionId: String,
    paidAmount: Number,
    paidAt: Date
  },
  timestamps
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (remove refresh token)
- `POST /api/auth/logout-all` - Logout from all devices
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user profile

### Rooms
- `GET /api/rooms` - List all rooms (paginated)
- `GET /api/rooms/available` - Get available rooms for date range
- `GET /api/rooms/:id` - Get room details
- `GET /api/rooms/:id/calendar` - Get availability calendar
- `POST /api/rooms` - Create room (staff/manager/admin)
- `PUT /api/rooms/:id` - Update room (staff/manager/admin)
- `DELETE /api/rooms/:id` - Delete room (staff/manager/admin)

### Bookings
- `POST /api/bookings` - Create booking (all authenticated users)
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings` - List all bookings (staff/manager/admin)
- `PUT /api/bookings/:id` - Update booking (staff/manager/admin)
- `POST /api/bookings/:id/confirm` - Confirm booking (staff/manager/admin)
- `POST /api/bookings/:id/check-in` - Check in guest (staff/manager/admin)
- `POST /api/bookings/:id/check-out` - Check out guest (staff/manager/admin)
- `POST /api/bookings/:id/cancel` - Cancel booking (staff/manager/admin)
- `POST /api/bookings/:id/payment` - Record payment (staff/manager/admin)

### Users
- `PUT /api/users/profile` - Update own profile
- `GET /api/users` - List all users (admin)
- `GET /api/users/search` - Search users (admin)
- `GET /api/users/:id` - Get user details (admin)
- `PUT /api/users/:id/role` - Update user role (admin)
- `PUT /api/users/:id/deactivate` - Deactivate user (admin)
- `PUT /api/users/:id/activate` - Activate user (admin)
- `GET /api/users/stats/dashboard` - Dashboard statistics (admin)

## Frontend Architecture

### Pages (App Router)
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - User dashboard
- `/rooms` - Browse rooms
- `/bookings` - View my bookings

### State Management (Zustand)
- `useAuthStore` - Authentication state
- `useBookingStore` - Booking state
- `useRoomStore` - Room state

### Custom Hooks
- `useAuth()` - Authentication operations
- `useRooms()` - Room operations
- `useBookings()` - Booking operations
- `useRequireAuth()` - Route protection
- `useRedirectIfAuth()` - Redirect authenticated users

### API Client
Axios instance with:
- Automatic token injection in headers
- Automatic token refresh on 401
- Standardized error handling
- Base URL configuration

## Setup Instructions

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/hotel-management
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CORS_ORIGIN=http://localhost:3000
```

3. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or create a free cluster at MongoDB Atlas
# and update MONGODB_URI in .env
```

4. **Run backend**
```bash
npm run dev
```

Backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Configure environment**
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. **Run frontend**
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Authentication Flow

### Registration/Login
1. User provides credentials
2. Backend validates and returns tokens
3. Frontend stores tokens in cookies
4. Token is included in Authorization header for subsequent requests

### Token Refresh
1. Access token expires (7 days)
2. API client automatically detects 401 response
3. Refresh token is used to get new access token
4. Original request is retried with new token
5. If refresh fails, user is redirected to login

### Role-Based Access Control
- **Admin**: Full system access
- **Manager**: Room and booking management
- **Staff**: Check-in/check-out, booking confirmation
- **Customer**: Create and view own bookings

## Key Features

### Authentication & Security
✅ JWT with access and refresh tokens
✅ Password hashing with bcryptjs
✅ Role-based authorization
✅ Automatic token refresh
✅ Logout from all devices

### Room Management
✅ Create, read, update, delete rooms
✅ Room availability checking
✅ Calendar view for availability
✅ Amenities and images
✅ Price management

### Booking System
✅ Create bookings with date validation
✅ Check availability before booking
✅ Multi-step booking workflow
✅ Cancellation with refund tracking
✅ Payment recording

### User Management
✅ User registration and login
✅ Profile updates
✅ Role assignment
✅ User deactivation
✅ Dashboard statistics

## Error Handling

All endpoints return standardized response:
```javascript
{
  success: boolean,
  statusCode: number,
  message: string,
  data: any,
  timestamp: ISO8601
}
```

Example error response:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Room is not available for the selected dates",
  "data": null,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Testing the System

### Create Test Data
```bash
# Backend must be running

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'

# Create a room (use admin token)
curl -X POST http://localhost:5000/api/rooms \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomNumber": "101",
    "type": "single",
    "floor": 1,
    "capacity": 2,
    "basePrice": 100,
    "description": "Cozy single room"
  }'
```

## Performance Optimizations

- MongoDB indexes on frequently queried fields
- Pagination for list endpoints
- JWT tokens for stateless authentication
- Zustand for lightweight state management
- Next.js App Router for optimized routing
- CSS-in-files for minimal bundle size

## Security Best Practices Implemented

1. ✅ Password hashing with bcryptjs
2. ✅ JWT authentication
3. ✅ CORS configuration
4. ✅ Input validation with Joi
5. ✅ Role-based authorization
6. ✅ SQL injection prevention (MongoDB + Mongoose)
7. ✅ XSS protection via React
8. ✅ Environment variable management
9. ✅ Secure token storage in HTTP-only cookies
10. ✅ Automatic token refresh

## Production Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables in deployment platform
2. Use MongoDB Atlas for database
3. Use strong JWT secrets
4. Enable HTTPS
5. Configure CORS for frontend domain
6. Set NODE_ENV=production

### Frontend (Vercel/Netlify)
1. Configure NEXT_PUBLIC_API_URL to backend URL
2. Build: `npm run build`
3. Deploy built files
4. Enable HTTPS
5. Configure environment variables

## Future Enhancements

- Email notifications for bookings
- Payment gateway integration (Stripe/PayPal)
- Advanced reporting and analytics
- Multi-language support
- Mobile app (React Native)
- Real-time notifications (WebSockets)
- Guest reviews and ratings
- Dynamic pricing based on demand
- Integration with property management systems

## Support & Documentation

For API documentation, visit: `http://localhost:5000/health`

For detailed code examples, refer to:
- Backend: See controller files for endpoint implementations
- Frontend: See page files for component examples
