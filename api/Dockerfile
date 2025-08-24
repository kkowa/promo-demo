# Pining same version for stability
FROM node:22.18.0-alpine3.22 AS base

# Specifing working directory other than /
WORKDIR /usr/src/app

# Copping only files required to install
# dependencies for better layer caching
COPY package*.json ./

FROM base as dev

RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm install

COPY . .

CMD ["npm", "run", "dev"]

FROM base AS build
# Install ALL deps (incl. dev) for TypeScript compile
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# Copy only what’s needed to build (faster cache; bring tsconfig, src)
COPY tsconfig*.json ./
COPY src ./src
# Compile to dist/ (assumes: "build": "tsc")
RUN npm run build

FROM base as production

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Install ONLY production deps
COPY package*.json ./
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci --omit=dev

# Copy compiled JS, not TS sources
COPY --from=build /usr/src/app/dist ./dist


# Copy the healthcheck script - To be created
# COPY --chown=node:node ./healthcheck/ .

# Copy remaining source code AFTER installing dependencies. 
# Again, copy only the necessary files
COPY --chown=node:node ./src/ .

# Drop privileges
USER node

# App port
EXPOSE 3000

# Start compiled server (adjust if your entry differs)
CMD ["node", "dist/server.js"]
