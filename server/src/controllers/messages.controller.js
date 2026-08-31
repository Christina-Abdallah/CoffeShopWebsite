const prisma = require("../db/prisma");

// The DB stores `status` ("UNREAD" / "READ" / ...), but the frontend's
// unread-dot logic checks a boolean `message.read !== true`. Without this,
// every message coming back from `list` looks unread, even ones already read.
function withReadFlag(message) {
  return { ...message, read: message.status === "READ" };
}

async function list(req, res, next) {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    res.json(messages.map(withReadFlag));
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
    res.json(withReadFlag(message));
  } catch (err) {
    next(err);
  }
}

module.exports = { list, updateStatus };