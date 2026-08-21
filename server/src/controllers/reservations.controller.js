const { z } = require("zod");
const prisma = require("../db/prisma");

const OPEN_HOUR = 7;
const CLOSE_HOUR = 21;

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

// ==========================================
// CREATE RESERVATION VALIDATION
// ==========================================

const reservationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name."),

  date: z
    .string()
    .min(1, "Please choose a date.")
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "Invalid date."
    )
    .refine(
      (val) => val >= todayISO(),
      "Date can't be in the past."
    ),

  time: z
    .string()
    .min(1, "Please choose a time.")
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Invalid time format."
    )
    .refine((val) => {
      const hour = Number(val.split(":")[0]);
      return hour >= OPEN_HOUR && hour < CLOSE_HOUR;
    }, `We're open ${OPEN_HOUR}:00 AM–${CLOSE_HOUR - 12}:00 PM. Pick a time in range.`),

  guests: z.coerce
    .number()
    .int()
    .min(1, "At least 1 guest is required.")
    .max(12, "For groups over 12, please call us directly."),
});

// ==========================================
// UPDATE RESERVATION VALIDATION
// ==========================================

const reservationUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .optional(),

  date: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "Invalid date."
    )
    .refine(
      (val) => val >= todayISO(),
      "Date can't be in the past."
    )
    .optional(),

  time: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Invalid time format."
    )
    .refine((val) => {
      const hour = Number(val.split(":")[0]);
      return hour >= OPEN_HOUR && hour < CLOSE_HOUR;
    }, `We're open ${OPEN_HOUR}:00 AM–${CLOSE_HOUR - 12}:00 PM. Pick a time in range.`)
    .optional(),

  guests: z.coerce
    .number()
    .int()
    .min(1, "At least 1 guest is required.")
    .max(12, "For groups over 12, please call us directly.")
    .optional(),

  status: z
    .enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"])
    .optional(),
});

// ==========================================
// CREATE
// POST /api/reservations
// ==========================================

async function createReservation(req, res, next) {
  try {
    const data = req.body;

    const reservation = await prisma.reservation.create({
      data: {
        name: data.name,
        date: new Date(data.date),
        time: data.time,
        guests: data.guests,
      },
    });

    res.status(201).json({
      message: "Réservation créée avec succès.",
      reservation,
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// LIST
// GET /api/reservations
// ==========================================

async function listReservations(req, res, next) {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { date: "asc" },
    });

    res.json(reservations);
  } catch (err) {
    next(err);
  }
}

// ==========================================
// GET ONE
// GET /api/reservations/:id
// ==========================================

async function getReservationById(req, res, next) {
  try {
    const { id } = req.params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return res.status(404).json({
        error: "Réservation introuvable.",
      });
    }

    res.json(reservation);
  } catch (err) {
    next(err);
  }
}

// ==========================================
// UPDATE
// PATCH /api/reservations/:id
// ==========================================

async function updateReservation(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;

    const updateData = {
      ...data,
    };

    // Prisma attend un Date pour le champ date
    if (data.date) {
      updateData.date = new Date(data.date);
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: updateData,
    });

    res.json({
      message: "Réservation mise à jour avec succès.",
      reservation,
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// DELETE
// DELETE /api/reservations/:id
// ==========================================

async function deleteReservation(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.reservation.delete({
      where: { id },
    });

    res.json({
      message: "Réservation supprimée avec succès.",
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// AVAILABILITY
// GET /api/reservations/availability?date=2026-08-25
// ==========================================

async function checkAvailability(req, res, next) {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        error: "Date is required.",
      });
    }

    if (isNaN(Date.parse(date))) {
      return res.status(400).json({
        error: "Invalid date.",
      });
    }

    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59.999`);

    const reservations = await prisma.reservation.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      orderBy: {
        time: "asc",
      },
    });

    const bookedTimes = reservations.map(
      (reservation) => reservation.time
    );

    const availableTimes = [];

    for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour++) {
      const time = `${String(hour).padStart(2, "0")}:00`;

      if (!bookedTimes.includes(time)) {
        availableTimes.push(time);
      }
    }

    res.json({
      date,
      available: availableTimes.length > 0,
      availableTimes,
      bookedTimes,
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  reservationSchema,
  reservationUpdateSchema,
  createReservation,
  listReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  checkAvailability,
};