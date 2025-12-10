
// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');

// Guard 1: Check karta hai ki user logged-in hai ya nahi
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Header se 'Bearer TOKEN' ko nikalo
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token ko header se nikalo (Bearer ko hata kar)
      token = req.headers.authorization.split(' ')[1];

      // Token ko verify karo
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Token se user ki ID nikaal kar, user ka data DB se fetch karo (bina password ke)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }

      next(); // Sab sahi hai, agle step par jao
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Guard 2: Check karta hai ki user 'host' hai ya nahi
const host = (req, res, next) => {
  if (req.user && req.user.role === 'host') {
    next(); // Haan, user host hai, aage jao
  } else {
    res.status(401); // 401 matlab Unauthorized
    throw new Error('Not authorized as a host');
  }
};

module.exports = { protect, host };