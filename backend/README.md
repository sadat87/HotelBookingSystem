# Backend API - Setup & Run Guide

## Quick Start

### Prerequisites
- Node.js 16 or higher
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/hotel-management

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_in_production
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:3000
```

3. **Start MongoDB**

Using local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas:
- Create free cluster at https://www.mongodb.com/cloud/atlas
- Get connection string
- Update MONGODB_URI in .env

4. **Run development server**
```bash
npm run dev
```

Server starts at `http://localhost:5000`

## Scripts

- `npm start` - Run production server
- `npm run dev` - Run with nodemon (auto-restart)
- `npm test` - Run tests (to be configured)

## Health Check

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Architecture

### File Structure
```
backend/
├── src/
│   ├── config/              # Database connection
│   │   └── database.js
│   ├── constants/           # App constants
│   │   └── index.js
│   ├── controllers/         # Route handlers
│   │   ├── AuthController.js
│   │   ├── RoomController.js
│   │   ├── BookingController.js
│   │   └── UserController.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Booking.js
│   │   └── Pricing.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── rooms.js
│   │   ├── bookings.js
│   │   └── users.js
│   ├── services/            # Business logic
│   │   ├── AuthService.js
│   │   ├── RoomService.js
│   │   ├── BookingService.js
│   │   └── UserService.js
│   ├── utils/               # Utilities
│   │   ├── jwt.js
│   │   └── helpers.js
│   └── index.js             # Express app setup
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## MVC Pattern

### Models (`src/models/`)
- Define database schemas
- Add validation rules
- Create database indexes
- Handle relationships

### Views (Not applicable for API)
- Handled by Next.js frontend
- Axios client communicates with API

### Controllers (`src/controllers/`)
- Handle HTTP requests
- Validate input format
- Call appropriate services
- Format responses

### Services (`src/services/`)
- Contain business logic
- Database operations
- Complex calculations
- Cross-entity transactions

## Authentication

### JWT Flow

1. **Register/Login**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "+1234567890"
}
```

Response:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "John",
      "email": "john@example.com",
      "role": "customer"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

2. **Using Access Token**
```bash
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

3. **Refresh Token**
```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Token Expiry
- Access Token: 7 days
- Refresh Token: 30 days
- Automatically cleaned from database after expiry

## Role-Based Access Control

### Roles
- **admin**: Full system access
- **manager**: Room and booking management
- **staff**: Check-in, check-out, booking operations
- **customer**: Create and view own bookings

### Authorization Example
```javascript
// Only admin can access
router.get('/users', authorize(ROLES.ADMIN), UserController.getAllUsers);

// Multiple roles allowed
router.post('/rooms', authorize([ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]), RoomController.createRoom);
```

## Database Indexes

MongoDB indexes for performance:
```javascript
// User
- email (unique)
- role
- isActive

// Room
- roomNumber (unique)
- type
- floor
- isAvailable

// Booking
- guest
- room
- checkInDate, checkOutDate
- status
- payment.status

// Pricing
- room (unique)
```

## Error Handling

All errors return standardized format:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "data": null,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### HTTP Status Codes
- 200 OK - Successful request
- 201 Created - Resource created
- 400 Bad Request - Invalid input
- 401 Unauthorized - Missing/invalid token
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server error

## Example Requests

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "password": "password123",
    "phone": "+9876543210"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

### Create Room (requires admin token)
```bash
curl -X POST http://localhost:5000/api/rooms \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomNumber": "101",
    "type": "double",
    "floor": 1,
    "capacity": 2,
    "basePrice": 150,
    "description": "Spacious double room with ocean view",
    "amenities": ["wifi", "tv", "air_conditioning"]
  }'
```

### Get Available Rooms
```bash
curl "http://localhost:5000/api/rooms/available?checkIn=2024-02-01&checkOut=2024-02-05&capacity=2"
```

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "ROOM_ID",
    "checkInDate": "2024-02-01T14:00:00Z",
    "checkOutDate": "2024-02-05T11:00:00Z",
    "numberOfGuests": 2,
    "specialRequests": "Early check-in if possible"
  }'
```

## Production Checklist

Before deploying to production:

- [ ] Change JWT secrets in .env
- [ ] Use strong passwords
- [ ] Enable HTTPS
- [ ] Use MongoDB Atlas (not local)
- [ ] Configure CORS properly
- [ ] Set NODE_ENV=production
- [ ] Enable database backups
- [ ] Setup logging and monitoring
- [ ] Configure rate limiting
- [ ] Setup API documentation
- [ ] Test all endpoints
- [ ] Setup CI/CD pipeline

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- Verify firewall rules for MongoDB Atlas

### JWT Authentication Failed
- Check token format (Bearer prefix)
- Verify JWT_SECRET matches between systems
- Ensure token hasn't expired

### CORS Errors
- Update CORS_ORIGIN in .env to match frontend URL
- Check browser console for detailed error

### Port Already in Use
- Change PORT in .env
- Or kill process: `lsof -ti:5000 | xargs kill -9`

## Support

For issues or questions, refer to the main README.md in the project root.
