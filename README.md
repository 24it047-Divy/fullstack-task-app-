# Practical 6: Full Stack Integration (React + Node/Express + MongoDB)

**CO/PO**: CO1, CO2 / PO3, PO5  
**Objective**: Connect a React frontend (Vite) to a Node.js/Express backend powered by MongoDB (Mongoose) into a complete, working full-stack CRUD application with CORS support, state synchronization, optimistic UI updates, delete confirmation dialogs, and toast notifications.

---

## 🏗️ Architecture & Flow

```
React Frontend (http://localhost:5173)
       │
       │ fetch() calls via services/api.js
       ▼
Express Backend API (http://localhost:5000)
       │
       │ Mongoose ORM
       ▼
MongoDB Database (mongodb://127.0.0.1:27017/taskdb)
```

1. **User Action**: Create / Read / Update / Delete task in React UI.
2. **API Layer**: `services/api.js` dispatches HTTP requests (`GET`, `POST`, `PUT`, `DELETE`) with CORS headers.
3. **Backend Middleware**: Express processes CORS (`cors()`), parses JSON (`express.json()`), validates data, and interacts with MongoDB via Mongoose.
4. **State Sync & Feedback**: React updates component state and displays success/error toasts alongside delete confirmation modals.

---

## 📁 Repository Structure

```
pr6/
├── backend/                  # Node.js + Express + Mongoose API
│   ├── config/               # Database connection logic (db.js)
│   ├── controllers/          # CRUD route controllers (taskController.js)
│   ├── models/               # Mongoose schemas (Task.js)
│   ├── routes/               # Express router (taskRoutes.js)
│   ├── .env                  # Backend configuration (PORT=5000)
│   ├── package.json          # Dependencies (express, cors, mongoose, dotenv)
│   └── server.js             # Express entry point
├── frontend/                 # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/       # UI Components (TaskForm, TaskItem, TaskList, TaskFilter, ConfirmModal, ToastContainer, StatsHeader)
│   │   ├── context/          # Toast Notification Context (ToastContext.jsx)
│   │   ├── services/         # Central API Service (api.js - BASE_URL = http://localhost:5000)
│   │   ├── App.jsx           # Main Container Component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Dark-mode glassmorphism styling
│   ├── index.html            # HTML5 template
│   ├── vite.config.js        # Vite dev server configuration (Port 5173)
│   └── package.json          # Dependencies (lucide-react, react, vite)
└── README.md                 # Project documentation
```

---

## ⚡ Prerequisites

- **Node.js**: v18+ and npm installed
- **MongoDB**: Active MongoDB instance on `mongodb://127.0.0.1:27017/taskdb`

---

## 🚀 How to Run Locally

To run the application, you need to start both the **Express Backend** and **React Frontend** in separate terminal windows.

### Terminal 1: Start Backend Server (Port 5000)
```bash
cd backend
npm install
npm run dev   # or npm start
```
*Console output:* `Server running in development mode on port 5000` & `MongoDB Connected: 127.0.0.1`

### Terminal 2: Start React Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
*Console output:* `Vite server running at http://localhost:5173`

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ API Documentation

| Method | Endpoint | Description | Sample Request Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | Retrieve all tasks | N/A |
| `POST` | `/tasks` | Create a new task | `{ "title": "Buy groceries", "description": "Milk & eggs", "priority": "high" }` |
| `PUT` | `/tasks/:id` | Update task by ID | `{ "status": "completed" }` |
| `DELETE` | `/tasks/:id` | Delete task by ID | N/A |

---

## 🛡️ Key Features Implemented

1. **CORS Middleware**: Express backend uses `cors()` to allow origin `http://localhost:5173`.
2. **Centralized API Service**: Single `BASE_URL = 'http://localhost:5000'` constant in `frontend/src/services/api.js`.
3. **Delete Confirmation Dialog**: Custom accessible modal preventing accidental deletion.
4. **Toast Notifications**: Pop-up alerts for operation success/failure.
5. **Optimistic UI & Error Recovery**: Instant status toggle with rollback on network/server error.
6. **Persistence Verification**: Data remains intact across page refreshes.
