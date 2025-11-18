#!/bin/bash

set -e

echo "🚀 Запуск проекта через Docker Compose..."

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

# Проверяем наличие docker compose
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose и попробуйте снова."
    exit 1
fi

# Если это первый запуск, устанавливаем зависимости и генерируем Prisma client (опционально)
if [ ! -d "backend/node_modules/.prisma/client" ]; then
    echo "📦 Генерируем Prisma client (опционально, для ускорения сборки)..."
    if command -v npm &> /dev/null && [ -d "backend" ]; then
        cd backend 2>/dev/null && npm install 2>/dev/null && npm run prisma:generate 2>/dev/null && cd .. 2>/dev/null || true
        echo "✓ Prisma client готов (если npm доступен)"
    fi
fi

# Запускаем Docker Compose
echo "🐳 Собираем и запускаем контейнеры..."
docker compose up -d --build

echo ""
echo "⏳ Ожидаем запуск сервера..."
sleep 5

echo ""
echo "✅ Проект запущен!"
echo ""
echo "📊 Статус контейнеров:"
docker compose ps

echo ""
echo "📝 Последние логи:"
docker compose logs --tail=10 backend

echo ""
echo "🌐 Приложение доступно по адресу: http://localhost:8081"
echo "📋 Для просмотра логов: docker compose logs -f backend"
echo ""

