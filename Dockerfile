# Multi-stage Dockerfile for Vite + React (TypeScript) app
# Stage 1: Build the application
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies (copy package files first for caching)
COPY package.json package-lock.json* ./

# If you use pnpm or yarn, adjust accordingly (this repo uses npm by default)
RUN npm ci --silent

# Copy source
COPY . .

# Build the Vite app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy built assets from builder
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default nginx conf with our SPA-friendly config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
