# -----------------------------------------------------------------------------
# Brew & Co. — Backend Dockerfile
# -----------------------------------------------------------------------------
# Builds the Express + Prisma API container.
# -----------------------------------------------------------------------------

FROM node:20-alpine

WORKDIR /app

# Patch the base Alpine image to pull in any OS security fixes.
RUN apk upgrade --no-cache

# Upgrade npm itself so its bundled dependencies (tar, minimatch, etc.)
# are up-to-date. Trivy flags vulnerabilities in npm's own internal packages;
# upgrading npm resolves them without touching our app dependencies.
RUN npm install -g npm@latest

# Copy package files and install production dependencies only.
# This keeps the image smaller and avoids shipping dev-only vulnerable libs.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy Prisma schema and migration files, then generate the Prisma Client.
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the backend source code.
COPY . .

# Make the entrypoint executable (used by docker-compose for migrations + start).
RUN chmod +x entrypoint.sh

# Create a non-root user, make /app owned by it, and switch to it for security.
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 \
    && chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

CMD ["node", "server.js"]
