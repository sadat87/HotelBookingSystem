# Hotel Management System - Complete API Reference

## Base URL
```
http://localhost:5000/api
```

## Standard Response Format

All endpoints return:
```json
{
  "success": boolean,
  "statusCode": number,
  "message": string,
  "data": any,
  "timestamp": "ISO8601"
}
```

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 🔐 Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890"
}

Response: 201 Created
{
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Refresh Token
```
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}

Response: 200 OK
{
  "accessToken": "..."
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "refreshToken": "..."
}

Response: 200 OK
```

### Logout All Devices
```
POST /auth/logout-all
Authorization: Bearer TOKEN

Response: 200 OK
```

### Change Password
```
POST /auth/change-password
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "oldPassword": "current123",
  "newPassword": "newPassword123"
}

Response: 200 OK
```

### Get Profile
```
GET /auth/me
Authorization: Bearer TOKEN

Response: 200 OK
{
  "_id": "...",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "customer",
  ...
}
```

---

## 🏠 Room Endpoints

### List All Rooms
```
GET /rooms?page=1&limit=10&type=double&isAvailable=true&floor=1

Response: 200 OK
{
  "data": {
    "data": [ { room objects } ],
    "pagination": { page, limit, total, pages }
  }
}
```

### Get Available Rooms
```
GET /rooms/available?checkIn=2024-02-01&checkOut=2024-02-05&capacity=2

Response: 200 OK
{
  "data": {
    "rooms": [ { available room objects } ]
  }
}
```

### Get Room Details
```
GET /rooms/{roomId}

Response: 200 OK
{
  "_id": "...",
  "roomNumber": "101",
  "type": "double",
  "floor": 1,
  "capacity": 2,
  "basePrice": 150,
  "description": "...",
  "amenities": ["wifi", "tv", "air_conditioning"],
  "isAvailable": true,
  ...
}
```

### Get Room Availability Calendar
```
GET /rooms/{roomId}/calendar?year=2024&month=2

Response: 200 OK
{
  "1": { "available": true },
  "2": { "available": false },
  "3": { "available": true },
  ...
}
```

### Create Room
```
POST /rooms
Authorization: Bearer TOKEN (staff/manager/admin)
Content-Type: application/json

{
  "roomNumber": "101",
  "type": "double",
  "floor": 1,
  "capacity": 2,
  "basePrice": 150,
  "description": "Beautiful double room",
  "amenities": ["wifi", "tv", "air_conditioning"],
  "images": [
    {
      "url": "https://...",
      "caption": "Room view"
    }
  ]
}

Response: 201 Created
```

### Update Room
```
PUT /rooms/{roomId}
Authorization: Bearer TOKEN (staff/manager/admin)
Content-Type: application/json

{
  "basePrice": 180,
  "isAvailable": false,
  ...
}

Response: 200 OK
```

### Delete Room
```
DELETE /rooms/{roomId}
Authorization: Bearer TOKEN (staff/manager/admin)

Response: 200 OK
```

---

## 📅 Booking Endpoints

### Create Booking
```
POST /bookings
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "roomId": "...",
  "checkInDate": "2024-02-01T14:00:00Z",
  "checkOutDate": "2024-02-05T11:00:00Z",
  "numberOfGuests": 2,
  "specialRequests": "Early check-in if possible"
}

Response: 201 Created
{
  "_id": "...",
  "bookingReference": "BK-...",
  "guest": { ... },
  "room": { ... },
  "checkInDate": "...",
  "checkOutDate": "...",
  "numberOfNights": 4,
  "totalPrice": 600,
  "status": "pending",
  ...
}
```

### Get My Bookings
```
GET /bookings/my-bookings?page=1&limit=10
Authorization: Bearer TOKEN

Response: 200 OK
{
  "data": {
    "data": [ { booking objects } ],
    "pagination": { page, limit, total, pages }
  }
}
```

### Get Booking Details
```
GET /bookings/{bookingId}
Authorization: Bearer TOKEN

Response: 200 OK
{
  "_id": "...",
  "bookingReference": "...",
  "guest": { ... },
  "room": { ... },
  "checkInDate": "...",
  ...
}
```

### Get All Bookings (Admin)
```
GET /bookings?page=1&limit=10&guestId=...&status=confirmed&roomId=...
Authorization: Bearer TOKEN (staff/manager/admin)

Response: 200 OK
```

### Update Booking (Admin)
```
PUT /bookings/{bookingId}
Authorization: Bearer TOKEN (staff/manager/admin)
Content-Type: application/json

{
  "numberOfGuests": 3,
  "specialRequests": "..."
}

Response: 200 OK
```

### Confirm Booking
```
POST /bookings/{bookingId}/confirm
Authorization: Bearer TOKEN (staff/manager/admin)

Response: 200 OK
{
  "status": "confirmed",
  ...
}
```

### Check In
```
POST /bookings/{bookingId}/check-in
Authorization: Bearer TOKEN (staff/manager/admin)

Response: 200 OK
{
  "status": "checked_in",
  ...
}
```

### Check Out
```
POST /bookings/{bookingId}/check-out
Authorization: Bearer TOKEN (staff/manager/admin)

Response: 200 OK
{
  "status": "checked_out",
  ...
}
```

### Cancel Booking
```
POST /bookings/{bookingId}/cancel
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "reason": "Changed my mind"
}

Response: 200 OK
{
  "status": "cancelled",
  "cancellationReason": "Changed my mind",
  ...
}
```

### Record Payment
```
POST /bookings/{bookingId}/payment
Authorization: Bearer TOKEN (staff/manager/admin)
Content-Type: application/json

{
  "status": "completed",
  "method": "credit_card",
  "transactionId": "txn_123456",
  "paidAmount": 600
}

Response: 200 OK
{
  "payment": {
    "status": "completed",
    "method": "credit_card",
    "paidAmount": 600,
    "paidAt": "..."
  },
  ...
}
```

---

## 👥 User Endpoints

### Update Profile
```
PUT /users/profile
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  }
}

Response: 200 OK
```

### Get All Users (Admin)
```
GET /users?page=1&limit=10&role=customer&isActive=true
Authorization: Bearer TOKEN (admin)

Response: 200 OK
{
  "data": {
    "data": [ { user objects } ],
    "pagination": { page, limit, total, pages }
  }
}
```

### Search Users (Admin)
```
GET /users/search?q=john&page=1&limit=10
Authorization: Bearer TOKEN (admin)

Response: 200 OK
{
  "data": {
    "data": [ { matching user objects } ],
    "pagination": { page, limit, total, pages }
  }
}
```

### Get User Details (Admin)
```
GET /users/{userId}
Authorization: Bearer TOKEN (admin)

Response: 200 OK
{
  "_id": "...",
  "firstName": "John",
  "email": "john@example.com",
  "role": "customer",
  ...
}
```

### Update User Role (Admin)
```
PUT /users/{userId}/role
Authorization: Bearer TOKEN (admin)
Content-Type: application/json

{
  "role": "manager"
}

Response: 200 OK
```

### Deactivate User (Admin)
```
PUT /users/{userId}/deactivate
Authorization: Bearer TOKEN (admin)

Response: 200 OK
{
  "isActive": false,
  ...
}
```

### Activate User (Admin)
```
PUT /users/{userId}/activate
Authorization: Bearer TOKEN (admin)

Response: 200 OK
{
  "isActive": true,
  ...
}
```

### Get Dashboard Statistics (Admin)
```
GET /users/stats/dashboard
Authorization: Bearer TOKEN (admin)

Response: 200 OK
{
  "totalUsers": 150,
  "activeUsers": 145,
  "roleDistribution": {
    "admin": 2,
    "manager": 5,
    "staff": 10,
    "customer": 133
  }
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid or expired token",
  "data": null
}
```

### 403 Forbidden
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Forbidden: insufficient permissions",
  "data": null
}
```

### 404 Not Found
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Resource not found",
  "data": null
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal server error",
  "data": null
}
```

---

## 🔑 Valid Values

### Room Types
- `single`
- `double`
- `suite`
- `deluxe`
- `penthouse`

### Amenities
- `wifi`
- `air_conditioning`
- `tv`
- `refrigerator`
- `microwave`
- `coffee_maker`
- `workout_facility`
- `pool`
- `balcony`
- `safe`
- `hairdryer`
- `phone`

### Booking Status
- `pending`
- `confirmed`
- `checked_in`
- `checked_out`
- `cancelled`

### Payment Status
- `pending`
- `completed`
- `failed`
- `refunded`

### Payment Methods
- `credit_card`
- `debit_card`
- `bank_transfer`
- `cash`

### User Roles
- `admin`
- `manager`
- `staff`
- `customer`

---

## 📊 Pagination

All list endpoints support pagination:
```
GET /endpoint?page=1&limit=10
```

Response includes:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## 🛡️ Authentication Headers

All protected endpoints require:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Tokens expire after:
- **Access Token**: 7 days
- **Refresh Token**: 30 days

---

## 📝 Notes

1. All timestamps are in ISO 8601 format
2. All monetary values are in base currency unit (dollars)
3. Dates should be in ISO 8601 format
4. Emails are case-insensitive and must be unique
5. Room numbers must be unique within the property
6. Booking references are auto-generated
7. Pagination defaults: page=1, limit=10
8. CORS is configured for localhost:3000
