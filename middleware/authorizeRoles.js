// middlewares/authorizeRoles.js
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not allowed to access this resource",
      });
    }
    next();
  };
};

export const authorizeVendor = (req, res, next) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Only vendors allowed" });
  }
  next();
};
