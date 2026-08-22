const express = require("express");

const { validate } = require("../middlewares/validate");

const {
  contactSchema,
  contactUpdateSchema,
  createContactMessage,
  listContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage,
} = require("../controllers/contact.controller");

const router = express.Router();

// POST /api/contact
router.post(
  "/",
  validate(contactSchema),
  createContactMessage
);

// GET /api/contact
router.get("/", listContactMessages);

// GET /api/contact/:id
router.get("/:id", getContactMessageById);

// PATCH /api/contact/:id
router.patch(
  "/:id",
  validate(contactUpdateSchema),
  updateContactMessage
);

// DELETE /api/contact/:id
router.delete("/:id", deleteContactMessage);

module.exports = router;