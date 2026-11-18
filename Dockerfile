# Stage 1: Build Frontend Client
FROM node:20-alpine AS build

WORKDIR /app

# Copy package definitions
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN npm install --prefix client

# Copy application source code
COPY . .

# Build the production frontend into client/dist
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS production

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy package files and install only production dependencies for server
COPY package*.json ./
RUN npm install --omit=dev

# Copy server code
COPY server ./server

# Copy built frontend assets from the build stage
COPY --from=build /app/client/dist ./client/dist

# Expose server port
EXPOSE 3000

# Start server
CMD ["node", "server/index.js"]
