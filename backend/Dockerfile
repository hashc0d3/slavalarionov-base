FROM node:20 AS build

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Build optimization environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NPM_CONFIG_PREFER_OFFLINE=true
ENV NPM_CONFIG_AUDIT=false
ENV NPM_CONFIG_FUND=false
# НЕ устанавливаем NODE_ENV=production на этапе сборки, иначе devDependencies не установятся
# ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=true
ENV GENERATE_SOURCEMAP=false
ENV NEXT_PRIVATE_STANDALONE=true
ENV NEXT_PRIVATE_SKIP_TYPE_CHECK=true
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# ============================================
# ШАГ 1: Установка frontend зависимостей
# ============================================
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN --mount=type=cache,target=/root/.npm \
    cd frontend && \
    npm ci --prefer-offline --no-audit --include=dev

# ============================================
# ШАГ 2: Установка backend зависимостей
# ============================================
COPY backend/package.json backend/package-lock.json ./backend/
COPY backend/prisma ./backend/prisma
RUN --mount=type=cache,target=/root/.npm \
    cd backend && \
    # Отключаем postinstall для Prisma (будет сгенерирован позже)
    # Убеждаемся что devDependencies установлены (нужны для сборки)
    export PRISMA_SKIP_POSTINSTALL_GENERATE=1 && \
    npm ci --prefer-offline --no-audit --include=dev

# ============================================
# ШАГ 3: Копирование исходного кода
# ============================================
COPY frontend ./frontend
COPY backend ./backend

# ============================================
# ШАГ 4: Генерация Prisma Client
# ============================================
RUN cd backend && \
    npx prisma generate

# ============================================
# ШАГ 5: Сборка frontend (Next.js)
# ============================================
RUN --mount=type=cache,target=/app/frontend/.next/cache \
    cd frontend && \
    npm run build

# ============================================
# ШАГ 6: Сборка backend (NestJS)
# ============================================
RUN --mount=type=cache,target=/app/backend/node_modules/.cache \
    cd backend && \
    # Prisma уже сгенерирован на шаге 4, поэтому пропускаем prisma generate
    # Используем прямой вызов nest build через npx или node
    echo "Запускаем сборку NestJS..." && \
    node node_modules/@nestjs/cli/bin/nest.js build

# ============================================
# ШАГ 7: Очистка dev зависимостей
# ============================================
RUN cd backend && npm prune --omit=dev
RUN cd frontend && npm prune --omit=dev

# ============================================
# Production stage
# ============================================
FROM node:20 AS runner

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=8081

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy backend runtime files
COPY --from=build /app/backend/package.json /app/backend/package-lock.json ./
COPY --from=build /app/backend/node_modules ./node_modules
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/prisma ./prisma
COPY --from=build /app/backend/scripts ./scripts
# next.middleware.ts должен быть в dist (скопирован на этапе сборки)

# Copy frontend build (нужен для Next.js middleware)
COPY --from=build /app/frontend /app/frontend

# Create uploads directory
RUN mkdir -p /app/backend/uploads

EXPOSE 8081

# Команда запуска:
# 1. Применяем миграции Prisma (создаёт БД если её нет)
# 2. Инициализируем начальные данные
# 3. Запускаем backend, который работает как middleware для frontend
CMD ["sh", "-c", "echo 'Применяем миграции Prisma...' && npx prisma migrate deploy && echo 'Миграции применены успешно' && echo 'Инициализируем начальные данные...' && node scripts/init-db.js && echo 'Инициализация завершена' || echo 'Предупреждение: ошибка при инициализации БД'; echo 'Запускаем backend...' && node dist/main"]
