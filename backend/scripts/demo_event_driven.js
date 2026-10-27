/**
 * Practical 10: Asynchronous Processing with Event-Driven Architecture
 * 
 * Demonstration Script: Node.js Native EventEmitter vs Synchronous Execution
 * Author: Divy (24IT047)
 * Course: Advanced Web Development Frameworks (AWDF)
 */

const { taskEmitter, TASK_EVENTS } = require('../events/taskEmitter');
const {
  initTaskEventListeners,
  simulateSyncNotification,
} = require('../events/notificationListener');

// Initialize event listeners
initTaskEventListeners();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runDemonstration() {
  console.log('\n================================================================================');
  console.log('🚀 PRACTICAL 10: EVENT-DRIVEN ASYNCHRONOUS PROCESSING DEMONSTRATION');
  console.log('   Objective: Implement background processing via Node.js native EventEmitter');
  console.log('================================================================================\n');

  const sampleTask = {
    _id: '674b8890e0c1f23456789abc',
    title: 'Deploy Cloud Microservice & Run Health Audit',
    description: 'Ensure container cluster auto-scaling is healthy and alert admin',
    priority: 'high',
    status: 'pending',
    assignedUser: 'Divy (24IT047)',
    dueDate: '2026-11-05',
  };

  // -------------------------------------------------------------------------
  // Part 1: Asynchronous Handling with EventEmitter
  // -------------------------------------------------------------------------
  console.log('🔹 [STEP 1] Testing ASYNCHRONOUS Handling (EventEmitter Non-blocking):');
  const t0_request = Date.now();
  console.log(`[SYNC: HTTP REQ]  POST /tasks received at ${new Date(t0_request).toISOString()}`);

  // Simulating DB save (instant)
  await sleep(15);
  console.log(`[SYNC: DB WRITE] Task persisted in database. Emitting 'task-created' event...`);

  const t_emit = Date.now();
  // Native EventEmitter non-blocking emit
  taskEmitter.emit(TASK_EVENTS.TASK_CREATED, {
    task: sampleTask,
    apiDispatchedAt: new Date(t_emit).toISOString(),
    apiDispatchedMs: t_emit,
  });

  // API returns immediately!
  const t_apiResponse = Date.now();
  const asyncApiLatency = t_apiResponse - t0_request;
  console.log(`[SYNC: HTTP RES]  201 Created sent to client at ${new Date(t_apiResponse).toISOString()}`);
  console.log(`⚡ API Response Latency: ${asyncApiLatency} ms  <-- Notice how FAST the client gets response!`);

  console.log('\n⏳ Waiting 2 seconds for background event listener to complete simulated dispatch...\n');
  await sleep(2000);

  // -------------------------------------------------------------------------
  // Part 2: Synchronous Handling Simulation (Blocking)
  // -------------------------------------------------------------------------
  console.log('--------------------------------------------------------------------------------');
  console.log('🔸 [STEP 2] Testing SYNCHRONOUS Handling (Without EventEmitter, Blocking API):');
  const t0_sync = Date.now();
  console.log(`[SYNC: HTTP REQ]  POST /tasks received at ${new Date(t0_sync).toISOString()}`);

  await sleep(15);
  console.log(`[SYNC: DB WRITE] Task persisted in database.`);
  console.log(`[SYNC: BLOCKING]  Executing inline email/notification dispatch (Awaiting 1200ms)...`);
  
  // Synchronously awaiting notification
  await simulateSyncNotification(sampleTask, 1200);

  const t_syncResponse = Date.now();
  const syncApiLatency = t_syncResponse - t0_sync;
  console.log(`[SYNC: HTTP RES]  201 Created sent to client at ${new Date(t_syncResponse).toISOString()}`);
  console.log(`⚠️ API Response Latency: ${syncApiLatency} ms  <-- Client was BLOCKED waiting for email dispatch!`);

  // -------------------------------------------------------------------------
  // Part 3: Comparison & Summary
  // -------------------------------------------------------------------------
  console.log('\n================================================================================');
  console.log('📊 PERFORMANCE & ARCHITECTURE COMPARISON TABLE');
  console.log('================================================================================');
  console.table([
    {
      Metric: 'Architecture Pattern',
      'Asynchronous (EventEmitter)': 'Event-Driven (Native EventEmitter)',
      'Synchronous (Blocking)': 'Monolithic Inline Execution',
    },
    {
      Metric: 'Client HTTP Latency',
      'Asynchronous (EventEmitter)': `${asyncApiLatency} ms`,
      'Synchronous (Blocking)': `${syncApiLatency} ms`,
    },
    {
      Metric: 'Client Wait Time',
      'Asynchronous (EventEmitter)': 'Instant (~15ms)',
      'Synchronous (Blocking)': 'Delayed (~1215ms)',
    },
    {
      Metric: 'Coupling',
      'Asynchronous (EventEmitter)': 'Loose (Decoupled background worker)',
      'Synchronous (Blocking)': 'Tight (API hangs on notification)',
    },
    {
      Metric: 'External Dependency',
      'Asynchronous (EventEmitter)': 'None (Node.js built-in "events")',
      'Synchronous (Blocking)': 'None',
    },
    {
      Metric: 'Throughput Under Load',
      'Asynchronous (EventEmitter)': 'High (Non-blocking I/O loop)',
      'Synchronous (Blocking)': 'Low (Worker threads/event loop starved)',
    },
  ]);

  console.log(`\n🏆 EventEmitter achieved a ${(syncApiLatency / asyncApiLatency).toFixed(1)}x speedup for client response time!`);
  console.log('Practical 10 Demonstration Completed Successfully.\n');
  process.exit(0);
}

runDemonstration().catch(console.error);
