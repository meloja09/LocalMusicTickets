# Use the official Node.js 20 image as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package files first (for better caching)
COPY package.json package-lock.json* ./

# Install all dependencies including development dependencies
RUN npm install --include=dev

# Copy the rest of the application
COPY . .

# Build the client and server
RUN NODE_ENV=production npx vite build && \
    npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Expose port 5000 for the application
EXPOSE 5000

# Define the command to run the application
CMD ["node", "dist/index.js"]