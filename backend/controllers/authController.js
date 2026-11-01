const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'taskpulse_secret_key_it_engineer_2026';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

// Helper: Generate JWT token
const sendTokenResponse = (user, statusCode, res, message = 'Authentication successful') => {
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role || 'IT Engineer',
    bio: user.bio,
    createdAt: user.createdAt,
  };

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: userData,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Conflict',
        message: 'An account with this email address already exists',
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'IT Engineer',
      bio: bio || 'Passionate IT Engineer building robust, scalable web architectures and containerized applications.',
    });

    sendTokenResponse(user, 201, res, 'Account registered successfully');
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Registration Error',
      message: error.message,
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Please provide an email and password',
      });
    }

    // Find user by email with password included
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Error',
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Error',
        message: 'Invalid email or password',
      });
    }

    sendTokenResponse(user, 200, res, `Welcome back, ${user.name}!`);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login Error',
      message: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private (Bearer token)
const getMe = async (req, res) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'No authorization token provided',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User no longer exists',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or expired session token',
    });
  }
};

// @desc    Quick Demo Login as Divy Mangukiya (IT Engineer)
// @route   POST /api/auth/demo
// @access  Public
const demoLogin = async (req, res) => {
  try {
    const demoEmail = 'divy.mangukiya@it.engineer';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      user = await User.create({
        name: 'Divy Mangukiya (24IT047)',
        email: demoEmail,
        password: 'password123',
        role: 'IT Engineer & Full-Stack Architect',
        bio: 'Passionate Information Technology Engineer with deep expertise in modern web architectures, cloud containerization (Docker), event-driven microservices, CI/CD automation, and intelligent AI-augmented applications.',
      });
    }

    sendTokenResponse(user, 200, res, 'Logged in as Divy Mangukiya (IT Engineer Demo Profile)');
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Demo Login Error',
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  demoLogin,
};
