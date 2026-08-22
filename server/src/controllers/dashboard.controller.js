const prisma = require("../db/prisma");

async function getDashboard(req, res, next) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalReservations,
      todayReservations,
      popularItem,
      menuCount,
      staffCount,
      onShift,
      unreadMessages,
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
      prisma.contactMessage.findMany({
        where: { status: "UNREAD" },
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
      recentMessages,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard };
