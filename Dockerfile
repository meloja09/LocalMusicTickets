# Use the official Node.js 20 image as a parent image
FROM node:20-alpine

# Install essential build tools and dependencies
RUN apk add --no-cache python3 make g++ git

# Set the working directory in the container
WORKDIR /app

# Copy package files first (for better caching)
COPY package.json package-lock.json* ./

# Install all dependencies including development dependencies
# Using --legacy-peer-deps to avoid issues with potential dependency conflicts
RUN npm install --include=dev --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the client and server
# Using explicit environment variable setup for build predictability
RUN NODE_ENV=production \
    npm run build

# Expose port 5000 for the application
EXPOSE 5000

# Define the command to run the application in production mode
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]