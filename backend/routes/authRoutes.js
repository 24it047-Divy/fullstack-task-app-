const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  demoLogin,
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getMe);
router.post('/demo', demoLogin);

module.exports = router;

