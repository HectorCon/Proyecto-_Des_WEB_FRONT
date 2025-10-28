# Multi-stage Dockerfile for Vite + React (TypeScript) app - OPTIMIZED
# Stage 1: Build the application
FROM node:18-alpine AS build

# Reduce memory usage for VPS
ENV NODE_OPTIONS=--max-old-space-size=512

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies with optimizations
RUN npm ci --silent --prefer-offline --no-audit --no-fund

# Copy source files
COPY . .

# Build with production optimizations
RUN npm run build && \
    # Clean up node_modules to reduce image size
    rm -rf node_modules && \
    # Remove unnecessary files
    rm -rf src && \
    rm -rf .git && \
    rm -rf *.md && \
    rm -rf .eslintrc* && \
    rm -rf tsconfig*

# Stage 2: Serve with Nginx (ultra minimal)
FROM nginx:alpine

# Copy built assets from builder
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default nginx conf with our optimized config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx files to reduce size
RUN rm -rf /etc/nginx/conf.d/default.conf.template && \
    rm -rf /usr/share/nginx/html/index.html && \
    rm -rf /var/cache/apk/*

EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
