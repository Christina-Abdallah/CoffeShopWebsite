require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const csrf = require("csurf");

const reservationsRoutes = require("./src/routes/reservations.routes");
const contactRoutes = require("./src/routes/contact.routes");
const authRoutes = require("./src/routes/auth.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const menuRoutes = require("./src/routes/menu.routes");
const staffRoutes = require("./src/routes/staff.routes");
const messagesRoutes = require("./src/routes/messages.routes");
const profileRoutes = require("./src/routes/profile.routes");

const { requireAuth } = require("./src/middlewares/auth");
const {
  errorHandler,
  notFoundHandler,
} = require("./src/middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

const sessionCookieOptions = {
  path: "/",
  domain: process.env.SESSION_COOKIE_DOMAIN || undefined,
  httpOnly: true,
  secure: true, // HTTPS-only in production
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 8, // 8 hours
  expires: new Date(Date.now() + 1000 * 60 * 60 * 8),
};

// Relax the secure flag outside production so local HTTP dev works.
if (!IS_PRODUCTION) {
  sessionCookieOptions.secure = false;
}

app.use(
  session({
    name: "brewco.sid",
    secret: process.env.SESSION_SECRET || "change-me-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: sessionCookieOptions,
  })
);

// CSRF protection for state-changing admin routes. Public reservation/contact
// endpoints remain stateless and are mounted before csurf.
const csrfProtection = csrf({
  cookie: false, // store token in session
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Public stateless routes (no CSRF needed)
app.use("/api/reservations", reservationsRoutes);
app.use("/api/contact", contactRoutes);

// Admin auth routes: login needs CSRF token too because it sets a session cookie
app.use("/api/admin/auth", csrfProtection, authRoutes);

// Expose a route to fetch a fresh CSRF token for the admin SPA.
app.get("/api/admin/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Protected admin routes (all require CSRF + auth)
app.use("/api/admin/dashboard", csrfProtection, requireAuth, dashboardRoutes);
app.use("/api/admin/menu", csrfProtection, requireAuth, menuRoutes);
app.use("/api/admin/staff", csrfProtection, requireAuth, staffRoutes);
app.use("/api/admin/messages", csrfProtection, requireAuth, messagesRoutes);
app.use("/api/admin/profile", csrfProtection, requireAuth, profileRoutes);

// Error handlers must stay at the end
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `✅ Brew & Co. server running on http://localhost:${PORT}`
  );
});