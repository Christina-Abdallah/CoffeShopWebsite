const bcrypt = require("bcryptjs");
const prisma = require("../db/prisma");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    req.session.adminId = user.id;

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("brewco.sid", {
        path: "/",
        domain: process.env.SESSION_COOKIE_DOMAIN || undefined,
      });
      res.json({ message: "Logged out" });
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    if (!req.session || !req.session.adminId) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: req.session.adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  logout,
  me,
};