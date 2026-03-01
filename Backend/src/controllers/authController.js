const User = require('../models/user');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

// ====================== ZOD VALIDATION SCHEMAS ======================

const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(50),
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const loginSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required')
});

// ====================== GENERATE JWT TOKEN ======================
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// ====================== REGISTER USER ======================
const register = asyncHandler(async (req, res, next) => {
  // Validate input using Zod
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    const errorMessages = result.error.errors
      .map(err => err.message)
      .join(', ');
    throw new AppError(errorMessages || 'Validation failed', 400);
  }

  const { name, email, password } = result.data;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Create user - role is forced to USER (secure)
  const user = await User.create({
    name,
    email,
    password,
    role: 'USER'  // Force USER role for security
  });

  // Generate JWT token
  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    }
  });
});

// ====================== LOGIN USER ======================
const login = asyncHandler(async (req, res, next) => {
  // Validate input using Zod
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    const errorMessages = result.error.errors
      .map(err => err.message)
      .join(', ');
    throw new AppError(errorMessages || 'Validation failed', 400);
  }

  const { email, password } = result.data;

  // Find user and explicitly select password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate JWT token
  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    }
  });
});


module.exports = {
  register,
  login
};
