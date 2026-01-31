#!/bin/bash

# Локальный запуск проекта в режиме PROD с наполнением из bd.json
# Использование: ./setup-prod-local.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Развёртывание проекта локально (режим PROD) с данными из bd.json"
echo ""

# Проверка Docker
if ! command -v docker &>/dev/null; then
    echo "❌ Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

if ! docker compose version &>/dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose и попробуйте снова."
    exit 1
fi

# Проверка bd.json
if [ ! -f "bd.json" ]; then
    echo "❌ Файл bd.json не найден в корне проекта."
    echo "   Убедитесь, что bd.json находится в $SCRIPT_DIR"
    exit 1
fi

echo "📦 Остановка существующих контейнеров..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

echo ""
echo "🔨 Сборка и запуск PROD контейнера..."
docker compose -f docker-compose.prod.yml up -d --build

echo ""
echo "⏳ Ожидание готовности backend (миграции, инициализация БД)..."
sleep 10

CONTAINER="slavalarionov-backend-prod"

echo ""
echo "📂 Копирование bd.json в контейнер..."
docker cp bd.json "$CONTAINER:/app/backend/bd.json"

echo ""
echo "📥 Импорт данных из bd.json (модели часов, ремешки, картинки)..."
echo "   Картинки будут скачаны с сервера в uploads/"
docker exec "$CONTAINER" node prisma/import-backup.js bd.json

echo ""
echo "✅ Готово!"
echo ""
echo "📊 Статус:"
docker compose -f docker-compose.prod.yml ps

echo ""
echo "🌐 Приложение доступно: http://localhost:8082"
echo "   (порт 8082 — как на проде, куда стучится nginx)"
echo ""
echo "📋 Логи: docker compose -f docker-compose.prod.yml logs -f backend-prod"
echo "🛑 Остановка: docker compose -f docker-compose.prod.yml down"
echo ""
