export default function MenuItemCard({ item }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl2 bg-white shadow-soft transition-transform duration-300 hover:-translate-y-1 dark:bg-forest-light">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {item.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-forest px-3 py-1 text-xs font-semibold text-cream shadow dark:bg-clay">
            {item.badge}
          </span>
        )}
      </div>

      {/* Keeps the price at the bottom of every card. */}
      <div className="flex flex-1 flex-col space-y-1 p-4">
        <h3 className="line-clamp-1 font-display text-lg font-semibold">
          {item.name}
        </h3>

        {/* Limits long descriptions to two lines for consistent card heights. */}
        <p className="line-clamp-2 text-sm leading-snug text-ink/60 dark:text-cream-soft/70">
          {item.description}
        </p>

        <p className="mt-auto pt-1 font-display text-base font-semibold text-forest dark:text-clay-light">
          ${Number(item.price).toFixed(2)}
        </p>
      </div>
    </article>
  );
}