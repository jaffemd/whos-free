# Multi-stage Dockerfile for production deployment
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../shared/package*.json ../shared/
RUN npm ci --only=production

# Build the application
FROM base AS builder
WORKDIR /app

# Copy source code
COPY . .
COPY ../shared ../shared

# Install all dependencies and build
RUN npm ci
RUN cd ../shared && npm ci && npm run build
RUN cd /app && npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

USER nodejs

EXPOSE 10000

ENV PORT=10000

CMD ["npm", "start"]