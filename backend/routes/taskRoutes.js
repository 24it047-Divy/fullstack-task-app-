const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskNotificationLogs,
  clearTaskNotificationLogs,
  compareSyncVsAsync,
  getCacheStatsEndpoint,
  clearCacheEndpoint,
  compareCachePerformance,
} = require('../controllers/taskController');

// Practical 9 routes: In-Memory Caching (node-cache) metrics & benchmark
router.route('/cache/stats')
  .get(getCacheStatsEndpoint);

router.route('/cache/clear')
  .post(clearCacheEndpoint);

router.route('/cache/benchmark')
  .get(compareCachePerformance);

// Practical 10 routes: Notification logs & Synchronous vs Asynchronous Demonstration
router.route('/notifications/logs')
  .get(getTaskNotificationLogs)
  .delete(clearTaskNotificationLogs);

router.route('/benchmark/compare')
  .post(compareSyncVsAsync);

// Standard Task CRUD routes
router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
