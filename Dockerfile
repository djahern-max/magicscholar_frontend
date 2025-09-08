# Simple Next.js Dockerfile
FROM node:22-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_IMAGE_CDN
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_IMAGE_CDN=$NEXT_PUBLIC_IMAGE_CDN
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN npm run build

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Change ownership - including the standalone server
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3000

# Use the standalone server instead of npm start
CMD ["node", ".next/standalone/server.js"]
