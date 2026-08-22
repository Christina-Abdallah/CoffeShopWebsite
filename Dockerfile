# -----------------------------------------------------------------------------
# Brew & Co. — Frontend Dockerfile (production)
# -----------------------------------------------------------------------------
# What is this file?
#   A Dockerfile is a step-by-step script that Docker uses to build a
#   container image. An image is a packaged environment that contains
#   the operating system, Node.js, and your app dependencies.
#
# Who uses this?
#   docker-compose.yml references this file automatically via `build:`.
#   Frontend devs do not usually edit this.
#
# Notes:
#   - Multi-stage build: the first stage builds the static files with dev
#     dependencies, the second stage ships only the compiled `dist/` folder
#     using nginx-alpine (no Node runtime or node_modules in the final image).
#   - nginx runs as its built-in non-root `nginx` user for security.
# -----------------------------------------------------------------------------

# -----------------------------------------------------------------------------
# Stage 1 — Build the Vite production bundle
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Patch the base Alpine image to pull in any OS security fixes.
RUN apk upgrade --no-cache

# Copy only the package files first so Docker can cache the install layer.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code and build the production bundle.
COPY . .
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2 — Serve the static bundle with nginx-alpine
# -----------------------------------------------------------------------------
FROM nginx:alpine

# Patch the base Alpine image to pull in any OS security fixes.
RUN apk upgrade --no-cache

# Copy our non-root nginx configuration.
COPY nginx.conf /etc/nginx/nginx.conf

# Copy only the compiled static files from the builder stage.
COPY --from=builder /app/dist /usr/share/nginx/html

# Ensure the built-in nginx user can read the site and write runtime files.
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /tmp

USER nginx

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
