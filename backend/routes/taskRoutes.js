const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskNotificationLogs,
  clearTaskNotificationLogs,
  compareSyncVsAsync,
} = require('../controllers/taskController');

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
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
