const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const { initTaskEventListeners } = require('./events/notificationListener');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Practical 10: Initialize native EventEmitter background listeners
initTaskEventListeners();

const app = express();

// Middleware 1: Enabling CORS for cross-origin requests from React dev server
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:80',
    'http://localhost',
  ],
  credentials: true
}));

// Middleware 2: JSON Body Parser
app.use(express.json());

// API Health / Root route
app.get('/', (req, res) => {
  res.json({
    message: 'TaskPulse Fullstack API is running',
    version: '2.0.0',
    stack: ['React 18 + Vite (Frontend)', 'Express + Node.js (Backend)', 'MongoDB (Database)', 'Docker + Docker Compose (Containerization)'],
    endpoints: {
      getTasks: 'GET /tasks',
      createTask: 'POST /tasks (POST /tasks',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id',
      getNotificationLogs: 'GET /tasks/notifications/logs',
      compareSyncVsAsync: 'POST /tasks/benchmark/compare'
    }
  });
});

// Routes
app.use('/tasks', taskRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`⚡ Practical 10 Event-Driven Notification Engine is active!`);
});

