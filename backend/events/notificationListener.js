const { taskEmitter, TASK_EVENTS } = require('./taskEmitter');

// In-memory notification log buffer for DevTools / UI verification
const notificationLogs = [];
const MAX_LOG_HISTORY = 50;

/**
 * Formats a high-precision ISO + milliseconds timestamp string
 */
const getFormattedTimestamp = (date = new Date()) => {
  return `${date.toISOString().replace('T', ' ').replace('Z', '')} (Epoch: ${date.getTime()}ms)`;
};

/**
 * Helper to record and trim notification logs
 */
const pushLog = (logEntry) => {
  notificationLogs.unshift(logEntry);
  if (notificationLogs.length > MAX_LOG_HISTORY) {
    notificationLogs.pop();
  }
};

/**
 * Initializes listeners for Task events using native Node.js EventEmitter.
 * Handlers use asynchronous non-blocking event loop execution.
 */
const initTaskEventListeners = () => {
  console.log('⚡ [EVENT-BUS] Initializing Practical 10 Native EventEmitter listeners...');

  // Event Listener for 'task-created'
  taskEmitter.on(TASK_EVENTS.TASK_CREATED, (eventPayload) => {
    const handlerStartTime = Date.now();
    const handlerStartDate = new Date(handlerStartTime);
    const { task, apiDispatchedAt, apiDispatchedMs } = eventPayload;

    console.log('\n================================================================================');
    console.log('🔔 [ASYNC EVENT LISTENER TRIGGERED] Event: "task-created" received by background handler');
    console.log(`⏰ Event Received At    : ${getFormattedTimestamp(handlerStartDate)}`);
    console.log(`⏱️ Delay since API emit : ${handlerStartTime - (apiDispatchedMs || handlerStartTime)} ms`);
    console.log(`📋 Task Title           : "${task.title}"`);
    console.log(`🆔 Task ID              : ${task._id || 'N/A'}`);
    console.log(`👤 Assigned User        : ${task.assignedUser || 'Divy (24IT047)'}`);
    console.log(`🏷️ Priority             : ${task.priority || 'medium'}`);
    console.log(`📊 Status               : ${task.status || 'pending'}`);
    console.log('⏳ Simulating background notification delivery (e.g., Email / Webhook / Audit log)...');

    // Simulate asynchronous non-blocking background I/O (e.g., sending email or dispatching webhook)
    // The main API has ALREADY responded to the client!
    setTimeout(() => {
      const completionTime = Date.now();
      const completionDate = new Date(completionTime);
      const totalAsyncDuration = completionTime - handlerStartTime;
      const totalSinceApiDispatch = completionTime - (apiDispatchedMs || handlerStartTime);

      const logRecord = {
        id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        eventType: TASK_EVENTS.TASK_CREATED,
        taskId: task._id,
        taskTitle: task.title,
        assignedUser: task.assignedUser || 'Divy (24IT047)',
        status: task.status,
        priority: task.priority,
        apiDispatchedAt: apiDispatchedAt || new Date(apiDispatchedMs).toISOString(),
        handlerStartedAt: handlerStartDate.toISOString(),
        completedAt: completionDate.toISOString(),
        executionMode: 'Asynchronous (EventEmitter Non-blocking)',
        asyncProcessingDurationMs: totalAsyncDuration,
        totalTimeAfterApiResponseMs: totalSinceApiDispatch,
        notificationMessage: `Background notification dispatched successfully for "${task.title}". Email sent to assigned user: ${task.assignedUser || 'Divy (24IT047)'}`,
      };

      pushLog(logRecord);

      console.log('--------------------------------------------------------------------------------');
      console.log('✅ [ASYNC BACKGROUND PROCESSING COMPLETED]');
      console.log(`📨 Notification sent to : ${logRecord.assignedUser}`);
      console.log(`🎯 Completion Timestamp : ${getFormattedTimestamp(completionDate)}`);
      console.log(`⏳ Background Work Took : ${totalAsyncDuration} ms`);
      console.log(`🚀 Client perceived 0ms of this background latency because of EventEmitter decoupling!`);
      console.log('================================================================================\n');
    }, 1200); // 1.2 second simulated external dispatch delay
  });

  // Optional: Listeners for update and delete to provide complete lifecycle coverage
  taskEmitter.on(TASK_EVENTS.TASK_UPDATED, (eventPayload) => {
    const { task } = eventPayload;
    console.log(`[EVENT-BUS] Task updated: "${task.title}" (Status: ${task.status})`);
  });

  taskEmitter.on(TASK_EVENTS.TASK_DELETED, (eventPayload) => {
    const { taskId, title } = eventPayload;
    console.log(`[EVENT-BUS] Task deleted: ID ${taskId} ("${title}")`);
  });

  console.log('✅ [EVENT-BUS] Native EventEmitter listeners registered successfully.');
};

/**
 * Returns current notification log history for DevTools and UI display
 */
const getNotificationLogs = () => {
  return [...notificationLogs];
};

/**
 * Clear notification log buffer
 */
const clearNotificationLogs = () => {
  notificationLogs.length = 0;
};

/**
 * Synchronous Simulation Helper:
 * Deliberately blocks execution for `delayMs` to demonstrate what happens
 * WITHOUT EventEmitter (synchronous blocking notification).
 */
const simulateSyncNotification = (task, delayMs = 1200) => {
  const start = Date.now();
  // Synchronous busy-wait / awaitable blocking simulation
  return new Promise((resolve) => {
    setTimeout(() => {
      const end = Date.now();
      resolve({
        mode: 'Synchronous (Blocking)',
        taskTitle: task.title,
        assignedUser: task.assignedUser || 'Divy (24IT047)',
        blockingDurationMs: end - start,
        completedAt: new Date().toISOString(),
      });
    }, delayMs);
  });
};

module.exports = {
  initTaskEventListeners,
  getNotificationLogs,
  clearNotificationLogs,
  simulateSyncNotification,
};
