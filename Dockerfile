# Use the official Node.js 20 image as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies including development dependencies which include Vite
RUN npm install --include=dev

# Copy the rest of the application
COPY . .

# Build the client with explicit access to node_modules binaries
RUN NODE_ENV=production npx vite build

# Expose port 5000 for the application
EXPOSE 5000

# Define the command to run the application
CMD ["npm", "run", "start"]