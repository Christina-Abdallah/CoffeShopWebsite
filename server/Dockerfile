# -----------------------------------------------------------------------------
# Brew & Co. — Backend Dockerfile
# -----------------------------------------------------------------------------
# Builds the Express + Prisma API container.
# -----------------------------------------------------------------------------

FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies first for better layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# Copy Prisma schema and migration files, then generate the Prisma Client.
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the backend source code.
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
