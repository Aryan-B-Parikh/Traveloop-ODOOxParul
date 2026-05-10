# QUICK REFERENCE - TRAVELOOP BACKEND

## 🚀 START HERE (3 Steps)

```bash
# 1. Install
npm install

# 2. Setup database
npm run prisma:migrate

# 3. Run
npm run dev
```

Server running at: `http://localhost:5000`

---

## 📝 COMMON COMMANDS

```bash
npm install                 # Install dependencies
npm run dev                 # Start with auto-reload
npm start                   # Start production server
npm run prisma:generate     # Generate Prisma client
npm run prisma:migrate      # Run database migrations
npm run prisma:studio       # Open database GUI
```

---

## 🔑 API QUICK TEST

### 1. Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"password123",
    "firstName":"Test",
    "lastName":"User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'
```

### 3. Save Token & Use
```bash
# Response includes: "token": "eyJhbGc..."
TOKEN="your_token_here"

# Use token in header:
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:5000/api/auth/profile
```

---

## 📂 FOLDER STRUCTURE QUICK VIEW

```
backend/
├── src/
│   ├── controllers/     # Handle requests
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, errors
│   ├── validators/      # Input validation
│   ├── config/          # Configuration
│   ├── lib/             # Utilities
│   ├── app.js           # Express setup
│   └── server.js        # Server entry
├── prisma/
│   └── schema.prisma    # Database schema
├── .env                 # Environment vars
└── package.json
```

---

## 🔐 AUTHENTICATION

All protected endpoints need header:
```
Authorization: Bearer <JWT_TOKEN>
```

Roles: `USER` (default), `ADMIN`

---

## 📚 MAIN ENDPOINTS

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/auth/signup | ❌ | Register user |
| POST | /api/auth/login | ❌ | Login user |
| GET | /api/auth/profile | ✅ | Get profile |
| POST | /api/trips | ✅ | Create trip |
| GET | /api/trips | ✅ | List trips |
| POST | /api/community | ✅ | Create post |
| GET | /api/community | ❌ | View feed |
| GET | /api/admin/dashboard | ✅ ADMIN | Admin panel |

---

## 🔧 ENVIRONMENT SETUP

`.env` file must have:
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/traveloop"
JWT_SECRET="your-secret-key"
JWT_EXPIRY="7d"
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

---

## ✅ VALIDATION RULES

| Field | Rule | Example |
|-------|------|---------|
| username | 3-100 chars | "john_doe" |
| email | Valid format | "john@example.com" |
| password | Min 8 chars | "SecurePass123!" |
| dates | ISO 8601 | "2024-06-01T00:00:00Z" |
| amount | Positive number | 99.99 |

---

## 🚨 ERROR RESPONSES

```json
{
  "error": "Message",
  "details": [
    {"field": "email", "message": "Invalid email"}
  ]
}
```

**Status Codes:**
- 200: Success
- 201: Created
- 400: Bad request (validation)
- 401: Unauthorized (no token)
- 403: Forbidden (no permission)
- 404: Not found
- 409: Conflict (duplicate)
- 500: Server error

---

## 📊 CREATING RECORDS

### 1. Create Trip
```
POST /api/trips
{
  "startDestination": "NYC",
  "returnPlace": "NYC",
  "startDate": "2024-06-01T00:00:00Z",
  "endDate": "2024-06-15T00:00:00Z"
}
```

### 2. Add Section
```
POST /api/trips/1/sections
{
  "location": "Paris",
  "sectionDateStart": "2024-06-01T00:00:00Z",
  "sectionDateEnd": "2024-06-05T00:00:00Z",
  "sectionBudget": 2000
}
```

### 3. Add Activity
```
POST /api/trips/1/sections/1/activities
{
  "name": "Eiffel Tower",
  "city": "Paris",
  "cost": 25
}
```

### 4. Add Expense
```
POST /api/trips/1/expenses
{
  "category": "ACCOMMODATION",
  "description": "Hotel",
  "quantity": 1,
  "unitCost": 150
}
```

---

## 🐛 DEBUGGING

### Check Database
```bash
npm run prisma:studio
# Opens: http://localhost:5555
```

### View Logs
Server logs appear in terminal where `npm run dev` runs

### Test Endpoint
```bash
curl -v http://localhost:5000/api/health
```

### Common Issues

| Problem | Solution |
|---------|----------|
| Port in use | Change PORT in .env |
| DB connection fail | Check DATABASE_URL |
| Token invalid | Regenerate token with login |
| Route not found | Check URL matches exactly |

---

## 📱 RESPONSE EXAMPLES

### Success
```json
{
  "status": 201,
  "message": "Trip created successfully",
  "data": {
    "id": 1,
    "startDestination": "NYC",
    "startDate": "2024-06-01T00:00:00Z"
  }
}
```

### Error
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

---

## 🎯 WORKFLOW

1. **User Registration**
   - POST /api/auth/signup
   - Receive JWT token

2. **Create Trip**
   - POST /api/trips (with token)
   - Get trip ID

3. **Add Itinerary**
   - POST /api/trips/:id/sections
   - Add activities, expenses, notes

4. **Manage Budget**
   - POST /api/trips/:id/expenses
   - GET /api/trips/:id/expenses/summary/total

5. **Share**
   - POST /api/community (share trip)
   - GET /api/community (view feed)

6. **Admin View**
   - GET /api/admin/dashboard (admin token)
   - View analytics

---

## 🔑 KEY FILES

| File | Purpose |
|------|---------|
| src/app.js | Express setup |
| src/server.js | Start server |
| prisma/schema.prisma | Database design |
| .env | Configuration |
| src/middleware/auth.js | JWT verification |
| src/services/* | Business logic |
| src/validators/index.js | Input validation |

---

## ✨ FEATURES INCLUDED

✅ User authentication (JWT + bcrypt)
✅ Trip management (CRUD)
✅ Itinerary sections
✅ Activities tracking
✅ Budget & expenses
✅ Packing checklist
✅ Trip notes/journal
✅ Community sharing
✅ Admin dashboard
✅ Input validation
✅ Error handling
✅ Rate limiting
✅ CORS support

---

## 📖 FULL DOCUMENTATION

- API Docs: See `README.md`
- Setup Guide: See `SETUP.md`
- Completion Report: See `COMPLETION_REPORT.md`

---

## 🎉 YOU'RE READY!

```bash
cd backend
npm install
npm run dev
```

Visit: http://localhost:5000/api/health

---

**Last Updated:** 2024-05-10
**Status:** ✅ Production Ready
