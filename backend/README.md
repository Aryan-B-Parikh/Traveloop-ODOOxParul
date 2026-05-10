# Traveloop Backend - Production Ready API

A complete, scalable, and production-ready backend for the Traveloop travel planning application built with Node.js, Express, PostgreSQL, and Prisma ORM.

## Features

### ✓ Complete Features Implemented
- **User Authentication & Authorization**
  - User registration with email and password
  - JWT-based authentication
  - Password hashing with bcrypt
  - Role-based access control (USER/ADMIN)
  - Protected and optional authenticated routes

- **Trip Management**
  - Create, read, update, and delete trips
  - Trip status tracking (PLANNED, ONGOING, COMPLETED, CANCELLED)
  - Trip details with multiple itinerary sections

- **Itinerary Management**
  - Add multiple itinerary sections to a trip
  - Section details with location, date range, and budget
  - Organized by dates and locations

- **Activity Management**
  - Add activities to itinerary sections
  - Activity details with cost, duration, category, and description
  - Link activities to specific sections

- **Budget & Expense Tracking**
  - Record expenses by category
  - Track total expenses and cost breakdown
  - Calculate expense summaries
  - Expense categories: ACCOMMODATION, TRANSPORTATION, FOOD, ACTIVITIES, SHOPPING, MISCELLANEOUS

- **Packing Checklist**
  - Add items to packing list
  - Categorize items
  - Mark items as checked/unchecked
  - Track packing status per trip

- **Trip Notes & Journal**
  - Add notes tied to trips
  - Tag notes by type
  - Edit and delete notes
  - Chronological organization

- **Community Sharing**
  - Publish trips to community feed
  - View shared trips from other users
  - Like community posts
  - Comment capability ready

- **Admin Dashboard**
  - View platform analytics
  - User statistics
  - Trip analytics and trends
  - Expense breakdown analysis
  - Community engagement metrics
  - User management

## Architecture

```
backend/
├── prisma/
│   ├── schema.prisma              # Database schema and models
│   └── migrations/                # Database migrations
│
├── src/
│   ├── config/
│   │   └── index.js               # Centralized configuration
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   ├── itinerarySectionController.js
│   │   ├── activityController.js
│   │   ├── expenseController.js
│   │   ├── packingItemController.js
│   │   ├── tripNoteController.js
│   │   ├── communityController.js
│   │   └── adminController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── itinerarySectionRoutes.js
│   │   ├── activityRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── packingItemRoutes.js
│   │   ├── tripNoteRoutes.js
│   │   ├── communityRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── tripService.js
│   │   ├── itinerarySectionService.js
│   │   ├── activityService.js
│   │   ├── expenseService.js
│   │   ├── packingItemService.js
│   │   ├── tripNoteService.js
│   │   ├── communityService.js
│   │   └── adminService.js
│   │
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication
│   │   ├── admin.js               # Admin role check
│   │   └── errorHandler.js        # Global error handling
│   │
│   ├── validators/
│   │   └── index.js               # Input validation rules
│   │
│   ├── utils/
│   │   └── helpers.js             # Utility functions
│   │
│   ├── lib/
│   │   ├── prisma.js              # Prisma client
│   │   └── jwt.js                 # JWT utilities
│   │
│   ├── app.js                     # Express app configuration
│   └── server.js                  # Server entry point
│
├── .env.example                   # Environment variables template
├── .gitignore
├── package.json                   # Dependencies and scripts
└── README.md
```

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Environment**: dotenv

## Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- PostgreSQL (v12 or higher)

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/traveloop"
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRY="7d"
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Create Database Migrations

```bash
npm run prisma:migrate
```

This command will:
- Create the PostgreSQL database if it doesn't exist
- Run all Prisma migrations
- Generate the Prisma client

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /health
```

## Authentication Endpoints

### Signup
```
POST /auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "status": 201,
  "message": "User registered successfully",
  "data": {
    "user": { "id", "email", "username", "firstName", "lastName" },
    "token": "jwt_token_here"
  }
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
  "status": 200,
  "message": "Login successful",
  "data": {
    "user": { "id", "email", "username", "firstName", "lastName" },
    "token": "jwt_token_here"
  }
}
```

### Get Profile
```
GET /auth/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "status": 200,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "email": "john@example.com",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "city": "New York",
    "country": "USA",
    "additionalInfo": "Travel enthusiast",
    "createdAt": "2024-05-10T10:30:00Z"
  }
}
```

### Update Profile
```
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "city": "New York",
  "country": "USA",
  "additionalInfo": "Updated info"
}

Response: 200 OK
```

## Trip Endpoints

### Create Trip
```
POST /trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "startDestination": "New York",
  "returnPlace": "New York",
  "startDate": "2024-06-01T00:00:00Z",
  "endDate": "2024-06-15T00:00:00Z",
  "description": "Summer vacation"
}

Response: 201 Created
```

### Get All Trips
```
GET /trips
Authorization: Bearer <token>

Response: 200 OK
{
  "status": 200,
  "message": "Trips retrieved successfully",
  "data": [ ... ]
}
```

### Get Trip by ID
```
GET /trips/:tripId
Authorization: Bearer <token>
```

### Update Trip
```
PUT /trips/:tripId
Authorization: Bearer <token>
Content-Type: application/json

{
  "startDestination": "Los Angeles",
  "status": "ONGOING"
}
```

### Delete Trip
```
DELETE /trips/:tripId
Authorization: Bearer <token>
```

## Itinerary Section Endpoints

### Create Section
```
POST /trips/:tripId/sections
Authorization: Bearer <token>
Content-Type: application/json

{
  "location": "Paris",
  "sectionDateStart": "2024-06-01T00:00:00Z",
  "sectionDateEnd": "2024-06-05T00:00:00Z",
  "sectionBudget": 2000,
  "description": "Paris visit"
}

Response: 201 Created
```

### Get Sections
```
GET /trips/:tripId/sections
Authorization: Bearer <token>
```

### Update Section
```
PUT /trips/:tripId/sections/:sectionId
Authorization: Bearer <token>
```

### Delete Section
```
DELETE /trips/:tripId/sections/:sectionId
Authorization: Bearer <token>
```

## Activity Endpoints

### Create Activity
```
POST /trips/:tripId/sections/:sectionId/activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Eiffel Tower Tour",
  "city": "Paris",
  "description": "Guided tour",
  "cost": 25,
  "duration": "2 hours",
  "category": "Sightseeing"
}

Response: 201 Created
```

### Get Activities
```
GET /trips/:tripId/sections/:sectionId/activities
Authorization: Bearer <token>
```

## Expense Endpoints

### Create Expense
```
POST /trips/:tripId/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "ACCOMMODATION",
  "description": "Hotel stay",
  "quantity": 1,
  "unitCost": 150.00
}

Response: 201 Created
```

### Get All Expenses
```
GET /trips/:tripId/expenses
Authorization: Bearer <token>
```

### Get Expense Summary
```
GET /trips/:tripId/expenses/summary/total
Authorization: Bearer <token>

Response: 200 OK
{
  "status": 200,
  "message": "Expense summary retrieved successfully",
  "data": {
    "total": 1500.50,
    "byCategory": {
      "ACCOMMODATION": 500,
      "FOOD": 200,
      "ACTIVITIES": 800.50
    },
    "count": 10
  }
}
```

## Packing Item Endpoints

### Create Item
```
POST /trips/:tripId/packing-items
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "Clothing",
  "itemName": "T-Shirt"
}

Response: 201 Created
```

### Get All Items
```
GET /trips/:tripId/packing-items
Authorization: Bearer <token>
```

### Update Item (Mark as checked)
```
PUT /trips/:tripId/packing-items/:itemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "isChecked": true
}
```

## Trip Note Endpoints

### Create Note
```
POST /trips/:tripId/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Remember to book restaurant reservations",
  "tagType": "reminder"
}

Response: 201 Created
```

### Get All Notes
```
GET /trips/:tripId/notes
Authorization: Bearer <token>
```

## Community Endpoints

### Create Post
```
POST /community
Authorization: Bearer <token>
Content-Type: application/json

{
  "tripId": 1,
  "postContent": "Had an amazing time in Paris!"
}

Response: 201 Created
```

### Get Community Feed
```
GET /community?limit=20&offset=0
```

### Get My Posts
```
GET /community/user/my-posts
Authorization: Bearer <token>
```

### Like Post
```
POST /community/:postId/like
Authorization: Bearer <token>
```

### Update Post
```
PUT /community/:postId
Authorization: Bearer <token>
Content-Type: application/json

{
  "postContent": "Updated content"
}
```

### Delete Post
```
DELETE /community/:postId
Authorization: Bearer <token>
```

## Admin Endpoints

All admin endpoints require JWT token and ADMIN role.

### Get Dashboard
```
GET /admin/dashboard
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "status": 200,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "summary": {
      "totalUsers": 100,
      "totalTrips": 250,
      "totalExpenses": 1000,
      "totalPosts": 50
    },
    "recentUsers": [ ... ],
    "tripStats": [ ... ],
    "expensesByCategory": [ ... ]
  }
}
```

### Get All Users
```
GET /admin/users?limit=20&offset=0
Authorization: Bearer <admin_token>
```

### Get User by ID
```
GET /admin/users/:userId
Authorization: Bearer <admin_token>
```

### Get Trip Analytics
```
GET /admin/analytics/trips
Authorization: Bearer <admin_token>
```

### Get Expense Analytics
```
GET /admin/analytics/expenses
Authorization: Bearer <admin_token>
```

### Get Community Analytics
```
GET /admin/analytics/community
Authorization: Bearer <admin_token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": [
    {
      "field": "fieldName",
      "message": "Error description"
    }
  ]
}
```

### Common Error Codes
- `400`: Bad Request - Validation failed
- `401`: Unauthorized - Missing or invalid token
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `409`: Conflict - Duplicate entry (e.g., email already exists)
- `500`: Internal Server Error

## Validation Rules

- **Username**: 3-100 characters
- **Email**: Valid email format
- **Password**: Minimum 8 characters
- **Names**: At least 1 character
- **Dates**: ISO 8601 format
- **Amounts**: Positive decimal numbers

## Security Features

- ✓ JWT token-based authentication
- ✓ Bcrypt password hashing
- ✓ Role-based access control (USER/ADMIN)
- ✓ Rate limiting (100 requests per 15 minutes)
- ✓ CORS protection
- ✓ Helmet security headers
- ✓ Input validation
- ✓ SQL injection prevention (Prisma ORM)
- ✓ Environment variable protection

## Performance Considerations

- Database queries optimized with Prisma relationships
- Proper indexing on frequently queried fields
- Rate limiting to prevent abuse
- Pagination support for large datasets
- Efficient error handling

## Database Schema

See `prisma/schema.prisma` for complete schema with all relationships, indexes, and enums.

**Main Entities:**
- Users
- Trips
- ItinerarySections
- Activities
- Expenses
- PackingItems
- TripNotes
- CommunityPosts

## Development Tips

### View Database GUI
```bash
npm run prisma:studio
```

Opens Prisma Studio at `http://localhost:5555`

### Regenerate Prisma Client
```bash
npm run prisma:generate
```

### Create New Migration
```bash
npm run prisma:migrate
```

## Deployment

### Production Checklist
- [ ] Change `NODE_ENV` to "production"
- [ ] Update `JWT_SECRET` with a strong random key
- [ ] Set appropriate `CORS_ORIGIN`
- [ ] Use production PostgreSQL database
- [ ] Enable HTTPS
- [ ] Set up environment variables securely
- [ ] Configure logging
- [ ] Set up monitoring and alerting
- [ ] Test all endpoints
- [ ] Run database migrations

## Scripts

```bash
npm start                    # Start production server
npm run dev                  # Start development server with auto-reload
npm run prisma:generate      # Generate Prisma client
npm run prisma:migrate       # Run database migrations
npm run prisma:studio        # Open Prisma Studio GUI
npm run prisma:deploy        # Deploy migrations to production
```

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database user has correct permissions
- Try: `psql -U user -d traveloop -c "SELECT 1"`

### JWT Token Invalid
- Check `JWT_SECRET` matches between signup/login
- Verify token hasn't expired
- Ensure token is sent in `Authorization: Bearer <token>` format

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process: `lsof -i :5000` then `kill -9 <PID>`

### Prisma Migration Issues
- Reset database: `npx prisma migrate reset`
- Regenerate client: `npm run prisma:generate`

## Contributing

Ensure all code follows the existing patterns:
- Services for business logic
- Controllers for request handling
- Validators for input validation
- Middleware for cross-cutting concerns
- Consistent error handling

## License

ISC

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.

---

**Built with ❤️ for Traveloop**
