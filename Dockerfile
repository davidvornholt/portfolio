# syntax=docker/dockerfile:1

# ---- deps (all) ----
FROM oven/bun:1.3.14-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/a11y-testing/package.json ./packages/a11y-testing/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
RUN bun install --frozen-lockfile

# ---- build ----
FROM oven/bun:1.3.14-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# ---- deps (production only) ----
FROM oven/bun:1.3.14-alpine AS prod-deps
WORKDIR /app

COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/a11y-testing/package.json ./packages/a11y-testing/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
RUN bun install --frozen-lockfile --production

# ---- runtime ----
FROM oven/bun:1.3.14-alpine AS runner
WORKDIR /app/apps/web

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Minimal HTTP client for HEALTHCHECK probes
RUN apk add --no-cache curl

# Create a non-root user
RUN addgroup -S app && adduser -S app -G app

COPY --chown=app:app --from=prod-deps /app/node_modules /app/node_modules
COPY --chown=app:app --from=builder /app/apps/web/public ./public
COPY --chown=app:app --from=builder /app/apps/web/.next ./.next
COPY --chown=app:app --from=builder /app/apps/web/.velite ./.velite
COPY --chown=app:app --from=builder /app/apps/web/next.config.ts ./next.config.ts
COPY --chown=app:app --from=builder /app/apps/web/package.json ./package.json

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null || exit 1

USER app

CMD ["bun", "run", "start"]
