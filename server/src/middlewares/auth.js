function requireAuth(req, res, next) {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

module.exports = { requireAuth };
