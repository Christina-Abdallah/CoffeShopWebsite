function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err);

  if (err.code === "P2002") {
    return res.status(409).json({ error: "Conflict: this entry already exists." });
  }

  const status = err.status || 500;
  const message = status === 500 ? "Internal server error." : err.message;

  res.status(status).json({ error: message });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFoundHandler };