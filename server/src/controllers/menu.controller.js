const prisma = require("../db/prisma");

async function list(req, res, next) {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, category, price, description, imageUrl, isAvailable, isPopular } = req.body;
    const item = await prisma.menuItem.create({
      data: {
        name,
        category,
        price: parseFloat(price),
        description,
        imageUrl,
        isAvailable: isAvailable ?? true,
        isPopular: isPopular ?? false,
      },
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { name, category, price, description, imageUrl, isAvailable, isPopular } = req.body;
    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        category,
        price: price !== undefined ? parseFloat(price) : undefined,
        description,
        imageUrl,
        isAvailable,
        isPopular,
      },
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.menuItem.delete({ where: { id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, remove };
