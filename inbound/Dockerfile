FROM node:18-slim

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose the port that the application runs on
ENV PORT 8080
EXPOSE 8080

# Start the application
CMD ["node", "index.js"]
