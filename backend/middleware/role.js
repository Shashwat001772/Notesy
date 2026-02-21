const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user comes from the auth middleware
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        msg: `Access denied. Role '${req.user.role}' is not authorized.` 
      });
    }
    next();
  };
};

module.exports = authorizeRoles;