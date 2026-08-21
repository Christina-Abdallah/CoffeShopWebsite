# ☕ Brew & Co. — Coffee Shop Website

A full-stack website for a fictional coffee shop, built as a frontend coding challenge and extended with a real backend API and database layer.

---

## 🧱 Tech Stack

### Frontend

- **React** (with **Vite**)
- **React Router** — routing between pages
- **Tailwind CSS** — custom theme (`tailwind.config.js`)
- **Lucide React** — icons
- **Fraunces** (headings/display) & **Inter** (body text)
- Scroll animations via a custom `Reveal.jsx` component + `useReveal` hook (native `IntersectionObserver`, no external library)

### Backend

- **Node.js**
- **Express.js**
- **Prisma 7**
- **PostgreSQL 15**
- **Docker / Docker Compose**
- **Zod** — data validation
- **CORS**
- **dotenv**
- **Nodemon** — development server

---

## 📁 Project Structure

```text
CoffeShopWebsite/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Reveal.jsx
│   │   ├── MenuItemCard.jsx
│   │   └── FormField.jsx
│   │
│   ├── context/
│   │   ├── ThemeContext.js
│   │   └── ThemeProvider.jsx
│   │
│   ├── data/
│   │   └── menuData.js
│   │
│   ├── hooks/
│   │   ├── useTheme.jsx
│   │   └── useReveal.js
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Menu.jsx
│   │   ├── Reservation.jsx
│   │   └── Contact.jsx
│   │
│   ├── utils/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   └── routes/
│   │
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── .env.example
│   ├── docker-compose.yml
│   ├── package.json
│   ├── prisma.config.ts
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js v18 or later
- npm
- Docker Desktop
- Git

---

## 🎨 Frontend Setup

From the project root:

```bash
npm install
```

### Environment variables

Create a `.env` file from the example:

**Windows CMD**
```bash
copy .env.example .env
```

**macOS / Linux**
```bash
cp .env.example .env
```

Configure the frontend environment variable:

```
VITE_API_URL=http://localhost:3000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will normally be available at:

```
http://localhost:5173
```

---

## 🖥️ Backend Setup

The `/server` folder contains the Express REST API, Prisma ORM, and PostgreSQL database configuration.

### 1. Go to the server directory

```bash
cd server
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file from `.env.example`.

**Windows CMD**
```bash
copy .env.example .env
```

**macOS / Linux**
```bash
cp .env.example .env
```

The `.env` file should contain:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/brewco?schema=public"
PORT=3000
CLIENT_URL="http://localhost:5173"
```

> ⚠️ The `.env` file contains local configuration and must **not** be committed to Git. Use `.env.example` as the template.

---

## 🐘 PostgreSQL Setup

PostgreSQL is provided through Docker Compose.

From the `server` directory:

```bash
docker compose up -d
```

This starts a PostgreSQL 15 container with:

| Setting | Value |
|---|---|
| Database | `brewco` |
| User | `postgres` |
| Password | `password` |
| Port | `5432` |

Check that the database container is running:

```bash
docker compose ps
```

You should see the PostgreSQL container running.

---

## 🔷 Prisma Setup

After PostgreSQL is running, generate the Prisma Client:

```bash
npm run prisma:generate
```

Apply the existing migrations and synchronize the database schema:

```bash
npm run prisma:migrate
```

> ℹ️ This project's `prisma:migrate` script runs `prisma migrate dev`, which is intended for **development**: it applies existing migrations and can also create a new migration if the schema has changed locally. For **production** deployments, use `prisma migrate deploy` instead — it only applies existing migrations and never generates new ones.

---

## ▶️ Run the Backend

For development:

```bash
npm run dev
```

The backend API will run at:

```
http://localhost:3000
```

For production:

```bash
npm start
```

---

## 🗄️ Prisma Studio

Prisma Studio can be used to inspect and manage the database.

From the `server` directory:

```bash
npm run prisma:studio
```

Prisma Studio will open in the browser.

---

## 🛑 Stop PostgreSQL

When you finish working on the project, you can stop the PostgreSQL container with:

```bash
docker compose down
```

The PostgreSQL data is stored in a Docker volume, so stopping the container does not remove the database data.

---

## 🔄 Running the Full Application

You need two terminal windows.

**Terminal 1 — Backend**
```bash
cd server
npm install
docker compose up -d
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

**Terminal 2 — Frontend**

From the project root:

```bash
npm install
npm run dev
```

Then open:

```
http://localhost:5173
```

The frontend communicates with the backend through `http://localhost:3000`.

---

## 📡 Backend Configuration

The backend uses the following environment variables:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/brewco?schema=public` |
| `PORT` | Express server port | `3000` |
| `CLIENT_URL` | Frontend URL allowed by CORS | `http://localhost:5173` |

---

## 🗃️ Database Schema

The application currently contains the following main models.

### Reservation

Reservations contain: `id`, `name`, `date`, `time`, `guests`, `status`, `createdAt`, `updatedAt`

Reservation statuses: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`

### ContactMessage

Contact messages contain: `id`, `fullName`, `email`, `subject`, `message`, `status`, `createdAt`

Contact message statuses: `UNREAD`, `READ`, `REPLIED`

---

## 🧪 Development Commands

### Frontend

From the project root:

```bash
npm run dev          # start dev server
npm run build         # build for production
npm run preview        # preview the production build
npm run dev -- --host   # expose dev server on the local network
```

### Backend

From the `server` directory:

```bash
npm run dev              # start dev server
npm start                 # start in production mode
npm run prisma:generate    # generate Prisma Client
npm run prisma:migrate      # apply existing migrations (dev script — may also create a new migration if schema changed; use `prisma migrate deploy` in production)
npm run prisma:studio        # open Prisma Studio
```

---

## 📱 Testing on a Mobile Device

To make the Vite development server accessible from another device on the same Wi-Fi network:

```bash
npm run dev -- --host
```

Vite will display a network URL similar to:

```
http://192.168.x.x:5173
```

Open this address on a phone connected to the same Wi-Fi network.

---

## 🎨 Design

The design uses a warm coffee-shop-inspired visual identity.

**Color palette**
- Warm cream backgrounds
- Deep forest green
- Caramel / gold accent
- Dark ink tones

**Typography**
- Fraunces for headings
- Inter for body text

The interface supports both light and dark themes.

---

## ✨ Architecture

The project is organized into two main applications:

```
Frontend
React + Vite
      │
      │ HTTP API
      ▼
Backend
Express.js
      │
      │ Prisma
      ▼
PostgreSQL
```

- The **frontend** is responsible for the user interface and client-side interactions.
- The **backend** handles API requests, validation, reservations, contact messages, and database access.
- **Prisma** provides the database access layer between Express and PostgreSQL.

---

## 🔐 Environment Variables

Environment files containing secrets or local configuration should not be committed.

The repository provides example files:

- `.env.example`
- `server/.env.example`

Developers should create their own local `.env` files from these templates.

---

## 📦 Production Build

Build the frontend:

```bash
npm run build
```

The optimized static frontend build is generated in `dist/`.

The frontend can be deployed to platforms such as Vercel, Netlify, or another static hosting provider. The Express backend and PostgreSQL database should be deployed separately using an appropriate Node.js hosting platform and PostgreSQL provider.

---

## 📝 Notes

This project was originally created as a frontend coding challenge for a fictional coffee shop and was extended with a backend API and database layer. The backend uses PostgreSQL locally through Docker Compose, while Prisma manages the database schema and migrations.

---

## 📄 License

This is a fictional project created for a coding challenge and portfolio purposes. The project structure can be reused for learning or personal projects, but the Brew & Co. branding and imagery should be replaced if the project is used commercially.