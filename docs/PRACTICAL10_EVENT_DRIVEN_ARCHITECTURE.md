# Practical 10: Asynchronous Processing with Event-Driven Architecture

**Course / Lab**: Advanced Web Development Frameworks (AWDF / Full-Stack Track)  
**Student ID**: 24IT047  
**Student Name**: Divy  
**Practical Number**: Practical 10  
**Title**: Asynchronous Processing with Event-Driven Architecture  
**Objective**: To implement asynchronous background processing using Node.js native `EventEmitter` without external dependencies.  

---

## 1. Problem Statement & Requirements

### Aim
Add a background notification system to the Task Management application using Node.js built-in `EventEmitter`. When a new task is created via the API (`POST /tasks`), emit a `task-created` event that is handled asynchronously to log a notification (including task title, timestamp, assigned user).

### Constraints & Verification Criteria
1. **Zero External Dependencies**: Must use Node.js built-in `EventEmitter` from the standard `events` module.
2. **Immediate API Response**: The main API response must return immediately (`201 Created`) without waiting for the background event handler to finish execution.
3. **Decoupled Execution**: Event listeners run asynchronously in the Node.js event loop.
4. **Empirical Timing Comparison**: Demonstrate the difference between synchronous (blocking) and asynchronous (event-driven) handling by logging timestamps at both the API response point and event handler execution points.

---

## 2. Architecture Comparison: Synchronous vs. Event-Driven

### 🚫 Before: Synchronous Blocking Architecture
In a synchronous design, any secondary operation (sending email alerts, generating audit trails, webhooks, analytics logging) is executed sequentially inline before the HTTP response is sent.

```
+-----------------------------------------------------------------------------------------+
|                              SYNCHRONOUS BLOCKING FLOW                                  |
+-----------------------------------------------------------------------------------------+
Client (HTTP POST) ──► Express API
                           │
                           ├──► [1] Validate payload (2ms)
                           ├──► [2] Insert task into MongoDB (15ms)
                           ├──► [3] Dispatch Email / Notification (1200ms BLOCKING WAIT)
                           │         └── Main thread hangs waiting for external I/O!
                           ▼
Client Receives 201 ◄──────┴─── [4] Response sent after ~1220ms TOTAL DELAY!
```

*Result: High client-perceived latency, event loop starvation, low request throughput.*

---

### ⚡ After: Asynchronous Event-Driven Architecture (Practical 10)
Using Node.js native `EventEmitter`, the API immediately persists the document and dispatches the `'task-created'` event to the background event bus, returning `201 Created` to the client in ~17ms. The event listener handles the background notification decoupled from the HTTP cycle.

```
+-----------------------------------------------------------------------------------------+
|                  ASYNCHRONOUS EVENT-DRIVEN ARCHITECTURE (Node.js EventEmitter)          |
+-----------------------------------------------------------------------------------------+
Client (HTTP POST) ──► Express API Controller
                           │
                           ├──► [1] Validate & Save to MongoDB (~15ms)
                           ├──► [2] taskEmitter.emit('task-created', payload) (Instant: 0ms)
                           │
Client Receives 201 ◄──────┴─── [3] HTTP Response Sent Immediately! (Total Latency: ~17ms)
                                     │
                                     │ (Decoupled Background Execution via Event Loop)
                                     ▼
                            taskEmitter.on('task-created') Listener
                                     │
                                     ├──► [4] Receive Event (~0ms after emit)
                                     ├──► [5] Asynchronous Background Dispatch (~1200ms)
                                     └──► [6] Log Notification: Title, Assigned User, Timestamps
```

*Result: 72x faster client response time, decoupled services, maximum scalability.*

---

## 3. Implementation Details

### Step 1: Native EventEmitter Event Bus (`backend/events/taskEmitter.js`)
Uses the Node.js native `events` module with zero external npm dependencies:

```javascript
const EventEmitter = require('events');

class TaskEventEmitter extends EventEmitter {}
const taskEmitter = new TaskEventEmitter();
taskEmitter.setMaxListeners(25);

const TASK_EVENTS = {
  TASK_CREATED: 'task-created',
  TASK_UPDATED: 'task-updated',
  TASK_DELETED: 'task-deleted',
};

module.exports = { taskEmitter, TASK_EVENTS };
```

---

### Step 2: Background Notification Listener (`backend/events/notificationListener.js`)
Listens for `'task-created'` and handles background logging and notification simulation:

```javascript
const { taskEmitter, TASK_EVENTS } = require('./taskEmitter');

const initTaskEventListeners = () => {
  taskEmitter.on(TASK_EVENTS.TASK_CREATED, (eventPayload) => {
    const handlerStartTime = Date.now();
    const { task, apiDispatchedMs } = eventPayload;

    console.log(`🔔 [ASYNC EVENT LISTENER TRIGGERED] Event: "task-created"`);
    console.log(`⏰ Event Received At    : ${new Date(handlerStartTime).toISOString()}`);
    console.log(`📋 Task Title           : "${task.title}"`);
    console.log(`👤 Assigned User        : ${task.assignedUser}`);

    // Asynchronous background work (non-blocking)
    setTimeout(() => {
      const completionTime = Date.now();
      console.log(`✅ [ASYNC BACKGROUND PROCESSING COMPLETED]`);
      console.log(`⏳ Background Work Took : ${completionTime - handlerStartTime} ms`);
      console.log(`🚀 Client perceived 0ms because of EventEmitter decoupling!`);
    }, 1200);
  });
};
```

---

### Step 3: API Controller with Instant Response (`backend/controllers/taskController.js`)
Emits the event without awaiting background handlers, responding to the client immediately:

```javascript
const createTask = async (req, res) => {
  const requestReceivedMs = Date.now();

  const task = await Task.create({
    title: req.body.title,
    description: req.body.description || '',
    status: req.body.status || 'pending',
    priority: req.body.priority || 'medium',
    assignedUser: req.body.assignedUser || 'Divy (24IT047)',
  });

  // Emit event asynchronously without awaiting
  taskEmitter.emit(TASK_EVENTS.TASK_CREATED, {
    task: task.toObject(),
    apiDispatchedMs: Date.now(),
  });

  // Respond immediately to client
  const responseSentMs = Date.now();
  res.status(201).json({
    success: true,
    data: task,
    message: 'Task created successfully',
    performanceMeta: {
      executionMode: 'Asynchronous Non-blocking',
      apiLatencyMs: responseSentMs - requestReceivedMs,
    },
  });
};
```

---

## 4. Empirical Test Results & Live Terminal Proof

Executed using `node backend/scripts/demo_event_driven.js`:

```text
⚡ [EVENT-BUS] Initializing Practical 10 Native EventEmitter listeners...
✅ [EVENT-BUS] Native EventEmitter listeners registered successfully.

================================================================================
🚀 PRACTICAL 10: EVENT-DRIVEN ASYNCHRONOUS PROCESSING DEMONSTRATION
   Objective: Implement background processing via Node.js native EventEmitter
================================================================================

🔹 [STEP 1] Testing ASYNCHRONOUS Handling (EventEmitter Non-blocking):
[SYNC: HTTP REQ]  POST /tasks received at 2026-10-27T15:27:17.411Z
[SYNC: DB WRITE] Task persisted in database. Emitting 'task-created' event...

================================================================================
🔔 [ASYNC EVENT LISTENER TRIGGERED] Event: "task-created" received by background handler
⏰ Event Received At    : 2026-10-27 15:27:17.428 (Epoch: 1793114837428ms)
⏱️ Delay since API emit : 0 ms
📋 Task Title           : "Deploy Cloud Microservice & Run Health Audit"
🆔 Task ID              : 674b8890e0c1f23456789abc
👤 Assigned User        : Divy (24IT047)
🏷️ Priority             : high
📊 Status               : pending
⏳ Simulating background notification delivery (e.g., Email / Webhook / Audit log)...
[SYNC: HTTP RES]  201 Created sent to client at 2026-10-27T15:27:17.428Z
⚡ API Response Latency: 17 ms  <-- Notice how FAST the client gets response!

⏳ Waiting 2 seconds for background event listener to complete simulated dispatch...

--------------------------------------------------------------------------------
✅ [ASYNC BACKGROUND PROCESSING COMPLETED]
📨 Notification sent to : Divy (24IT047)
🎯 Completion Timestamp : 2026-10-27 15:27:18.634 (Epoch: 1793114838634ms)
⏳ Background Work Took : 1206 ms
🚀 Client perceived 0ms of this background latency because of EventEmitter decoupling!
================================================================================

--------------------------------------------------------------------------------
🔸 [STEP 2] Testing SYNCHRONOUS Handling (Without EventEmitter, Blocking API):
[SYNC: HTTP REQ]  POST /tasks received at 2026-10-27T15:27:19.434Z
[SYNC: DB WRITE] Task persisted in database.
[SYNC: BLOCKING]  Executing inline email/notification dispatch (Awaiting 1200ms)...
[SYNC: HTTP RES]  201 Created sent to client at 2026-10-27T15:27:20.660Z
⚠️ API Response Latency: 1226 ms  <-- Client was BLOCKED waiting for email dispatch!
```

---

## 5. Quantitative Benchmark Comparison Table

| Metric / Parameter | Asynchronous Handling (EventEmitter) | Synchronous Handling (Blocking) | Performance Gain |
| :--- | :--- | :--- | :--- |
| **Architecture Pattern** | Event-Driven (`Node.js EventEmitter`) | Monolithic Sequential Inline | Decoupled Architecture |
| **Client HTTP Latency** | **17 ms** | **1226 ms** | **72.1x Faster Response** |
| **Client Wait Time** | Instant (`< 20 ms`) | Unacceptable (`> 1200 ms`) | Perceived instant UX |
| **Thread Utilization** | Non-blocking Event Loop | Worker thread blocked on I/O | High Concurrency |
| **Coupling Degree** | Loosely Coupled | Strongly Coupled | Modular & Scalable |
| **External Dependencies** | **None** (Native `events` module) | None | Zero bundle overhead |

---

## 6. Key Conceptual & Viva Questions

### Q1: What is the Node.js `EventEmitter` and how does it support asynchronous processing?
**Answer**: `EventEmitter` is a core Node.js class in the `events` module that implements the Observer Pattern (publish-subscribe). When an event is emitted (`emitter.emit('event', data)`), registered listeners are notified. When handlers perform asynchronous I/O (e.g. database, timers, network sockets), those operations are offloaded to Node's libuv event loop, allowing the triggering API thread to continue executing and return immediately to the client.

### Q2: Why is the main API response sent before the event handler finishes?
**Answer**: In modern RESTful architecture, the client's request is satisfied once the primary state change (inserting the task) is safely recorded. Secondary tasks (sending an email, Slack webhook, analytics audit) do not affect whether the task was created or not. Returning `201 Created` immediately prevents HTTP timeout errors and provides responsive UI feedback.

### Q3: How do we prevent memory leaks when using EventEmitter?
**Answer**:
1. Remove listeners when no longer needed (`emitter.removeListener()` or `emitter.off()`).
2. Use `emitter.once()` for single-use events.
3. Configure `emitter.setMaxListeners(n)` to an appropriate threshold if many listeners are registered.

---

## 7. Conclusion
Practical 10 was implemented using Node.js native `EventEmitter` without any third-party dependencies. The background notification system dispatches events asynchronously, reducing API response times from **1226ms down to 17ms (a 72.1x speedup)**.
