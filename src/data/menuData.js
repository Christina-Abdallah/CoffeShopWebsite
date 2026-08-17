export const categories = [
  { id: "coffee", label: "Coffee", icon: "Coffee" },
  { id: "pastries", label: "Pastries", icon: "Croissant" },
  { id: "cold-drinks", label: "Cold Drinks", icon: "CupSoda" },
  { id: "other", label: "Other Treats", icon: "IceCreamCone" },
];

export const menuItems = [
  // ---------- COFFEE ----------
  {
    id: "cappuccino",
    name: "Cappuccino",
    category: "coffee",
    description: "Rich espresso with steamed milk and foam.",
    price: 3.75,
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "americano",
    name: "Americano",
    category: "coffee",
    description: "Bold espresso diluted with hot water.",
    price: 2.75,
    image:
      "https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "mocha",
    name: "Mocha",
    category: "coffee",
    description: "Espresso with chocolate and steamed milk.",
    price: 4.25,
    image:
      "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "espresso",
    name: "Espresso",
    category: "coffee",
    description: "Strong and bold single shot.",
    price: 2.25,
    image:
      "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "flat-white",
    name: "Flat White",
    category: "coffee",
    description: "Velvety espresso with steamed milk.",
    price: 3.85,
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "caramel-macchiato",
    name: "Caramel Macchiato",
    category: "coffee",
    description: "Smooth espresso with caramel and steamed milk.",
    price: 4.5,
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "macchiato",
    name: "Macchiato",
    category: "coffee",
    description: "A shot of espresso marked with a touch of foam.",
    price: 3.5,
    image:
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cortado",
    name: "Cortado",
    category: "coffee",
    description: "Equal parts espresso and warm milk, gently balanced.",
    price: 3.6,
    image:
      "https://images.unsplash.com/photo-1580933073521-dc49ac0d4e6a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "turkish-coffee",
    name: "Turkish Coffee",
    category: "coffee",
    description: "Finely ground coffee brewed unfiltered, rich and strong.",
    price: 3.25,
    image:
      "https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "irish-coffee",
    name: "Irish Coffee",
    category: "coffee",
    description: "Hot coffee blended with whiskey and cream.",
    price: 5.5,
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "vienna-coffee",
    name: "Vienna Coffee",
    category: "coffee",
    description: "Espresso topped with a generous swirl of whipped cream.",
    price: 4.1,
    image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80",
  },

  {
    id: "ristretto",
    name: "Ristretto",
    category: "coffee",
    description: "A short, concentrated shot of espresso.",
    price: 2.5,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doppio",
    name: "Doppio",
    category: "coffee",
    description: "A double shot of pure espresso.",
    price: 3.0,
    image:
      "https://images.unsplash.com/photo-1522992319-0365e5f11656?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cuban-coffee",
    name: "Cuban Coffee",
    category: "coffee",
    description: "Sweet, strong espresso with a hint of sugar foam.",
    price: 3.4,
    image:
      "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "breve",
    name: "Breve",
    category: "coffee",
    description: "Espresso with steamed half-and-half for extra richness.",
    price: 4.0,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "red-eye",
    name: "Red Eye",
    category: "coffee",
    description: "Drip coffee with a shot of espresso for extra kick.",
    price: 3.2,
    image:
      "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cafe-miel",
    name: "Café Miel",
    category: "coffee",
    description: "Espresso sweetened with local honey.",
    price: 3.75,
    image:
      "https://images.unsplash.com/photo-1442550528053-c431ecb55509?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "spanish-latte",
    name: "Spanish Latte",
    category: "coffee",
    description: "Espresso with condensed milk and steamed milk.",
    price: 4.15,
    image:
      "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=600&q=80",
  },

  // ---------- PASTRIES ----------
  {
    id: "butter-croissant",
    name: "Butter Croissant",
    category: "pastries",
    description: "Flaky, buttery perfection baked daily.",
    price: 3.2,
    badge: "Fresh",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "chocolate-croissant",
    name: "Chocolate Croissant",
    category: "pastries",
    description: "Buttery croissant filled with rich dark chocolate.",
    price: 3.75,
    image:
      "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "almond-croissant",
    name: "Almond Croissant",
    category: "pastries",
    description: "Flaky croissant filled with sweet almond cream.",
    price: 3.95,
    image:
      "https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "blueberry-muffin",
    name: "Blueberry Muffin",
    category: "pastries",
    description: "Moist muffin bursting with fresh blueberries.",
    price: 3.1,
    image:
      "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cinnamon-roll",
    name: "Cinnamon Roll",
    category: "pastries",
    description: "Soft roll swirled with cinnamon sugar and glaze.",
    price: 3.85,
    badge: "Fresh",
    image:
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cheese-danish",
    name: "Cheese Danish",
    category: "pastries",
    description: "Flaky pastry filled with sweet cream cheese.",
    price: 3.6,
    image:
      "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "scone",
    name: "Scone",
    category: "pastries",
    description: "Traditional scone served with butter and jam.",
    price: 3.0,
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  },

  {
    id: "apple-turnover",
    name: "Apple Turnover",
    category: "pastries",
    description: "Flaky pastry filled with spiced apple filling.",
    price: 3.65,
    image:
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "raspberry-danish",
    name: "Raspberry Danish",
    category: "pastries",
    description: "Buttery danish swirled with sweet raspberry jam.",
    price: 3.7,
    image:
      "https://images.unsplash.com/photo-1546039907-7fa05f864c02?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pretzel-croissant",
    name: "Pretzel Croissant",
    category: "pastries",
    description: "A crossover of pretzel and croissant, salty and flaky.",
    price: 3.85,
    image:
      "https://images.unsplash.com/photo-1587241321921-91a834d6d191?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "lemon-poppy-muffin",
    name: "Lemon Poppy Seed Muffin",
    category: "pastries",
    description: "Zesty muffin with a delicate poppy seed crunch.",
    price: 3.15,
    image:
      "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pain-au-chocolat",
    name: "Pain au Chocolat",
    category: "pastries",
    description: "Classic French pastry with rich chocolate batons.",
    price: 3.8,
    image:
      "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=600&q=80",
  },

  // ---------- COLD DRINKS ----------
  {
    id: "iced-coffee",
    name: "Iced Coffee",
    category: "cold-drinks",
    description: "Chilled coffee over ice, smooth and refreshing.",
    price: 3.5,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    category: "cold-drinks",
    description: "Slow-steeped coffee served chilled and smooth.",
    price: 4.2,
    image:
      "https://images.unsplash.com/photo-1517959105821-eaf2591984ca?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "iced-mocha",
    name: "Iced Mocha",
    category: "cold-drinks",
    description: "Chilled espresso with chocolate and cold milk.",
    price: 4.6,
    image:
      "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "iced-caramel-macchiato",
    name: "Iced Caramel Macchiato",
    category: "cold-drinks",
    description: "Espresso, caramel, and cold milk over ice.",
    price: 4.8,
    image:
      "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "fresh-lemonade",
    name: "Fresh Lemonade",
    category: "cold-drinks",
    description: "Freshly squeezed lemonade, cool and tangy.",
    price: 3.5,
    image:
      "https://images.unsplash.com/photo-1523371054106-bbf80586c38c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "iced-chai-latte",
    name: "Iced Chai Latte",
    category: "cold-drinks",
    description: "Spiced chai tea with cold milk over ice.",
    price: 4.3,
    image:
      "https://images.unsplash.com/photo-1560508180-03f285f67ded?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "strawberry-refresher",
    name: "Strawberry Refresher",
    category: "cold-drinks",
    description: "Iced strawberry refresher, fruity and light.",
    price: 4.1,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "vietnamese-iced-coffee",
    name: "Vietnamese Iced Coffee",
    category: "cold-drinks",
    description: "Bold coffee with sweetened condensed milk over ice.",
    price: 4.3,
    image:
      "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=800&h=1000&q=80",
  },

  // ---------- OTHER TREATS ----------
  {
    id: "chocolate-chip-cookie",
    name: "Chocolate Chip Cookie",
    category: "other",
    description: "Classic cookie loaded with chocolate chips.",
    price: 2.5,
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "brownie",
    name: "Brownie",
    category: "other",
    description: "Fudgy chocolate brownie, rich and dense.",
    price: 3.1,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cheesecake-slice",
    name: "Cheesecake Slice",
    category: "other",
    description: "Creamy cheesecake with a graham cracker crust.",
    price: 4.5,
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "macarons",
    name: "Macarons (3pc)",
    category: "other",
    description: "Delicate almond meringue cookies, assorted flavors.",
    price: 4.2,
    image:
      "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "waffle-with-berries",
    name: "Waffle with Berries",
    category: "other",
    description: "Crisp waffle topped with fresh seasonal berries.",
    price: 5.2,
    image:
      "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "granola-yogurt-cup",
    name: "Granola Yogurt Cup",
    category: "other",
    description: "Creamy yogurt layered with granola and honey.",
    price: 3.9,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "fruit-tart",
    name: "Fruit Tart",
    category: "other",
    description: "Buttery tart shell filled with custard and fresh fruit.",
    price: 4.6,
    image:
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "hot-chocolate",
    name: "Hot Chocolate",
    category: "other",
    description: "Rich cocoa topped with whipped cream.",
    price: 3.75,
    image:
      "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "chocolate-muffin",
    name: "Chocolate Muffin",
    category: "other",
    description: "Moist chocolate muffin with chocolate chunks.",
    price: 3.3,
    image:
      "https://images.unsplash.com/photo-1607478900766-efe13248b125?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pistachio-baklava",
    name: "Pistachio Baklava",
    category: "other",
    description: "Layers of flaky filo with honey and pistachios.",
    price: 3.95,
    image:
      "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "churros",
    name: "Churros",
    category: "other",
    description: "Crispy fried dough dusted with cinnamon sugar.",
    price: 3.6,
    image:
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "rice-krispie-treat",
    name: "Rice Krispie Treat",
    category: "other",
    description: "Chewy marshmallow and crispy rice bar.",
    price: 2.9,
    image:
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80",
  },
];

export const featuredIds = ["caramel-macchiato", "butter-croissant", "iced-mocha"];