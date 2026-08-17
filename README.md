# ☕ Brew & Co. — Coffee Shop Website

A responsive marketing website for a fictional local coffee shop, built as a frontend coding challenge.

## ✨ Features

- **Home** — Hero section, shop introduction, and featured menu items pulled from the shared menu data.
- **Menu** — Items organized by category (Coffee, Pastries, Cold Drinks, Other Treats) with name, description, price, and image. Category filters are sticky while scrolling and auto-scroll back to the top of the list on selection.
- **Reservation** — Client-side validated table booking form (name, date, time, number of guests) with inline error messages and a confirmation state — no backend required.
- **Contact** — Address/map placeholder, opening hours, and a client-side contact form.
- **Light / dark mode** — Toggle in the navbar, persisted via a theme context/hook.
- **Scroll animations** — Sections fade/slide into view on scroll using a small custom `Reveal` component + `useReveal` hook (IntersectionObserver-based, no external animation library).
- **Fully responsive** — Mobile-first layout, tested down to small phone widths, with a collapsible mobile nav menu.

## 🛠️ Tech Stack

- **[React](https://react.dev/)** — component-based UI
- **[Vite](https://vitejs.dev/)** — build tool / dev server
- **[React Router](https://reactrouter.com/)** — client-side routing between pages
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling, with a custom theme (colors, fonts, shadows) in `tailwind.config.js`
- **[Lucide React](https://lucide.dev/)** — icon set

## 📂 Project Structure

```
src/
├── components/       # Reusable UI pieces (Navbar, Footer, Reveal, MenuItemCard, FormField, ...)
├── pages/            # Route-level pages (Home, Menu, Reservation, Contact)
├── data/             # Static content (menuData.js — categories & menu items)
├── hooks/            # Custom hooks (useTheme, useReveal)
├── App.jsx           # Routes + layout shell
├── main.jsx          # App entry point
└── index.css         # Tailwind directives + global styles
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Installation & Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/Christina-Abdallah/CoffeShopWebsite.git
cd CoffeShopWebsite

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173` (Vite's default port).



The optimized static build is output to the `dist/` folder, ready to deploy to any static host (Vercel, Netlify, GitHub Pages, etc.).

### Preview the Production Build Locally

```bash
npm run preview
```

## 📱 Testing on a Mobile Device (same Wi-Fi)

```bash
npm run dev -- --host
```

Then open the `Network` URL shown in the terminal (e.g. `http://192.168.x.x:5173`) on a phone connected to the same Wi-Fi network.

## 🎨 Design Notes

- Color palette (`tailwind.config.js`): warm cream backgrounds, deep forest green, and a caramel/gold accent — chosen to evoke a cozy, artisanal coffee shop rather than a generic bright brand palette.
- Typography: `Fraunces` (display/serif) for headings, `Inter` for body text.
- Form validation (Reservation & Contact) is handled entirely client-side — no backend/API calls, as specified in the brief.

## 📄 License

This is a fictional project built for a coding challenge / portfolio purposes. Feel free to reuse the structure, but please swap the "Brew & Co." branding and imagery if repurposing commercially.