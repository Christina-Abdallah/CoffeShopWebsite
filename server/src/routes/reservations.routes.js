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

const router = express.Router();

// POST /api/reservations
router.post(
  "/",
  validate(reservationSchema),
  createReservation
);

// GET /api/reservations
router.get("/", listReservations);

// GET /api/reservations/availability
// Must be defined BEFORE /:id so Express matches it first.
router.get("/availability", checkAvailability);

// GET /api/reservations/:id
router.get("/:id", getReservationById);

// PATCH /api/reservations/:id
router.patch(
  "/:id",
  validate(reservationUpdateSchema),
  updateReservation
);

// DELETE /api/reservations/:id
router.delete("/:id", deleteReservation);

module.exports = router;