# ---- Stage 1: Install ALL dependencies (including dev for build) ----
FROM node:22-alpine AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.15.1 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Stage 2: Build ----
FROM deps AS builder
WORKDIR /app

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm next build

# ---- Stage 3: Production runner ----
FROM node:22-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy production dependencies only
COPY --from=deps /app/node_modules ./node_modules
# Copy build output and source
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/jsconfig.json ./

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "node_modules/.bin/next", "start"]
