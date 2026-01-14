const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const err = new Error("Forbidden");
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
};

module.exports = requireRole;