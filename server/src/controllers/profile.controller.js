const prisma = require("../db/prisma");

async function getProfile(req, res, next) {
  try {
    const adminId = req.session.adminId;

    const profile = await prisma.adminUser.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emails: {
          orderBy: {
            addedAt: "desc",
          },
          select: {
            id: true,
            email: true,
            addedAt: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({
        message: "Admin profile not found.",
      });
    }

    res.json({
      ...profile,
      fullName: profile.name,
    });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const adminId = req.session.adminId;
    const { fullName } = req.body;

    const data = {};
    if (fullName !== undefined) {
      data.name = typeof fullName === "string" ? fullName.trim() : fullName;
    }

    const profile = await prisma.adminUser.update({
      where: { id: adminId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json({
      ...profile,
      fullName: profile.name,
    });
  } catch (err) {
    next(err);
  }
}

async function addProfileEmail(req, res, next) {
  try {
    const adminId = req.session.adminId;
    const email = req.body.email?.trim();

    if (!email) {
      return res.status(400).json({
        message: "Email address is required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    const entry = await prisma.adminProfileEmail.create({
      data: {
        email,
        adminId,
      },
    });

    const emails = await prisma.adminProfileEmail.findMany({
      where: { adminId },
      orderBy: {
        addedAt: "desc",
      },
      select: {
        id: true,
        email: true,
        addedAt: true,
      },
    });

    res.status(201).json(emails);
  } catch (err) {
    next(err);
  }
}

async function deleteProfileEmail(req, res, next) {
  try {
    const adminId = req.session.adminId;
    const { id } = req.params;

    const entry = await prisma.adminProfileEmail.findFirst({
      where: {
        id,
        adminId,
      },
    });

    if (!entry) {
      return res.status(404).json({
        message: "Email address not found.",
      });
    }

    await prisma.adminProfileEmail.delete({
      where: { id },
    });

    const emails = await prisma.adminProfileEmail.findMany({
      where: { adminId },
      orderBy: {
        addedAt: "desc",
      },
      select: {
        id: true,
        email: true,
        addedAt: true,
      },
    });

    res.json(emails);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  addProfileEmail,
  deleteProfileEmail,
};