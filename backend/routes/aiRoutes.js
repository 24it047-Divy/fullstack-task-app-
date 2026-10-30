const express = require('express');
const router = express.Router();
const { generateTaskDescription } = require('../controllers/aiController');

// Practical 13: AI-powered task description generation with graceful degradation
router.post('/generate-description', generateTaskDescription);

module.exports = router;
