# --- Stage 1: Build & Compile ---
FROM node:20-slim AS builder
WORKDIR /app

# Install Python and build tools required by node-gyp for TensorFlow C++ bindings
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Install all dependencies (this will now compile @tensorflow/tfjs-node successfully)
RUN npm install

# --- Stage 2: Production Run ---
FROM node:20-slim
WORKDIR /app

# Copy only the compiled node_modules and your project files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Fix: Ensure you use uniform double quotes for the CMD array
EXPOSE 5000
CMD [ "node", "server.js" ]
