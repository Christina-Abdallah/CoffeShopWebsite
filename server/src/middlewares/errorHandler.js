function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err);

  if (err.code === "P2002") {
    return res.status(409).json({ error: "Conflit : cette entrée existe déjà." });
  }

  const status = err.status || 500;
  const message = status === 500 ? "Erreur interne du serveur." : err.message;

  res.status(status).json({ error: message });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route non trouvée : ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFoundHandler };