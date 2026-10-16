# 📡 Hotel Management System - Example API Calls

Complete examples of how to use every API endpoint with curl and JavaScript.

---

## 🔐 Authentication Examples

### 1. Register a New User

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "phone": "+1234567890"
  }'
```

**JavaScript/Fetch:**
```javascript
const registerUser = async () => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
      phone: '+1234567890'
    })
  });
  
  const data = await response.json();
  console.log('Access Token:', data.data.accessToken);
  console.log('Refresh Token:', data.data.refreshToken);
  
  // Store tokens in cookies
  localStorage.setItem('accessToken', data.data.accessToken);
  localStorage.setItem('refreshToken', data.data.refreshToken);
};
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**JavaScript/Fetch:**
```javascript
const loginUser = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    console.log('Login successful!');
  } else {
    console.error('Login failed:', data.message);
  }
};

// Usage
loginUser('john@example.com', 'SecurePass123!');
```

---

### 3. Refresh Access Token

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**JavaScript:**
```javascript
const refreshToken = async () => {
  const oldRefreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('http://localhost:5000/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: oldRefreshToken })
  });
  
  const data = await response.json();
  localStorage.setItem('accessToken', data.data.accessToken);
  console.log('Token refreshed!');
};
```

---

### 4. Get Current User Profile

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**JavaScript:**
```javascript
const getProfile = async () => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch('http://localhost:5000/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  console.log('User:', data.data);
};
```

---

### 5. Change Password

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "SecurePass123!",
    "newPassword": "NewSecurePass456!"
  }'
```

---

## 🏠 Room Management Examples

### 1. Create a Room (Admin/Manager)

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:5000/api/rooms \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomNumber": "101",
    "type": "double",
    "floor": 1,
    "capacity": 2,
    "basePrice": 150,
    "description": "Beautiful double room with city view and modern amenities",
    "amenities": ["wifi", "air_conditioning", "tv", "refrigerator"],
    "images": [
      {
        "url": "https://example.com/room101-1.jpg",
        "caption": "Room view"
      }
    ]
  }'
```

**JavaScript:**
```javascript
const createRoom = async (roomData) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch('http://localhost:5000/api/rooms', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roomData)
  });
  
  const data = await response.json();
  return data.data;
};

// Usage
const newRoom = await createRoom({
  roomNumber: '102',
  type: 'suite',
  floor: 1,
  capacity: 4,
  basePrice: 250,
  description: 'Luxury suite with separate living area',
  amenities: ['wifi', 'tv', 'pool', 'balcony']
});
```

---

### 2. List All Rooms

**cURL:**
```bash
# Basic
curl http://localhost:5000/api/rooms

# With pagination
curl "http://localhost:5000/api/rooms?page=1&limit=10"

# With filters
curl "http://localhost:5000/api/rooms?page=1&limit=10&type=double&isAvailable=true&floor=1"
```

**JavaScript:**
```javascript
const getRooms = async (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams({
    page,
    limit,
    ...filters
  });
  
  const response = await fetch(
    `http://localhost:5000/api/rooms?${params}`
  );
  
  const data = await response.json();
  return data.data;
};

// Usage
const rooms = await getRooms(1, 10, {
  type: 'double',
  isAvailable: true
});
```

---

### 3. Get Available Rooms for Date Range

**cURL:**
```bash
curl "http://localhost:5000/api/rooms/available?checkIn=2024-02-01&checkOut=2024-02-05&capacity=2"
```

**JavaScript:**
```javascript
const getAvailableRooms = async (checkIn, checkOut, capacity) => {
  const params = new URLSearchParams({
    checkIn: new Date(checkIn).toISOString(),
    checkOut: new Date(checkOut).toISOString(),
    capacity
  });
  
  const response = await fetch(
    `http://localhost:5000/api/rooms/available?${params}`
  );
  
  const data = await response.json();
  return data.data.rooms;
};

// Usage
const available = await getAvailableRooms('2024-02-01', '2024-02-05', 2);
console.log(`Found ${available.length} available rooms`);
```

---

### 4. Get Room Availability Calendar

**cURL:**
```bash
curl "http://localhost:5000/api/rooms/507f1f77bcf86cd799439011/calendar?year=2024&month=2"
```

**JavaScript:**
```javascript
const getRoomCalendar = async (roomId, year, month) => {
  const response = await fetch(
    `http://localhost:5000/api/rooms/${roomId}/calendar?year=${year}&month=${month}`
  );
  
  const data = await response.json();
  return data.data;
};

// Usage
const calendar = await getRoomCalendar('507f...', 2024, 2);
// Result: { 1: {available: true}, 2: {available: false}, ... }
```

---

### 5. Update Room

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
ROOM_ID="507f1f77bcf86cd799439011"

curl -X PUT http://localhost:5000/api/rooms/$ROOM_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "basePrice": 180,
    "isAvailable": false
  }'
```

---

### 6. Delete Room

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
ROOM_ID="507f1f77bcf86cd799439011"

curl -X DELETE http://localhost:5000/api/rooms/$ROOM_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📅 Booking Management Examples

### 1. Create Booking

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "507f1f77bcf86cd799439011",
    "checkInDate": "2024-02-01T14:00:00Z",
    "checkOutDate": "2024-02-05T11:00:00Z",
    "numberOfGuests": 2,
    "specialRequests": "Early check-in if available, please"
  }'
```

**JavaScript:**
```javascript
const createBooking = async (bookingData) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch('http://localhost:5000/api/bookings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...bookingData,
      checkInDate: new Date(bookingData.checkInDate).toISOString(),
      checkOutDate: new Date(bookingData.checkOutDate).toISOString()
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Booking created:', data.data.bookingReference);
    return data.data;
  } else {
    console.error('Booking failed:', data.message);
  }
};

// Usage
const booking = await createBooking({
  roomId: '507f1f77bcf86cd799439011',
  checkInDate: '2024-02-01',
  checkOutDate: '2024-02-05',
  numberOfGuests: 2
});
```

---

### 2. Get My Bookings

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl "http://localhost:5000/api/bookings/my-bookings?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**JavaScript:**
```javascript
const getMyBookings = async () => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(
    'http://localhost:5000/api/bookings/my-bookings',
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const data = await response.json();
  return data.data.data; // Array of bookings
};

// Usage
const myBookings = await getMyBookings();
myBookings.forEach(booking => {
  console.log(`Booking #${booking.bookingReference}: ${booking.status}`);
});
```

---

### 3. Confirm Booking (Staff/Manager/Admin)

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
BOOKING_ID="507f1f77bcf86cd799439011"

curl -X POST http://localhost:5000/api/bookings/$BOOKING_ID/confirm \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4. Check In Guest

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
BOOKING_ID="507f1f77bcf86cd799439011"

curl -X POST http://localhost:5000/api/bookings/$BOOKING_ID/check-in \
  -H "Authorization: Bearer $TOKEN"
```

**JavaScript:**
```javascript
const checkInGuest = async (bookingId) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(
    `http://localhost:5000/api/bookings/${bookingId}/check-in`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const data = await response.json();
  console.log('Guest checked in:', data.data);
};
```

---

### 5. Check Out Guest

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
BOOKING_ID="507f1f77bcf86cd799439011"

curl -X POST http://localhost:5000/api/bookings/$BOOKING_ID/check-out \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6. Cancel Booking

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
BOOKING_ID="507f1f77bcf86cd799439011"

curl -X POST http://localhost:5000/api/bookings/$BOOKING_ID/cancel \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Change of plans, need to reschedule"
  }'
```

---

### 7. Record Payment

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
BOOKING_ID="507f1f77bcf86cd799439011"

curl -X POST http://localhost:5000/api/bookings/$BOOKING_ID/payment \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "method": "credit_card",
    "transactionId": "txn_123456789",
    "paidAmount": 600
  }'
```

---

## 👥 User Management Examples

### 1. Update Profile

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jonathan",
    "phone": "+1987654321",
    "address": {
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    }
  }'
```

---

### 2. List All Users (Admin)

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl "http://localhost:5000/api/users?page=1&limit=10&role=customer&isActive=true" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 3. Search Users (Admin)

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl "http://localhost:5000/api/users/search?q=john&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4. Update User Role (Admin)

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
USER_ID="507f1f77bcf86cd799439011"

curl -X PUT http://localhost:5000/api/users/$USER_ID/role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "manager"
  }'
```

---

### 5. Get Dashboard Statistics (Admin)

**cURL:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl "http://localhost:5000/api/users/stats/dashboard" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved",
  "data": {
    "totalUsers": 250,
    "activeUsers": 240,
    "roleDistribution": {
      "admin": 2,
      "manager": 5,
      "staff": 15,
      "customer": 228
    }
  }
}
```

---

## 🔧 Using Axios (Frontend)

All examples can be simplified using the Axios client in the frontend:

```javascript
import apiClient from '@/config/api.js';

// Register
const { data } = await apiClient.post('/auth/register', userData);

// Login
const { data } = await apiClient.post('/auth/login', { email, password });

// Get rooms
const { data } = await apiClient.get('/rooms?page=1&limit=10');

// Create booking
const { data } = await apiClient.post('/bookings', bookingData);

// Check in
const { data } = await apiClient.post(`/bookings/${bookingId}/check-in`);

// Get dashboard stats
const { data } = await apiClient.get('/users/stats/dashboard');
```

---

## 📝 Common Request Patterns

### Pattern 1: Authenticated Request
```bash
curl -X METHOD http://localhost:5000/api/endpoint \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d 'JSON_DATA'
```

### Pattern 2: Paginated Request
```bash
curl "http://localhost:5000/api/endpoint?page=1&limit=10&filters=value"
```

### Pattern 3: Date Range Filter
```bash
curl "http://localhost:5000/api/rooms/available?checkIn=2024-02-01&checkOut=2024-02-05&capacity=2"
```

---

## ✅ Testing Checklist

Test these calls in order:

1. ✅ Register user
2. ✅ Login and get tokens
3. ✅ Get profile
4. ✅ Create room (as admin)
5. ✅ Get available rooms
6. ✅ Create booking
7. ✅ Get my bookings
8. ✅ Confirm booking
9. ✅ Check in
10. ✅ Record payment
11. ✅ Check out
12. ✅ View dashboard stats (admin)

---

All these examples work with either **curl** or **JavaScript Fetch API**. The axios client in the frontend automatically handles authentication headers and token refreshing.
