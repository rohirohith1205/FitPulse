# FitPulse (MERN)

## What was added
- `server/`: Express + Mongoose API
- `/api/plans`: CRUD
- `/api/members`: CRUD + search/status filters
- Vite dev proxy: `/api/*` → `http://localhost:5000`

## Setup (local)
### 1) Configure MongoDB
Use either **MongoDB Atlas** or a **local MongoDB** install.

- Copy `server/.env.example` → `server/.env`
- Set `MONGODB_URI`
  - Local example: `mongodb://127.0.0.1:27017/fitpulse`
  - Atlas example: `mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority`

### 2) Install deps
```bash
npm install
cd server && npm install
```

### 3) Run (two options)
- **One command**:
```bash
npm run dev:all
```

- **Two terminals**:
```bash
cd server && npm run dev
```
```bash
npm run dev
```

## API quick test
- `GET /api/health`
- `GET /api/plans`
- `GET /api/members`

