#!/bin/bash

# Скрипт для развертывания DEV окружения

set -e

echo "🚀 Развертывание DEV окружения (sl.cdn1.dev)..."

cd "$(dirname "$0")"

# Остановить существующий контейнер, если запущен
echo "📦 Остановка существующих контейнеров..."
docker compose -f docker-compose.dev.yml down 2>/dev/null || true
docker stop slavalarionov-backend-dev 2>/dev/null || true
docker stop slavalarionov-backend 2>/dev/null || true

# Освободить порт 8081, если занят
if sudo lsof -ti:8081 >/dev/null 2>&1; then
    echo "🔍 Освобождение порта 8081..."
    sudo fuser -k 8081/tcp 2>/dev/null || true
    sleep 2
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

# Собрать и запустить
echo "🔨 Сборка и запуск DEV контейнера..."
docker compose -f docker-compose.dev.yml up -d --build

# Показать статус
echo ""
echo "✅ DEV окружение развернуто!"
echo ""
echo "📊 Статус контейнеров:"
docker compose -f docker-compose.dev.yml ps

echo ""
echo "📋 Логи (последние 20 строк):"
docker compose -f docker-compose.dev.yml logs --tail 20 backend-dev

echo ""
echo "🌐 DEV доступен по адресу: https://sl.cdn1.dev"
echo "📝 Для просмотра логов: docker compose -f docker-compose.dev.yml logs -f backend-dev"


