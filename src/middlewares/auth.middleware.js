// src/middlewares/auth.middleware.js

const { verifyToken } = require("../utils/jwt");

/**
 * Authentication middleware
 * Verifies JWT and attaches user info to req.user
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Authorization token missing");
      error.statusCode = 401;
      throw error;
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    next(); // move to next middleware / controller
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};

module.exports = authMiddleware;
