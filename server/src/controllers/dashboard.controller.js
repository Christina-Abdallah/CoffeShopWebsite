const prisma = require("../db/prisma");

// The DB stores `status` ("UNREAD" / "READ" / ...), but the frontend's
// unread-dot logic checks a boolean `message.read !== true`.
function withReadFlag(message) {
  return { ...message, read: message.status === "READ" };
}

async function getDashboard(req, res, next) {
  try {
    const now = new Date();

    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const [
      totalReservations,
      todayReservations,
      popularItem,
      menuCount,
      staffCount,
      onShift,
      unreadMessages,
      totalMessages,
      recentMessages,
    ] = await Promise.all([
      prisma.reservation.count(),
      prisma.reservation.count({
        where: { date: { gte: today, lt: tomorrow } },
      }),
      prisma.menuItem.findFirst({
        where: { isPopular: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.menuItem.count(),
      prisma.staffMember.count(),
      prisma.staffMember.count({ where: { status: "ON_SHIFT" } }),
      prisma.contactMessage.count({ where: { status: "UNREAD" } }),
      prisma.contactMessage.count(),
      // Previously filtered to status: "UNREAD" only — meaning the preview
      // never showed already-read messages even though the design mixes
      // both. Now takes the 5 most recent regardless of status.
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    res.json({
      kpis: {
        activeReservations: todayReservations,
        totalReservations,
        popularItem: popularItem?.name || "N/A",
        menuCount,
        staffCount,
        onShift,
        unreadMessages,
      },
      hasMoreMessages: totalMessages > 5,
      recentMessages: recentMessages.map(withReadFlag),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard };