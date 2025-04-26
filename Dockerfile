FROM node:20-slim AS builder

# Install OpenSSL and other required dependencies
RUN apt-get update -y && apt-get install -y openssl

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Install dependencies including Prisma
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code and prisma schema
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Production image
FROM node:20-slim

# Install OpenSSL in production image as well
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy built application
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]