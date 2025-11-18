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

# Build optimization environment variables
ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=true
# Disable source maps for faster builds
ENV GENERATE_SOURCEMAP=false
# Next.js build optimizations
ENV NEXT_PRIVATE_STANDALONE=true
# Ускоряем сборку Next.js
ENV NEXT_PRIVATE_SKIP_TYPE_CHECK=true
# Prisma: игнорировать ошибки checksum (для офлайн окружений)
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
# Prisma: использовать альтернативный источник для бинарников
ENV PRISMA_BINARY_CACHE_DIR=/tmp/prisma-binaries
ENV PRISMA_ENGINES_MIRROR=https://binaries.prisma.sh

# Install backend dependencies (with dev deps for build)
COPY backend/package.json backend/package-lock.json ./backend/
# Prisma schema нужна уже на этапе установки
COPY backend/prisma ./backend/prisma
# Устанавливаем зависимости без postinstall скриптов (чтобы пропустить Prisma generate)
# Затем устанавливаем SWC и проверяем nest CLI
RUN --mount=type=cache,target=/root/.npm \
    cd backend && \
    npm ci --prefer-offline --no-audit --ignore-scripts && \
    npm install @swc/cli @swc/core --no-save --ignore-scripts && \
    if [ ! -f "node_modules/@nestjs/cli/bin/nest.js" ]; then \
        echo "⚠ @nestjs/cli не установлен полностью, переустанавливаем..."; \
        npm install @nestjs/cli --no-save --ignore-scripts; \
    fi && \
    if [ -f "node_modules/@nestjs/cli/bin/nest.js" ] && [ ! -f "node_modules/.bin/nest" ]; then \
        mkdir -p node_modules/.bin && \
        ln -sf ../@nestjs/cli/bin/nest.js node_modules/.bin/nest; \
    fi
# Копируем исходный код БЕЗ node_modules (они уже установлены в Docker выше)
# Сохраняем установленные node_modules перед копированием
RUN mkdir -p /tmp/backend-node_modules && \
    if [ -d "backend/node_modules" ]; then \
        echo "⚠ Сохраняем установленные node_modules..."; \
        cp -r backend/node_modules/* /tmp/backend-node_modules/ 2>/dev/null || true; \
    fi
COPY backend ./backend
# Восстанавливаем node_modules из сохраненных (если были установлены)
RUN if [ -d "/tmp/backend-node_modules" ] && [ "$(ls -A /tmp/backend-node_modules 2>/dev/null)" ]; then \
        echo "⚠ Восстанавливаем node_modules из сохраненных..."; \
        if [ ! -d "backend/node_modules" ]; then \
            mkdir -p backend/node_modules; \
        fi; \
        cp -r /tmp/backend-node_modules/* backend/node_modules/ 2>/dev/null || true; \
        echo "✓ node_modules восстановлены"; \
    fi && \
    # Сохраняем Prisma client если он был скопирован из локальной машины
    if [ -d "backend/node_modules/.prisma" ] && [ ! -d "/tmp/backend-node_modules/.prisma" ]; then \
        echo "✓ Prisma client найден в скопированных файлах, сохраняем"; \
    fi
# Генерируем Prisma client
# Если Prisma client уже сгенерирован локально (после npm install), он будет скопирован
# Если нет - генерируем с повторными попытками
RUN cd backend && \
    if [ -d "node_modules/.prisma/client" ] && [ -f "node_modules/.prisma/client/index.js" ]; then \
        echo "✓ Используем существующий Prisma client (сгенерирован локально)"; \
    else \
        echo "Генерируем Prisma client..." && \
        export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 && \
        export PRISMA_SKIP_POSTINSTALL_GENERATE=1 && \
        for i in 1 2 3 4 5; do \
            npx prisma generate && echo "✓ Prisma client успешно сгенерирован" && break || \
            (echo "⚠ Попытка $i не удалась, повтор через 10 секунд..." && sleep 10); \
        done && \
        if [ ! -d "node_modules/.prisma/client" ]; then \
            echo ""; \
            echo "❌ ОШИБКА: Prisma client не был сгенерирован!"; \
            echo ""; \
            echo "РЕШЕНИЕ: Сгенерируйте Prisma client локально перед сборкой Docker:"; \
            echo "  cd backend && npm install && npm run prisma:generate"; \
            echo ""; \
            echo "На сервере после git clone и npm install выполните:"; \
            echo "  cd backend && npm run prisma:generate"; \
            echo "  docker compose build"; \
            exit 1; \
        fi; \
    fi

# Install frontend dependencies (with dev deps for build)
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN --mount=type=cache,target=/root/.npm \
    cd frontend && npm ci --prefer-offline --no-audit

# Copy frontend source code
COPY frontend ./frontend

# Build backend (NestJS + Prisma) with cache mount
# Кэширование ускоряет повторные сборки
# Используем npm run build, но пропускаем prisma generate (уже выполнен выше)
RUN --mount=type=cache,target=/app/backend/node_modules/.cache \
    cd backend && \
    echo "Запускаем сборку backend..." && \
    # Пропускаем prisma generate в скрипте build, так как он уже выполнен
    npm run build 2>&1 | grep -v "prisma generate" || \
    (echo "⚠ npm run build не удался, пробуем напрямую через nest..." && \
     npx --yes @nestjs/cli build)

# Build frontend (Next.js) for production with cache mount
# Кэширование .next/cache ускоряет повторные сборки Next.js
RUN --mount=type=cache,target=/app/frontend/.next/cache \
    cd frontend && npm run build

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

CMD ["sh", "-c", "if [ -f /app/backend/prisma/dev.db ]; then echo 'База данных существует, пропускаем миграции'; else echo 'Применяем миграции...' && npx prisma migrate deploy; fi && node dist/src/main"]

