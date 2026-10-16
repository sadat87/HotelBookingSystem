# 🏗️ Hotel Management System - Complete Project Structure

```
hotel/ (Root)
│
├── 📄 README.md                    # Main documentation
├── 📄 QUICKSTART.md               # 5-minute setup guide
├── 📄 API_REFERENCE.md            # Complete API endpoints
├── 📄 PROJECT_SUMMARY.md          # Project overview
├── 📄 .gitignore                  # Git ignore rules
│
├── 📁 backend/                    # Node.js + Express API Server
│   │
│   ├── 📄 package.json            # Dependencies & scripts
│   ├── 📄 .env.example            # Environment template
│   ├── 📄 README.md               # Backend documentation
│   │
│   └── src/
│       │
│       ├── 📄 index.js            # Express server entry point
│       │
│       ├── 📁 config/
│       │   └── 📄 database.js     # MongoDB connection setup
│       │
│       ├── 📁 constants/
│       │   └── 📄 index.js        # App-wide constants
│       │                          # - Roles, room types, status enums
│       │
│       ├── 📁 models/             # MongoDB Schemas (Database Layer)
│       │   ├── 📄 User.js         # User schema with roles & tokens
│       │   ├── 📄 Room.js         # Room schema with amenities
│       │   ├── 📄 Booking.js      # Booking schema with payment info
│       │   └── 📄 Pricing.js      # Seasonal pricing schema
│       │
│       ├── 📁 services/           # Business Logic Layer
│       │   ├── 📄 AuthService.js  # Authentication logic
│       │   │                      # - Register, login, token management
│       │   ├── 📄 RoomService.js  # Room operations
│       │   │                      # - Create, availability, calendar
│       │   ├── 📄 BookingService.js # Booking operations
│       │   │                      # - Create, confirm, check-in/out
│       │   └── 📄 UserService.js  # User management
│       │                          # - Profile, role assignment, stats
│       │
│       ├── 📁 controllers/        # HTTP Request Handlers
│       │   ├── 📄 AuthController.js
│       │   ├── 📄 RoomController.js
│       │   ├── 📄 BookingController.js
│       │   └── 📄 UserController.js
│       │
│       ├── 📁 routes/             # API Routes (REST Endpoints)
│       │   ├── 📄 auth.js         # /api/auth/* endpoints
│       │   ├── 📄 rooms.js        # /api/rooms/* endpoints
│       │   ├── 📄 bookings.js     # /api/bookings/* endpoints
│       │   └── 📄 users.js        # /api/users/* endpoints
│       │
│       ├── 📁 middleware/         # Express Middleware
│       │   ├── 📄 auth.js         # JWT verification & authorization
│       │   ├── 📄 validation.js   # Joi request validation
│       │   └── 📄 errorHandler.js # Global error handling
│       │
│       └── 📁 utils/              # Utility Functions
│           ├── 📄 jwt.js          # JWT token operations
│           └── 📄 helpers.js      # Date, response, helper functions
│
├── 📁 frontend/                   # Next.js 14 React Application
│   │
│   ├── 📄 package.json            # Dependencies & scripts
│   ├── 📄 next.config.js          # Next.js configuration
│   ├── 📄 .env.local              # Frontend environment (not in repo)
│   ├── 📄 README.md               # Frontend documentation
│   │
│   ├── 📁 public/                 # Static assets
│   │   └── (images, icons, etc.)
│   │
│   └── src/
│       │
│       ├── 📁 app/                # Next.js App Router Pages
│       │   ├── 📄 layout.js       # Root layout wrapper
│       │   ├── 📄 page.js         # Home page (/)
│       │   │
│       │   ├── 📁 login/
│       │   │   └── 📄 page.js     # Login page (/login)
│       │   │
│       │   ├── 📁 register/
│       │   │   └── 📄 page.js     # Register page (/register)
│       │   │
│       │   ├── 📁 dashboard/
│       │   │   └── 📄 page.js     # Dashboard (/dashboard)
│       │   │                      # - User welcome, quick links
│       │   │
│       │   ├── 📁 rooms/
│       │   │   └── 📄 page.js     # Room listing (/rooms)
│       │   │                      # - Browse all rooms
│       │   │
│       │   └── 📁 bookings/
│       │       └── 📄 page.js     # Bookings page (/bookings)
│       │                          # - View user's bookings
│       │
│       ├── 📁 components/         # Reusable React Components
│       │   └── 📄 Navigation.jsx  # Navigation bar component
│       │
│       ├── 📁 config/             # Configuration Files
│       │   ├── 📄 constants.js    # API endpoints & constants
│       │   └── 📄 api.js          # Axios instance setup
│       │
│       ├── 📁 hooks/              # Custom React Hooks
│       │   ├── 📄 useAPI.js       # API operations hooks
│       │   │                      # - useAuth, useRooms, useBookings
│       │   └── 📄 useNavigation.js # Route protection hooks
│       │                          # - useRequireAuth, useRedirectIfAuth
│       │
│       ├── 📁 lib/                # Utility Functions
│       │   └── 📄 auth.js         # Auth helpers
│       │                          # - Token management, role checking
│       │
│       ├── 📁 store/              # State Management (Zustand)
│       │   └── 📄 index.js        # All stores
│       │                          # - useAuthStore, useBookingStore, useRoomStore
│       │
│       └── 📁 styles/             # Stylesheets
│           └── 📄 globals.css     # Global styles & utilities
│
└── (Additional files as created above)
```

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages (User Interface)                              │  │
│  │  - Login, Register, Dashboard, Rooms, Bookings      │  │
│  └─────────────────────┬────────────────────────────────┘  │
│                        │                                     │
│  ┌─────────────────────▼────────────────────────────────┐  │
│  │  Hooks (useAuth, useRooms, useBookings)             │  │
│  │  - API calls, state management                       │  │
│  └─────────────────────┬────────────────────────────────┘  │
│                        │                                     │
│  ┌─────────────────────▼────────────────────────────────┐  │
│  │  Axios Client (src/config/api.js)                   │  │
│  │  - Auto token injection, refresh, error handling    │  │
│  └─────────────────────┬────────────────────────────────┘  │
│                        │                                     │
└────────────────────────┼─────────────────────────────────────┘
                         │ REST API (HTTP/HTTPS)
┌────────────────────────▼─────────────────────────────────────┐
│                   BACKEND (Express)                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Routes & Middleware                                  │  │
│  │  - Request parsing, validation, auth, error handling │  │
│  └─────────────────────┬────────────────────────────────┘  │
│                        │                                     │
│  ┌─────────────────────▼────────────────────────────────┐  │
│  │  Controllers (Request Handlers)                      │  │
│  │  - Parse request, call service, format response     │  │
│  └─────────────────────┬────────────────────────────────┘  │
│                        │                                     │
│  ┌─────────────────────▼────────────────────────────────┐  │
│  │  Services (Business Logic)                           │  │
│  │  - Complex operations, calculations, validations    │  │
│  └─────────────────────┬────────────────────────────────┘  │
│                        │                                     │
│  ┌─────────────────────▼────────────────────────────────┐  │
│  │  Models (Data Layer)                                │  │
│  │  - Database schema, validation, relationships      │  │
│  └─────────────────────┬────────────────────────────────┘  │
│                        │                                     │
└────────────────────────┼──────────────────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────────────────┐
│              MongoDB Database                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Collections:                                        │   │
│  │  - users (with roles & tokens)                       │   │
│  │  - rooms (with amenities)                            │   │
│  │  - bookings (with payment info)                      │   │
│  │  - pricing (seasonal rates)                          │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Files & Their Purposes

### Backend Core Files
| File | Purpose |
|------|---------|
| `backend/src/index.js` | Express server setup, routes mounting, middleware |
| `backend/src/config/database.js` | MongoDB connection initialization |
| `backend/src/models/*.js` | Database schema definitions |
| `backend/src/services/*.js` | Business logic & database operations |
| `backend/src/controllers/*.js` | HTTP request handling |
| `backend/src/routes/*.js` | REST endpoint definitions |
| `backend/src/middleware/auth.js` | JWT verification & role authorization |
| `backend/src/middleware/validation.js` | Request body validation |

### Frontend Core Files
| File | Purpose |
|------|---------|
| `frontend/src/app/layout.js` | Root layout, global providers |
| `frontend/src/app/page.js` | Home page entry point |
| `frontend/src/config/api.js` | Axios client with interceptors |
| `frontend/src/store/index.js` | Zustand global state stores |
| `frontend/src/hooks/useAPI.js` | API operation custom hooks |
| `frontend/src/lib/auth.js` | Authentication utilities |

---

## 📊 Component Relationships

```
Services
  ↓
Controllers → Routes
  ↓
Middleware (Auth, Validation, Error Handling)
  ↓
Express App → HTTP Response
  ↓
Client (Frontend) ← Axios + Hooks
  ↓
Components & Pages
  ↓
User Interface
```

---

## 🔐 Security Layer Structure

```
Frontend Security:
- HTTP-only cookie storage
- Automatic token refresh
- Role-based route protection
- Input validation

Backend Security:
- JWT authentication
- Password hashing (bcryptjs)
- Input validation (Joi)
- Role-based authorization
- CORS configuration
- Error handling (no internals exposed)
```

---

## 📈 Scaling Considerations

The architecture supports scaling through:

1. **Horizontal Scaling**
   - Stateless JWT authentication
   - Database-agnostic services
   - Load balancer friendly

2. **Vertical Scaling**
   - Proper indexing on MongoDB
   - Pagination for large datasets
   - Efficient query patterns

3. **Feature Additions**
   - Modular service structure
   - Easy to add new routes
   - Extensible middleware

---

## ✅ Architecture Compliance

✅ **Strict MVC**: Models, Views (API), Controllers, Services
✅ **Separation of Concerns**: Frontend & Backend completely separate
✅ **RESTful API**: Proper HTTP methods & status codes
✅ **Authentication**: JWT with refresh tokens
✅ **Authorization**: Role-based access control
✅ **Validation**: Input validation at multiple layers
✅ **Error Handling**: Global error handler with proper responses
✅ **Documentation**: Comprehensive docs & comments

---

## 🎓 Learning Path

To understand the codebase:

1. Start with `PROJECT_SUMMARY.md`
2. Read `QUICKSTART.md` to set up locally
3. Review backend `README.md`
4. Review frontend `README.md`
5. Check `API_REFERENCE.md` for endpoints
6. Explore `src/` directories in order: models → services → controllers → routes

---

This structure ensures **clean code, scalability, maintainability, and production readiness**.
