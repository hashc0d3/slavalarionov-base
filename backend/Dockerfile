FROM node:20 AS build

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Disable Next.js telemetry for faster builds
ENV NEXT_TELEMETRY_DISABLED=1
# Optimize npm install
ENV NPM_CONFIG_PREFER_OFFLINE=true
ENV NPM_CONFIG_AUDIT=false
ENV NPM_CONFIG_FUND=false

# Install backend dependencies (with dev deps for build)
COPY backend/package.json backend/package-lock.json ./backend/
# Prisma schema нужна уже на этапе установки (postinstall → prisma generate)
COPY backend/prisma ./backend/prisma
RUN --mount=type=cache,target=/root/.npm \
    cd backend && npm ci --prefer-offline --no-audit

# Install frontend dependencies (with dev deps for build)
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN --mount=type=cache,target=/root/.npm \
    cd frontend && npm ci --prefer-offline --no-audit

# Copy source code
COPY backend ./backend
COPY frontend ./frontend

# Build backend (NestJS + Prisma)
RUN cd backend && npm run build

# Build frontend (Next.js) for production
RUN cd frontend && npm run build

# Remove devDependencies to keep runtime image slim
RUN cd backend && npm prune --omit=dev
RUN cd frontend && npm prune --omit=dev

FROM node:20 AS runner

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=8081

# Copy backend artifacts
COPY --from=build /app/backend/package.json /app/backend/package-lock.json ./
COPY --from=build /app/backend/node_modules ./node_modules
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/prisma ./prisma
COPY --from=build /app/backend/uploads ./uploads

# Copy frontend build needed for Next middleware
COPY --from=build /app/frontend /app/frontend

EXPOSE 8081

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]

