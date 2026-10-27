const Task = require('../models/Task');
const { taskEmitter, TASK_EVENTS } = require('../events/taskEmitter');
const {
  getNotificationLogs,
  clearNotificationLogs,
  simulateSyncNotification,
} = require('../events/notificationListener');

// @desc    Get all tasks
// @route   GET /tasks
// @access  Public
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch tasks',
      message: error.message,
    });
  }
};

// @desc    Create a new task with Practical 10 Asynchronous EventEmitter Notification
// @route   POST /tasks
// @access  Public
const createTask = async (req, res) => {
  const requestReceivedMs = Date.now();
  const requestReceivedIso = new Date(requestReceivedMs).toISOString();

  try {
    const { title, description, status, priority, dueDate, assignedUser } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Task title is required',
      });
    }

    // 1. Synchronously persist task to Database
    const task = await Task.create({
      title: title.trim(),
      description: description || '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      assignedUser: assignedUser || 'Divy (24IT047)',
    });

    // 2. Practical 10 Requirement: Asynchronously emit 'task-created' event via native EventEmitter
    // Note: We emit the event without waiting (no await) so background notification handling
    // runs decoupled in the Node.js event loop without blocking the HTTP response cycle!
    const emitEventMs = Date.now();
    taskEmitter.emit(TASK_EVENTS.TASK_CREATED, {
      task: task.toObject(),
      apiDispatchedAt: new Date(emitEventMs).toISOString(),
      apiDispatchedMs: emitEventMs,
    });

    // 3. Main API response returns IMMEDIATELY without waiting for background event processing
    const responseSentMs = Date.now();
    const responseDurationMs = responseSentMs - requestReceivedMs;

    console.log(`\n🚀 [SYNC - MAIN API RESPONSE SENT]`);
    console.log(`   Task Title       : "${task.title}"`);
    console.log(`   Request Received : ${requestReceivedIso}`);
    console.log(`   Response Sent    : ${new Date(responseSentMs).toISOString()}`);
    console.log(`   API Latency      : ${responseDurationMs} ms (Client response NOT blocked by event handlers!)\n`);

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully (Background notification event emitted asynchronously)',
      performanceMeta: {
        architecture: 'Event-Driven (Node.js Native EventEmitter)',
        executionMode: 'Asynchronous Non-blocking',
        requestReceivedAt: requestReceivedIso,
        responseSentAt: new Date(responseSentMs).toISOString(),
        apiLatencyMs: responseDurationMs,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to create task',
      message: error.message,
    });
  }
};

// @desc    Update a task
// @route   PUT /tasks/:id
// @access  Public
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    let task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Task with id ${id} not found`,
      });
    }

    task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // Emit task-updated event
    taskEmitter.emit(TASK_EVENTS.TASK_UPDATED, { task: task.toObject() });

    res.status(200).json({
      success: true,
      data: task,
      message: 'Task updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to update task',
      message: error.message,
    });
  }
};

// @desc    Delete a task
// @route   DELETE /tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Task with id ${id} not found`,
      });
    }

    await task.deleteOne();

    // Emit task-deleted event
    taskEmitter.emit(TASK_EVENTS.TASK_DELETED, {
      taskId: id,
      title: task.title,
    });

    res.status(200).json({
      success: true,
      data: {},
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete task',
      message: error.message,
    });
  }
};

// @desc    Get live background notification logs (Practical 10)
// @route   GET /tasks/notifications/logs
// @access  Public
const getTaskNotificationLogs = (req, res) => {
  const logs = getNotificationLogs();
  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs,
  });
};

// @desc    Clear background notification logs
// @route   DELETE /tasks/notifications/logs
// @access  Public
const clearTaskNotificationLogs = (req, res) => {
  clearNotificationLogs();
  res.status(200).json({
    success: true,
    message: 'Notification logs cleared',
  });
};

// @desc    Practical 10 Demonstration: Side-by-side comparison of Synchronous vs Asynchronous handling
// @route   POST /tasks/benchmark/compare
// @access  Public
const compareSyncVsAsync = async (req, res) => {
  const testTitle = req.body.title || 'Practical 10 Demonstration Task';
  const assignedUser = req.body.assignedUser || 'Divy (24IT047)';

  // 1. Measure Asynchronous Flow (Native EventEmitter)
  const asyncStart = Date.now();
  const asyncTask = {
    title: `${testTitle} [EventEmitter Async]`,
    assignedUser,
    priority: 'high',
    status: 'pending',
  };
  // Emit event without blocking
  taskEmitter.emit(TASK_EVENTS.TASK_CREATED, {
    task: asyncTask,
    apiDispatchedAt: new Date(asyncStart).toISOString(),
    apiDispatchedMs: asyncStart,
  });
  const asyncApiResponseEnd = Date.now();
  const asyncApiDuration = asyncApiResponseEnd - asyncStart;

  // 2. Measure Synchronous Flow (Simulated blocking notification where API awaits completion)
  const syncStart = Date.now();
  const syncTask = {
    title: `${testTitle} [Synchronous Blocking]`,
    assignedUser,
    priority: 'high',
    status: 'pending',
  };
  const syncResult = await simulateSyncNotification(syncTask, 1200);
  const syncApiResponseEnd = Date.now();
  const syncApiDuration = syncApiResponseEnd - syncStart;

  res.status(200).json({
    success: true,
    message: 'Practical 10 Synchronous vs Asynchronous Handling Comparison',
    demonstration: {
      asynchronousEventEmitter: {
        pattern: 'Native Node.js EventEmitter (Non-blocking background handler)',
        apiResponseTimeMs: asyncApiDuration,
        clientPerceivedLatency: `${asyncApiDuration} ms (Immediate response)`,
        backgroundProcessingDeferred: true,
        backgroundJobDurationMs: 1200,
        responseTimestamp: new Date(asyncApiResponseEnd).toISOString(),
        advantage: 'Main thread HTTP response is returned immediately; background jobs process independently without blocking the client.',
      },
      synchronousBlocking: {
        pattern: 'Synchronous Handling (Direct inline await/execution)',
        apiResponseTimeMs: syncApiDuration,
        clientPerceivedLatency: `${syncApiDuration} ms (Heavy delay)`,
        backgroundProcessingDeferred: false,
        responseTimestamp: new Date(syncApiResponseEnd).toISOString(),
        disadvantage: 'Client is forced to hang and wait until email/notification dispatch completes.',
      },
      performanceImprovementMultiplier: `${(syncApiDuration / Math.max(asyncApiDuration, 1)).toFixed(1)}x faster API response with EventEmitter!`,
    },
  });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskNotificationLogs,
  clearTaskNotificationLogs,
  compareSyncVsAsync,
};
