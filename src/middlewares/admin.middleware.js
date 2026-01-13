const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      const error = new Error("Forbidden: Admin access only");
      error.statusCode = 403;
      throw error;
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = adminMiddleware;
