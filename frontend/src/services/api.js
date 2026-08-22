// Practical 6: Central API Layer
const BASE_URL = 'http://localhost:5000';

/**
 * Generic helper for handling fetch requests with error handling
 */
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error! Status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
};

// GET /tasks - Fetch all tasks
export const getTasks = () => request('/tasks');

// POST /tasks - Create a new task
export const createTask = (taskData) =>
  request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });

// PUT /tasks/:id - Update an existing task
export const updateTask = (id, taskData) =>
  request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });

// DELETE /tasks/:id - Delete a task by ID
export const deleteTask = (id) =>
  request(`/tasks/${id}`, {
    method: 'DELETE',
  });
