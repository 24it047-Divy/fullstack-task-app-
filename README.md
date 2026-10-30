# TaskPulse - Full-Stack Task Management, Performance Optimization & Event-Driven Architecture

[![CI Pipeline](https://github.com/24it047-Divy/fullstack-task-app-/actions/workflows/ci.yml/badge.svg)](https://github.com/24it047-Divy/fullstack-task-app-/actions/workflows/ci.yml)

**Course / Lab**: Web Development Frameworks (AWDF)  
**Student**: Divy (24IT047)  
**Practicals Covered**:
- **Practical 6**: Full-Stack CRUD API Integration (React + Express + MongoDB)
- **Practical 8**: Performance Optimization & Lazy Loading (`React.lazy()` + `<Suspense>`)
- **Practical 10**: Asynchronous Processing with Event-Driven Architecture (`Node.js Native EventEmitter`)
- **Practical 11**: Containerization with Docker & Docker Compose
- **Practical 12**: Automated CI/CD Pipeline with GitHub Actions
**CO/PO**: CO1, CO2, CO5 / PO3, PO5  

---

## ⚙️ CI/CD Pipeline with GitHub Actions

### Workflow Architecture:
```
git push origin main
        │
        ▼
GitHub Actions Trigger (on: push, pull_request)
        │
        ▼
Job: build-and-test (ubuntu-latest)
  ├── 1. Checkout repository (actions/checkout@v4)
  ├── 2. Setup Node.js 18 runtime (actions/setup-node@v4)
  ├── 3. Install backend dependencies (npm install)
  ├── 4. Run automated Jest & Supertest test suite (npm test)
  └── 5. Report pass / fail status badge to GitHub
```

### Automated Tests:
- `GET /tasks` — validates status `200` and response payload.
- `GET /` — validates status `200` API health-check endpoint.
- `POST /tasks` — validates status `400` schema validation when task title is omitted.

---

## 🚀 Practical 10: Asynchronous Processing with Event-Driven Architecture

### Objective
To implement asynchronous background processing using Node.js native `EventEmitter` without external dependencies. When a new task is created via the API, emit a `task-created` event that is handled asynchronously to log a notification (task title, timestamp, assigned user). The main API response returns immediately without waiting for the event handler to complete.

### Architecture Comparison (Synchronous vs. Event-Driven)

```
SYNCHRONOUS BLOCKING (Without EventEmitter):
Client ──► API ──► DB Save ──► Blocking Email/Notification (1200ms) ──► 201 Response (1226 ms Latency!)

ASYNCHRONOUS EVENT-DRIVEN (With Native EventEmitter):
Client ──► API ──► DB Save ──► emit('task-created') ──► 201 Response Sent IMMEDIATELY (17 ms Latency!)
                                      │
                                      ▼ (Asynchronous Decoupled Background Worker)
                                 taskEmitter.on('task-created') ──► Log Notification & Complete (1206ms)
```

### 📊 Benchmark Comparison Results

| Architecture Pattern | Client Response Latency | Client Perceived Delay | Speedup Multiplier |
| :--- | :--- | :--- | :--- |
| **Synchronous (Blocking Inline)** | **1226 ms** | Heavy delay (>1.2s) | Baseline |
| **Asynchronous (Native EventEmitter)** | **17 ms** | Instant response | **72.1x Faster!** |

### 🧪 Run Practical 10 Verification Script:
```bash
node backend/scripts/demo_event_driven.js
```

Detailed documentation and report: [`docs/PRACTICAL10_EVENT_DRIVEN_ARCHITECTURE.md`](file:///c:/AWDF/pr6/docs/PRACTICAL10_EVENT_DRIVEN_ARCHITECTURE.md)

---

## ⚡ Practical 8: Performance Optimization & Lazy Loading Summary

### Objective
To optimize the React frontend of the Task Management application by implementing route-based code splitting with `React.lazy()` and `<Suspense>`, reducing initial JavaScript bundle size, deferred loading of heavy third-party visualization components (Recharts), and measuring performance improvements using browser developer tools.

### Architecture Diagram (Before vs. After Optimization)

```
BEFORE (Single Monolithic Bundle):
main.bundle.js ────────────────────────────────► [Home][Projects][Analytics][Contact] all loaded upfront

AFTER (Route-Based Code-Split Chunks):
index.js ─────────────► Initial entry bundle (Loads immediately on first visit)
 ├── Home.chunk.js ───► Loaded only when / is visited
 ├── Projects.chunk.js► Loaded only when /projects is visited
 ├── Contact.chunk.js ─► Loaded only when /contact is visited
 └── Analytics.chunk.js► Loaded when /analytics is visited
      └── HeavyAnalyticsChart.chunk.js ─► Deferred heavy Recharts library (~412 kB)
```

---

## 📊 Before vs. After Performance Comparison Table

| Metric / Asset | Baseline Build (Monolithic) | Optimized Build (Code-Split) | Performance Benefit |
| :--- | :--- | :--- | :--- |
| **Initial JS Bundle Size** | **172.56 kB** (53.68 kB gzip) | **201.00 kB** (65.68 kB gzip)* | Core router runtime & state context |
| **Home Route Chunk (`Home.js`)** | Bundled in main | **16.67 kB** (4.27 kB gzip) | Downloaded on `/` visit |
| **Projects Route Chunk (`Projects.js`)** | Bundled in main | **3.75 kB** (1.57 kB gzip) | Downloaded on `/projects` visit |
| **Contact Route Chunk (`Contact.js`)** | Bundled in main | **6.97 kB** (2.24 kB gzip) | Downloaded on `/contact` visit |
| **Analytics Route Chunk (`Analytics.js`)** | Bundled in main | **2.15 kB** (0.87 kB gzip) | Downloaded on `/analytics` visit |
| **Heavy Chart Component (`Recharts`)** | Bundled in main | **411.96 kB** (118.84 kB gzip) | **Deferred until `/analytics` visited!** |
| **Initial Download Saved on Home** | **0.00 kB** (Loaded everything) | **~424.83 kB** deferred | **~67.8% lower initial route payload** |

> *\*Note: Practical 8 added `react-router-dom` and `recharts` engines to the project. Code-splitting ensures the 411.96 kB charting component is never downloaded by users who only view the Home task list.*

---

## 💡 Key Analysis & Theoretical Questions

1. **Difference between initial bundle & lazy chunk**: The initial entry bundle (`index.js`) downloads on first visit to render the app shell. Lazy chunks download asynchronously on-demand when navigating to specific routes (`/projects`, `/contact`, `/analytics`).
2. **Why perceived performance improves**: By downloading less JavaScript upfront, Time-to-Interactive (TTI) and First Contentful Paint (FCP) are faster. Users on slow 3G networks get an instant UI response.
3. **When lazy loading isn't needed**: Micro apps under 50-100 kB total JS size or essential components always visible on initial render (e.g. Navbar) do not benefit from lazy loading overhead.

---

## 🛠️ Step-by-Step Practical 8 Implementation

1. **Lazy Loading Route Imports** (`App.jsx`):
   ```javascript
   import React, { lazy, Suspense } from 'react';
   const Home = lazy(() => import('./pages/Home'));
   const Projects = lazy(() => import('./pages/Projects'));
   const Analytics = lazy(() => import('./pages/Analytics'));
   const Contact = lazy(() => import('./pages/Contact'));
   ```

2. **Suspense Wrapper with Custom Fallback UI**:
   ```javascript
   <Suspense fallback={<LoadingFallback message="Loading requested page chunk..." />}>
     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/projects" element={<Projects />} />
       <Route path="/analytics" element={<Analytics />} />
       <Route path="/contact" element={<Contact />} />
     </Routes>
   </Suspense>
   ```

3. **Supplementary Problem: Heavy Component Lazy Loading**:
   In `Analytics.jsx`, the 412 kB charting engine `HeavyAnalyticsChart` is wrapped in its own `Suspense` block and dynamically imported so it doesn't block page navigation.

4. **Minimum-Delay Fallback Mechanism**:
   Implemented a minimum 250ms delay helper (`lazyWithDelay`) to avoid flickering loading states on high-speed Wi-Fi connections.

---

## 📁 Repository Structure

```
pr6/
├── docs/
│   └── PRACTICAL8_PERFORMANCE_REPORT.md  # Detailed performance metrics & DevTools profiling guide
├── backend/                             # Node.js + Express + Mongoose API
│   ├── config/                          # Database connection logic (db.js)
│   ├── controllers/                     # CRUD controllers (taskController.js)
│   ├── models/                          # Mongoose schema (Task.js)
│   ├── routes/                          # Express router (taskRoutes.js)
│   └── server.js                        # Express server entry point
├── frontend/                            # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/                  # UI & Fallback Components (Navbar, LoadingFallback, HeavyAnalyticsChart, TaskForm, etc.)
│   │   ├── context/                     # Toast Context (ToastContext.jsx)
│   │   ├── pages/                       # Route Pages (Home.jsx, Projects.jsx, Analytics.jsx, Contact.jsx)
│   │   ├── services/                    # Central API Service (api.js)
│   │   ├── App.jsx                      # Router & React.lazy Splitting
│   │   └── index.css                    # Dark-mode styling system
│   └── package.json                     # Dependencies (react-router-dom, recharts, lucide-react)
└── README.md                            # Comprehensive project README
```

---

## 🚀 How to Run Locally

### Terminal 1: Backend Server (Port 5000)
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend App (Port 5173)
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing Chunk Loading with DevTools (Network Throttling)

1. Open Chrome/Edge DevTools (`F12`).
2. Switch to the **Network** tab and select **JS**.
3. Set Network Throttling to **"Slow 3G"**.
4. Navigate between **Tasks**, **Projects**, **Analytics**, and **Contact** tabs.
5. Observe the glowing `LoadingFallback` UI appearing while chunk files (`Projects-*.js`, `Analytics-*.js`, `HeavyAnalyticsChart-*.js`) load asynchronously!

---

## 🐳 Containerization with Docker & Docker Compose

The entire full-stack application is containerized into production-ready Docker containers orchestrated with Docker Compose:

| Service | Technology | Container Port | Host Port | Role |
| :--- | :--- | :--- | :--- | :--- |
| **`mongo`** | MongoDB 6.0 | `27017` | Internal | Persistent database storage via named volume `taskpulse-mongo-data` |
| **`backend`** | Node.js 20 Alpine / Express | `5000` | `5000` | REST API with healthcheck & event listener |
| **`frontend`** | React + Vite / Nginx Alpine | `80` | `80` | Production SPA server & reverse proxy |

### Run with Docker Compose (Single Command):
```bash
# Start all services in detached mode
docker compose up --build -d

# Check running status of containers
docker compose ps

# Access the application:
# - Frontend: http://localhost
# - Backend API: http://localhost:5000

# Stop all containers
docker compose down
```
