const prisma = require("../db/prisma");

async function list(req, res, next) {
  try {
    const members = await prisma.staffMember.findMany({
      orderBy: { fullName: "asc" },
    });
    res.json(members);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { fullName, role, email, status, shiftStart, shiftEnd, avatarUrl } = req.body;
    const member = await prisma.staffMember.create({
      data: { fullName, role, email, status, shiftStart, shiftEnd, avatarUrl },
    });
    res.status(201).json(member);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { fullName, role, email, status, shiftStart, shiftEnd, avatarUrl } = req.body;
    const member = await prisma.staffMember.update({
      where: { id },
      data: { fullName, role, email, status, shiftStart, shiftEnd, avatarUrl },
    });
    res.json(member);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.staffMember.delete({ where: { id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, remove };
