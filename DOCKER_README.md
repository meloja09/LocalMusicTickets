# Docker Setup for Concert Ticket Booking Application

This document provides instructions for running the Concert Ticket Booking application using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

## Docker Files Overview

This project includes several Docker-related files:

1. `Dockerfile` - Main configuration for building the production image
2. `Dockerfile.dev` - Configuration for development environment
3. `docker-compose.yml` - Compose file for production deployment
4. `docker-compose.dev.yml` - Compose file for development
5. `.dockerignore` - Specifies which files should be excluded from the Docker image

## Running in Production Mode

To build and run the application in production mode:

```bash
# Build and start the container
docker-compose up

# Run in detached mode (background)
docker-compose up -d

# Stop the container
docker-compose down
```

This will:
- Build the Docker image according to the Dockerfile
- Install all dependencies
- Build the client and server for production
- Start the application on port 5000

## Running in Development Mode

For development with hot-reloading:

```bash
# Build and start the development container
docker-compose -f docker-compose.dev.yml up

# Run in detached mode
docker-compose -f docker-compose.dev.yml up -d

# Stop the container
docker-compose -f docker-compose.dev.yml down
```

This setup:
- Mounts your local directory to the container, enabling hot-reloading
- Runs the application in development mode
- Preserves node_modules in a Docker volume

## Accessing the Application

Once running, the application is available at:

- http://localhost:5000

## Docker Image Details

The production Docker image:
- Uses Node.js 20 Alpine as the base
- Optimizes for smaller image size and security
- Properly builds both client and server components
- Includes health checks
- Has proper restart policies

## Troubleshooting

### Missing package.json

If you encounter an error like `no file or directory '/home/user/package.json'`:
- Ensure you're running the docker commands from the directory containing package.json
- Check that your Dockerfile properly sets the working directory

### Container not starting

Run `docker logs <container_id>` to view the application logs.

## Architecture Notes

This Docker setup follows best practices:
- Multi-stage builds for efficiency
- Proper separation of development and production environments
- Volume mounts for hot-reloading in development
- Health checks for container monitoring
- Security considerations through minimal base images