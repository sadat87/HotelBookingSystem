# 🏨 Hotel Management System - Quick Start Guide

## System Overview

You now have a complete, production-ready hotel management system with:
- ✅ Separate Node.js/Express backend
- ✅ Next.js frontend with App Router
- ✅ Strict MVC architecture
- ✅ JWT + Refresh Token authentication
- ✅ Role-based access control (RBAC)
- ✅ MongoDB with proper indexing
- ✅ Clean code & documentation

## 📁 What Was Built

### Backend (Node.js + Express + MongoDB)
```
backend/
├── src/
│   ├── models/      → Database schemas
│   ├── controllers/ → HTTP request handlers
│   ├── services/    → Business logic
│   ├── routes/      → API endpoints
│   ├── middleware/  → Auth, validation, error handling
│   ├── utils/       → Helper functions
│   ├── config/      → Database setup
│   ├── constants/   → App-wide constants
│   └── index.js     → Express server
```

### Frontend (Next.js 14 + React)
```
frontend/
├── src/
│   ├── app/         → Pages (App Router)
│   ├── components/  → React components
│   ├── hooks/       → Custom React hooks
│   ├── config/      → API configuration
│   ├── lib/         → Auth utilities
│   ├── store/       → Zustand state management
│   └── styles/      → CSS
```

## 🚀 Getting Started

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure Database

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB service
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Use in backend `.env`

### Step 3: Setup Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/hotel-management
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key
CORS_ORIGIN=http://localhost:3000
```

### Step 4: Start Backend

```bash
cd backend
npm run dev
```

Expected output:
```
✓ MongoDB Connected: localhost
✓ Server running on port 5000
✓ Environment: development
```

### Step 5: Setup & Start Frontend

```bash
cd frontend
# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Start dev server
npm run dev
```

Frontend available at: http://localhost:3000

## 📋 Default Test Credentials

Create a test user by registering at: http://localhost:3000/register

Or test via API:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@hotel.com",
    "password": "Admin@123",
    "phone": "+1234567890"
  }'
```

## 🔑 Key Features

### Authentication
- ✅ Register new users
- ✅ Login with email/password
- ✅ JWT access tokens (7 days)
- ✅ Refresh tokens (30 days)
- ✅ Automatic token refresh
- ✅ Password change
- ✅ Logout from all devices

### Room Management
- ✅ Create rooms with details
- ✅ View all rooms
- ✅ Check availability for dates
- ✅ View availability calendar
- ✅ Update room info
- ✅ Delete rooms

### Booking System
- ✅ Create bookings
- ✅ Check availability
- ✅ View booking history
- ✅ Cancel bookings
- ✅ Confirm bookings
- ✅ Record payments
- ✅ Check-in/check-out

### User Management
- ✅ Update profile
- ✅ Change password
- ✅ View all users (admin)
- ✅ Assign roles (admin)
- ✅ Deactivate users (admin)
- ✅ Dashboard statistics (admin)

## 👥 User Roles

1. **Admin**
   - Manage all users
   - Create/edit/delete rooms
   - View all bookings
   - System statistics

2. **Manager**
   - Create/edit/delete rooms
   - Manage bookings
   - View bookings

3. **Staff**
   - Check-in guests
   - Check-out guests
   - Confirm bookings
   - Record payments

4. **Customer**
   - Register and login
   - Browse rooms
   - Create bookings
   - Manage own bookings

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get profile

### Rooms
- `GET /api/rooms` - List all
- `GET /api/rooms/available?checkIn=...&checkOut=...&capacity=...` - Get available
- `POST /api/rooms` - Create
- `PUT /api/rooms/:id` - Update
- `DELETE /api/rooms/:id` - Delete

### Bookings
- `POST /api/bookings` - Create
- `GET /api/bookings/my-bookings` - Get mine
- `GET /api/bookings/:id` - Get one
- `POST /api/bookings/:id/confirm` - Confirm
- `POST /api/bookings/:id/check-in` - Check in
- `POST /api/bookings/:id/check-out` - Check out
- `POST /api/bookings/:id/cancel` - Cancel

### Users
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - List (admin)
- `GET /api/users/stats/dashboard` - Stats (admin)

## 🧪 Testing the System

### 1. Create a Test Room
```bash
TOKEN="your_admin_token_here"

curl -X POST http://localhost:5000/api/rooms \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomNumber": "101",
    "type": "double",
    "floor": 1,
    "capacity": 2,
    "basePrice": 150,
    "description": "Beautiful double room with city view",
    "amenities": ["wifi", "tv", "air_conditioning"]
  }'
```

### 2. Get Available Rooms
```bash
curl "http://localhost:5000/api/rooms/available?checkIn=2024-02-01&checkOut=2024-02-05&capacity=2"
```

### 3. Create a Booking
```bash
TOKEN="your_customer_token_here"
ROOM_ID="room_id_from_previous_request"

curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "'$ROOM_ID'",
    "checkInDate": "2024-02-01T14:00:00Z",
    "checkOutDate": "2024-02-05T11:00:00Z",
    "numberOfGuests": 2,
    "specialRequests": "Late checkout if possible"
  }'
```

## 📖 Documentation

- **Main README**: [README.md](./README.md) - Full system documentation
- **Backend**: [backend/README.md](./backend/README.md) - Backend setup & API docs
- **Frontend**: [frontend/README.md](./frontend/README.md) - Frontend setup & usage

## 🛠️ Development Workflow

### Adding a New Feature

1. **Backend**
   - Create model in `src/models/`
   - Create service in `src/services/`
   - Create controller in `src/controllers/`
   - Create route in `src/routes/`

2. **Frontend**
   - Create hook in `src/hooks/`
   - Create page in `src/app/`
   - Create components in `src/components/`

### Code Structure

**MVC Flow:**
```
User Request
    ↓
Route (src/routes/)
    ↓
Middleware (validation, auth)
    ↓
Controller (src/controllers/)
    ↓
Service (src/services/)
    ↓
Model (src/models/)
    ↓
Database
```

## 🔒 Security Features

✅ Password hashing with bcryptjs
✅ JWT authentication
✅ CORS configuration
✅ Input validation with Joi
✅ Role-based authorization
✅ Error handling & logging
✅ Token refresh mechanism
✅ Secure cookie storage
✅ Environment variable protection

## 🚢 Production Deployment

### Backend (Heroku/Railway/Render)
1. Push code to GitHub
2. Connect to deployment platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Set NEXT_PUBLIC_API_URL
4. Deploy

## 📞 Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongod`
- Check port 5000 is free
- Verify `.env` file exists
- Check `npm install` completed

### Frontend won't connect to backend
- Verify backend running on port 5000
- Check CORS_ORIGIN in backend `.env`
- Verify NEXT_PUBLIC_API_URL in frontend `.env.local`
- Check browser console for errors

### Database connection error
- Verify MongoDB URI in `.env`
- Check MongoDB is running
- Verify network access (if using Atlas)

### Token refresh not working
- Check JWT_REFRESH_SECRET in `.env`
- Clear browser cookies
- Ensure backend is running

## 📝 Next Steps

1. ✅ Install and run locally
2. ✅ Test user registration
3. ✅ Create test rooms
4. ✅ Create test bookings
5. ⏭️ Customize for your needs
6. ⏭️ Add payment gateway (Stripe/PayPal)
7. ⏭️ Add email notifications
8. ⏭️ Deploy to production

## 📧 Support

Refer to individual README files for detailed documentation:
- Full system: `README.md`
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`

---

**Built with:** Node.js | Express | MongoDB | Next.js | React | JWT

**Architecture:** MVC | REST API | RBAC | JWT Authentication
