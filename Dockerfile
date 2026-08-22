# -----------------------------------------------------------------------------
# Brew & Co. — Dockerfile (dev server)
# -----------------------------------------------------------------------------
# What is this file?
#   A Dockerfile is a step-by-step script that Docker uses to build a
#   container image. An image is a packaged environment that contains
#   the operating system, Node.js, and your app dependencies.
#
# Who uses this?
#   docker-compose.yml references this file automatically via `build:`.
#   Frontend devs do not usually edit this.
# -----------------------------------------------------------------------------

# Use the official Node.js LTS image as the base.
# `alpine` is a very small Linux distro, so the image stays lightweight.
FROM node:20-alpine

# Set the working directory inside the container.
# All commands after this run inside /app.
WORKDIR /app

# Copy only the package files first.
# Docker caches each layer: if package.json/package-lock.json do not change,
# Docker reuses the cached `npm install` layer and builds much faster.
COPY package.json package-lock.json ./

# Install project dependencies.
# `ci` is preferred in Docker because it installs exactly what is in
# package-lock.json, making builds reproducible.
RUN npm ci

# Copy the rest of the source code into the image.
# In development, docker-compose.yml overrides this with a bind mount so
# live code changes are reflected immediately.
COPY . .

# Vite's default dev server port.
# This does not publish the port by itself; docker-compose.yml maps it
# to the host with `ports:`.
EXPOSE 5173

# Default command: start the Vite dev server and listen on all interfaces.
# docker-compose.yml overrides this to add the bind mount and hot reload.
CMD ["npm", "run", "dev", "--", "--host"]
