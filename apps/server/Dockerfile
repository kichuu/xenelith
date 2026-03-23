FROM oven/bun:1.3 AS base

# Install dependencies + copy source in one stage
FROM base AS builder
WORKDIR /app

# 1. Copy package manifests + prisma schema for install
COPY package.json bun.lock ./
COPY apps/server/package.json apps/server/
COPY apps/web/package.json apps/web/
COPY packages/config/package.json packages/config/
COPY packages/db/package.json packages/db/
COPY packages/db/prisma packages/db/prisma
COPY packages/db/prisma.config.ts packages/db/
COPY packages/env/package.json packages/env/
COPY packages/infra/package.json packages/infra/
COPY packages/ui/package.json packages/ui/

# 2. Install with dummy DATABASE_URL for prisma postinstall
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN bun install --frozen-lockfile

# 3. Now copy all source code (node_modules already exists, .dockerignore skips host node_modules)
COPY apps/server apps/server
COPY packages packages

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy everything from builder (node_modules + source together)
COPY --from=builder /app /app

EXPOSE 3000
CMD ["bun", "run", "apps/server/src/index.ts"]
