#!/bin/bash

# Скрипт для развертывания PROD окружения

set -e

echo "🚀 Развертывание PROD окружения (custom.slavalarionov.com)..."

cd "$(dirname "$0")"

# Остановить существующий контейнер, если запущен
echo "📦 Остановка существующих контейнеров..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true
docker stop slavalarionov-backend-prod 2>/dev/null || true
docker stop slavalarionov-backend 2>/dev/null || true

# Освободить порт 8082, если занят
if sudo lsof -ti:8082 >/dev/null 2>&1; then
    echo "🔍 Освобождение порта 8082..."
    sudo fuser -k 8082/tcp 2>/dev/null || true
    sleep 2
fi

# Подгрузить backend/.env, чтобы GOOGLE_CLIENT_ID попал в build-arg для фронта (NEXT_PUBLIC_GOOGLE_CLIENT_ID)
if [ -f backend/.env ]; then
    set -a
    # shellcheck source=/dev/null
    source backend/.env
    set +a
fi

# Обновить код (если используется git)
if [ -d .git ]; then
    echo "📥 Обновление кода из репозитория..."
    # Сохранить локальные изменения в скриптах деплоя, если есть
    if git status --porcelain | grep -q "deploy.*\.sh"; then
        echo "💾 Сохранение локальных изменений в скриптах деплоя..."
        git stash push -m "Auto-stash deploy scripts before pull" deploy-*.sh 2>/dev/null || true
    fi
    git pull || echo "⚠️  Не удалось обновить код (возможно, не используется git)"
fi

# Собрать и запустить (при --no-cache очищаем кэш и собираем без кэша — помогает при ошибке "parent snapshot does not exist")
if [ "$1" = "--no-cache" ]; then
    echo "🧹 Очистка кэша сборки Docker..."
    docker builder prune -af 2>/dev/null || true
    echo "🔨 Сборка без кэша и запуск PROD контейнера..."
    docker compose -f docker-compose.prod.yml build --no-cache
    docker compose -f docker-compose.prod.yml up -d
else
    echo "🔨 Сборка и запуск PROD контейнера..."
    docker compose -f docker-compose.prod.yml up -d --build
fi

# Показать статус
echo ""
echo "✅ PROD окружение развернуто!"
echo ""
echo "📊 Статус контейнеров:"
docker compose -f docker-compose.prod.yml ps

echo ""
echo "📋 Логи (последние 20 строк):"
docker compose -f docker-compose.prod.yml logs --tail 20 backend-prod

echo ""
echo "🌐 PROD доступен по адресу: https://custom.slavalarionov.com"
echo "📝 Для просмотра логов: docker compose -f docker-compose.prod.yml logs -f backend-prod"


