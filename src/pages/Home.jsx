import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import MenuItemCard from "../components/MenuItemCard";
import { menuItems, featuredIds } from "../data/menuData";

export default function Home() {
  const featured = featuredIds.map((id) => menuItems.find((m) => m.id === id));

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2 md:items-center md:py-24">
        <Reveal>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl text-stone-900 dark:text-cream">
            Good Coffee,
            <br />
            <span className="text-clay">Great Moments</span>
          </h1>
          {/* Écriture plus foncée et bien visible */}
          <p className="mt-5 max-w-md text-stone-900 font-medium dark:text-cream-soft/70">
            At Brew &amp; Co., we believe every cup tells a story. Locally roasted beans, cozy
            vibes, and a passion for brewing the perfect coffee.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-forest-light dark:bg-clay dark:hover:bg-clay-dark"
            >
              Explore Our Menu
            </Link>
            <Link
              to="/reservation"
              className="rounded-full border border-stone-900/30 px-6 py-3 text-sm font-semibold text-stone-900 transition-colors hover:border-clay hover:text-clay dark:border-cream/20 dark:text-cream"
            >
              Reserve a Table
            </Link>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80"
              alt="Latte art in a green cup on a wooden table"
              className="aspect-[4/3] w-full rounded-xl2 object-cover shadow-soft"
            />
          </div>
        </Reveal>
      </section>

      {/* Featured favorites */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <Reveal className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl text-stone-900 dark:text-cream">Featured Favorites</h2>
          {/* Écriture plus foncée pour le sous-titre */}
          <p className="mt-2 text-stone-800 font-medium dark:text-cream-soft/60">
            A few things our regulars never skip.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item, i) => (
            <Reveal key={item.id} delay={i * 100}>
              <MenuItemCard item={item} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}