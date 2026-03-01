const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const User = require('../models/user');

// ====================== PROTECT ROUTES (JWT VERIFICATION) ======================
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token found
  if (!token) {
    throw new AppError(
      'You are not logged in. Please login to access this route',
      401
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError(
        'The user belonging to this token no longer exists',
        401
      );
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token. Please login again', 401);
    }
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Your token has expired. Please login again', 401);
    }
    throw error;
  }
});

// ====================== RESTRICT TO SPECIFIC ROLES ======================
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array like ['ADMIN', 'USER']
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }
    next();
  };
};
