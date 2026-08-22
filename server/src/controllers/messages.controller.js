const prisma = require("../db/prisma");

async function list(req, res, next) {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    res.json(messages);
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
    res.json(message);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, updateStatus };
