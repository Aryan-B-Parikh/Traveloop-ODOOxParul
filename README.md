# Traveloop

Full-stack travel planning app with a React/Vite frontend and Node/Express backend.

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL (local or remote)

## Backend setup

```bash
cd backend
npm install
```

Create [backend/.env](backend/.env) (copy from `.env.example`) and set values:

- `DATABASE_URL` (URL-encode special characters in passwords)
- `JWT_SECRET`
- `CORS_ORIGIN` (usually `http://localhost:5173`)

Run the API server:

```bash
npm run dev
```

## Frontend setup

```bash
cd frontend
npm install
npm run start
```

Open `http://localhost:5173`.

## Windows PowerShell note

If PowerShell blocks `npm.ps1`, run:

```bash
npm.cmd run dev
npm.cmd run start
```
