require("dotenv").config();
const express = require("express");
const cors = require("cors");

const reservationsRoutes = require("./src/routes/reservations.routes");
const contactRoutes = require("./src/routes/contact.routes");

const {
  errorHandler,
  notFoundHandler,
} = require("./src/middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Reservations API
app.use("/api/reservations", reservationsRoutes);

// Contact API
app.use("/api/contact", contactRoutes);

// Error handlers must stay at the end
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `✅ Brew & Co. server running on http://localhost:${PORT}`
  );
});
