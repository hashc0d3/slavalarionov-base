#!/bin/bash

# Скрипт для развертывания PROD окружения

set -e

echo "🚀 Развертывание PROD окружения (custom.slavalarionov.com)..."

cd "$(dirname "$0")"

# Остановить существующий контейнер, если запущен
echo "📦 Остановка существующих контейнеров..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

# Обновить код (если используется git)
if [ -d .git ]; then
    echo "📥 Обновление кода из репозитория..."
    git pull || echo "⚠️  Не удалось обновить код (возможно, не используется git)"
fi

# Собрать и запустить
echo "🔨 Сборка и запуск PROD контейнера..."
docker compose -f docker-compose.prod.yml up -d --build

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


