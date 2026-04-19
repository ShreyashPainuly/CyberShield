# 🛡️ CyberShield — URL Threat Detection Platform

A production-ready cybersecurity platform built with the **MERN stack** (MongoDB, Express, React, Node.js) where users can analyze URLs and detect whether they are safe, suspicious, or phishing/scam links.

![CyberShield](https://img.shields.io/badge/CyberShield-v1.0.0-6366f1?style=for-the-badge)
![MERN](https://img.shields.io/badge/Stack-MERN-10b981?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)

## ✨ Features

- **🔍 URL Scanning** — Instant multi-factor threat analysis with 12+ risk indicators
- **📊 Risk Classification** — Safe 🟢 / Suspicious 🟡 / Dangerous 🔴
- **🔐 User Authentication** — JWT-based login & registration with bcrypt
- **📈 Dashboard** — Scan history, stats, and 7-day activity charts
- **🔔 Real-Time Alerts** — Socket.io powered notifications for dangerous URLs
- **🎨 Modern UI** — Glassmorphism, dark mode, gradient animations, and responsive design

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Tailwind CSS v4, Framer Motion, Recharts |
| **Backend** | Node.js, Express, Socket.io |
| **Database** | MongoDB with Mongoose |
| **Auth** | JWT + bcrypt |
| **Security** | Helmet, CORS, Rate Limiting, Joi Validation |

## 📁 Project Structure

```
CyberShield/
├── server/                     # Backend API
│   ├── config/db.js           # MongoDB connection
│   ├── models/                # Mongoose schemas
│   ├── middleware/            # Auth, validation, rate limiting
│   ├── controllers/           # Route handlers
│   ├── services/              # URL analysis engine & blacklist
│   ├── routes/                # Express routes
│   └── server.js              # Entry point
├── client/                     # Frontend React App
│   ├── src/
│   │   ├── components/        # Navbar, ResultCard, StatsCards, etc.
│   │   ├── pages/             # Home, Dashboard, Login, Register
│   │   ├── context/           # Auth context
│   │   ├── services/          # API client (Axios)
│   │   └── App.jsx            # Main app with routing
│   └── index.html
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally or a MongoDB Atlas connection string

### 1. Clone and Install

```bash
# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cybershield
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Run the Application

```bash
# Terminal 1: Start backend
cd server && npm run dev
# → API running at http://localhost:5000

# Terminal 2: Start frontend
cd client && npm run dev
# → App running at http://localhost:5173
```

### 5. Open the App

Navigate to **http://localhost:5173** in your browser.

## 🔍 URL Analysis Engine

The scanning engine evaluates URLs across 12+ threat factors:

| Factor | Risk Points | Description |
|--------|:-----------:|-------------|
| Blacklisted pattern | +30 | Matches known malicious domains |
| IP-based URL | +25 | Uses raw IP instead of domain |
| Contains @ symbol | +20 | URL misdirection technique |
| Suspicious TLD | +15 | .xyz, .tk, .ml, etc. |
| Phishing keywords | +15 | login, verify, secure, etc. |
| Internationalized domain | +15 | Potential homograph attack |
| Double file extension | +15 | Malware delivery technique |
| Excessive subdomains | +10 | More than 3 levels deep |
| URL shortener | +10 | Hides actual destination |
| Unusual port | +10 | Non-standard port usage |
| Encoded characters | +10 | Obfuscation attempt |
| Excessive length | +5-10 | Over 75 characters |
| HTTPS present | -10 | Bonus for encrypted connection |

### Risk Levels
- **0–30**: 🟢 **Safe** — No significant threats
- **31–60**: 🟡 **Suspicious** — Proceed with caution
- **61–100**: 🔴 **Dangerous** — Do not visit

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/auth/register` | ✗ | Create account |
| `POST` | `/api/auth/login` | ✗ | Login |
| `GET` | `/api/auth/me` | ✓ | Current user |
| `POST` | `/api/scan` | ✓ | Scan a URL |
| `GET` | `/api/scan/:id` | ✓ | Get scan details |
| `GET` | `/api/history` | ✓ | Scan history |
| `GET` | `/api/history/stats` | ✓ | Dashboard stats |
| `DELETE` | `/api/history/:id` | ✓ | Delete scan |
| `GET` | `/api/health` | ✗ | Health check |

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd client
npx vercel --prod
```

Set the environment variable `VITE_API_URL` to your backend URL.

### Backend (Render)

1. Push to GitHub
2. Create a new Web Service on Render
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables from `.env`

## 📝 License

MIT
