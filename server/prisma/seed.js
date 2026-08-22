require("dotenv").config();
const prisma = require("../src/db/prisma");
const bcrypt = require("bcryptjs");

async function main() {
  // Default admin account — change these in production
  const adminEmail = process.env.ADMIN_EMAIL || "admin@brewco.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_NAME || "Arthur Pendelton";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: "manager",
    },
  });

  const menuItems = [
    { name: "Espresso Romano", category: "Coffee", price: 4.50, description: "Classic espresso with a twist of lemon.", isAvailable: true, isPopular: true },
    { name: "Cappuccino", category: "Coffee", price: 5.00, description: "Espresso, steamed milk, and foam.", isAvailable: true, isPopular: false },
    { name: "Croissant", category: "Pastries", price: 3.50, description: "Buttery flaky pastry.", isAvailable: true, isPopular: false },
    { name: "Iced Latte", category: "Cold Drinks", price: 5.50, description: "Chilled espresso and milk over ice.", isAvailable: true, isPopular: false },
  ];

  for (const item of menuItems) {
    const id = "__seed__" + item.name.replace(/\s+/g, "_").toLowerCase();
    await prisma.menuItem.upsert({
      where: { id },
      update: {},
      create: { ...item, id },
    });
  }

  const staff = [
    { fullName: "Arthur Pendelton", role: "Store Manager", email: "arthur@brewco.com", status: "ON_SHIFT", shiftStart: "07:00", shiftEnd: "15:00" },
    { fullName: "Emma Rodriguez", role: "Head Barista", email: "emma.r@brewco.com", status: "ON_SHIFT", shiftStart: "07:00", shiftEnd: "15:00" },
    { fullName: "Liam Chen", role: "Barista", email: "liam@brewco.com", status: "ON_BREAK", shiftStart: "09:00", shiftEnd: "17:00" },
    { fullName: "Sofia Martinez", role: "Pastry Chef", email: "sofia@brewco.com", status: "ON_SHIFT", shiftStart: "06:00", shiftEnd: "14:00" },
    { fullName: "Noah Williams", role: "Barista", email: "noah@brewco.com", status: "OFF_DUTY", shiftStart: "15:00", shiftEnd: "23:00" },
    { fullName: "Olivia Park", role: "Cashier", email: "olivia.p@brewco.com", status: "OFF_DUTY", shiftStart: "12:00", shiftEnd: "20:00" },
  ];

  for (const member of staff) {
    await prisma.staffMember.upsert({
      where: { email: member.email },
      update: {},
      create: member,
    });
  }

  console.log("✅ Seed data created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
