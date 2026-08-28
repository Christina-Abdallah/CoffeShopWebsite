const express = require("express");
const { validate } = require("../middlewares/validate");
const {
  reservationSchema,
  reservationUpdateSchema,
  createReservation,
  listReservations,
  checkAvailability,
  getReservationById,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservations.controller");

// ---------------------------------------------------------------------------
// Public router — accessible without authentication.
// Only the two operations that customers need from the front-end form:
//   POST   /api/reservations          — submit a booking
//   GET    /api/reservations/availability — check available time slots
// ---------------------------------------------------------------------------
const publicReservationsRouter = express.Router();

// POST /api/reservations
publicReservationsRouter.post(
  "/",
  validate(reservationSchema),
  createReservation
);

// GET /api/reservations/availability
publicReservationsRouter.get("/availability", checkAvailability);

// ---------------------------------------------------------------------------
// Admin router — mounted under /api/admin/reservations in server.js,
// where csrfProtection + requireAuth are applied at the mount point.
// ---------------------------------------------------------------------------
const adminReservationsRouter = express.Router();

// GET /api/admin/reservations
adminReservationsRouter.get("/", listReservations);

// GET /api/admin/reservations/:id
adminReservationsRouter.get("/:id", getReservationById);

// PATCH /api/admin/reservations/:id
adminReservationsRouter.patch(
  "/:id",
  validate(reservationUpdateSchema),
  updateReservation
);

// DELETE /api/admin/reservations/:id
adminReservationsRouter.delete("/:id", deleteReservation);

module.exports = { publicReservationsRouter, adminReservationsRouter };