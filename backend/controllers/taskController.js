const Task = require('../models/Task');

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

// @desc    Create a new task
// @route   POST /tasks
// @access  Public
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Task title is required',
      });
    }

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
    });

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully',
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

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
