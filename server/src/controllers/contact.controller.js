const { z } = require("zod");
const prisma = require("../db/prisma");

// ==========================================
// CREATE CONTACT MESSAGE VALIDATION
// ==========================================

const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Please enter your full name."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  subject: z
    .string()
    .trim()
    .optional(),

  message: z
    .string()
    .trim()
    .min(1, "Please enter your message."),
});

// ==========================================
// UPDATE CONTACT MESSAGE VALIDATION
// ==========================================

const contactUpdateSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Please enter your full name.")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .optional(),

  subject: z
    .string()
    .trim()
    .optional(),

  message: z
    .string()
    .trim()
    .min(1, "Please enter your message.")
    .optional(),

  status: z
    .enum(["UNREAD", "READ", "REPLIED"])
    .optional(),
});

// ==========================================
// CREATE
// POST /api/contact
// ==========================================

async function createContactMessage(req, res, next) {
  try {
    const data = req.body;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        subject: data.subject || null,
        message: data.message,
      },
    });

    res.status(201).json({
      message: "Message sent successfully.",
      contactMessage,
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// LIST
// GET /api/contact
// ==========================================

async function listContactMessages(req, res, next) {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(messages);
  } catch (err) {
    next(err);
  }
}

// ==========================================
// GET ONE
// GET /api/contact/:id
// ==========================================

async function getContactMessageById(req, res, next) {
  try {
    const { id } = req.params;

    const contactMessage = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!contactMessage) {
      return res.status(404).json({
        error: "Contact message not found.",
      });
    }

    res.json(contactMessage);
  } catch (err) {
    next(err);
  }
}

// ==========================================
// UPDATE
// PATCH /api/contact/:id
// ==========================================

async function updateContactMessage(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;

    const contactMessage = await prisma.contactMessage.update({
      where: { id },
      data,
    });

    res.json({
      message: "Contact message updated successfully.",
      contactMessage,
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// DELETE
// DELETE /api/contact/:id
// ==========================================

async function deleteContactMessage(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.contactMessage.delete({
      where: { id },
    });

    res.json({
      message: "Contact message deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  contactSchema,
  contactUpdateSchema,
  createContactMessage,
  listContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage,
};