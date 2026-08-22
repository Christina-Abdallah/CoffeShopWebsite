# -----------------------------------------------------------------------------
# Brew & Co. — Backend Dockerfile
# -----------------------------------------------------------------------------
# Builds the Express + Prisma API container.
# -----------------------------------------------------------------------------

FROM node:20-alpine

WORKDIR /app

# Patch the base Alpine image to pull in any OS security fixes.
RUN apk upgrade --no-cache

# Copy package files and install production dependencies only.
# This keeps the image smaller and avoids shipping dev-only vulnerable libs.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy Prisma schema and migration files, then generate the Prisma Client.
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the backend source code.
COPY . .

# npm is only needed at build time to install dependencies; remove it so the
# image does not ship the npm CLI's own (large) transitive dependency tree.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Create a non-root user, make /app owned by it, and switch to it for security.
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 \
    && chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

CMD ["node", "server.js"]
