const EventEmitter = require('events');

/**
 * Practical 10: Event-Driven Architecture with Native EventEmitter
 * 
 * Objective: To implement asynchronous background processing using Node.js
 * native EventEmitter without any external dependencies.
 */
class TaskEventEmitter extends EventEmitter {}

// Instantiate singleton task event bus
const taskEmitter = new TaskEventEmitter();

// Configure maximum listeners to avoid memory leak warnings in dev
taskEmitter.setMaxListeners(25);

// Standard event constants
const TASK_EVENTS = {
  TASK_CREATED: 'task-created',
  TASK_UPDATED: 'task-updated',
  TASK_DELETED: 'task-deleted',
};

module.exports = {
  taskEmitter,
  TASK_EVENTS,
};
