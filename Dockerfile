# Stage 1: Build the application
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy dependency definition files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
# Replace 'build' with your actual build script if different (e.g., 'export', 'generate')
RUN pnpm build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy built assets from the builder stage
# Adjust '/app/dist' if your build output directory is different (e.g., /app/build, /app/out, /app/.next)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"] 