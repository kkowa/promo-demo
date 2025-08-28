# Pin exact Node for stability
FROM node:22.18.0-alpine AS base
WORKDIR /usr/src/app

# Only copy lock + manifest for better cache
COPY package*.json ./

# ---------- Development ----------
FROM base AS dev
# Reproducible install (dev deps included)
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# Bring in the rest of the source
COPY . .
# Dev command (nodemon will watch files; mount your workspace as a volume)
CMD ["npm", "run", "dev"]

# ---------- Build ----------
FROM base AS build
# Install ALL deps (incl dev) for TypeScript compile
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# Copy only what's needed to build
COPY tsconfig*.json ./
COPY src ./src
# Compile to dist/
RUN npm run build

# ---------- Production ----------
FROM node:22.18.0-alpine AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Install ONLY production deps
COPY package*.json ./
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci --omit=dev

# Copy compiled output only (no TS sources)
COPY --from=build /usr/src/app/dist ./dist

# Drop privileges
USER node

EXPOSE 3000
# Start compiled server
CMD ["node", "dist/server.js"]
