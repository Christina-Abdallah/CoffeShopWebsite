import { useRef, useState } from "react";
import {
  Coffee,
  Croissant,
  CupSoda,
  IceCreamCone,
} from "lucide-react";

import Reveal from "../components/Reveal";
import MenuItemCard from "../components/MenuItemCard";
import { categories, menuItems } from "../data/menuData";

const iconMap = {
  Coffee,
  Croissant,
  CupSoda,
  IceCreamCone,
};

export default function Menu() {
  const [active, setActive] = useState("coffee");
  const itemsRef = useRef(null);

  const visibleItems = menuItems.filter(
    (item) => item.category === active
  );

  const handleSelectCategory = (id) => {
    setActive(id);
    itemsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="relative">

      {/* ================= HERO ================= */}
      <section className="bg-clay px-5 py-16 text-center text-cream dark:bg-forest-deep">
        <Reveal>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Our Menu
          </h1>

          <p className="mt-2 text-cream/80">
            Handcrafted drinks and treats made with love.
          </p>
        </Reveal>
      </section>

      {/* ================= CATEGORY BAR ================= */}
      <div className="sticky top-16 z-40 border-b border-ink/10 bg-cream/95 py-4 shadow-sm backdrop-blur-md dark:border-cream/10 dark:bg-forest-deep/95">
        <div className="mx-auto flex max-w-6xl items-center justify-start gap-3 overflow-x-auto px-5 sm:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {categories.map((cat) => {
            const Icon = iconMap[cat.icon];
            const isActive = active === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                aria-pressed={isActive}
                className={`
                  flex shrink-0 items-center gap-2
                  rounded-full px-5 py-2.5
                  text-sm font-semibold
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-forest text-cream shadow-sm dark:bg-clay"
                      : "bg-ink/5 text-ink/70 hover:bg-ink/10 dark:bg-cream/10 dark:text-cream-soft/80 dark:hover:bg-cream/20"
                  }
                `}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}

        </div>
      </div>

      {/* ================= MENU ITEMS ================= */}
      <section
        ref={itemsRef}
        className="mx-auto max-w-6xl scroll-mt-36 px-5 py-14"
      >
        {visibleItems.length === 0 ? (
          <p className="text-center text-ink/60 dark:text-cream-soft/60">
            No items in this category yet — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {visibleItems.map((item, index) => (
              <Reveal
                key={item.id}
                delay={(index % 4) * 80}
                className="h-full"
              >
                <MenuItemCard item={item} />
              </Reveal>
            ))}

          </div>
        )}
      </section>
    </div>
  );
}