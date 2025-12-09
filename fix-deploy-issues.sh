#!/bin/bash

# Скрипт для решения проблем при деплое

echo "🔧 Решение проблем при деплое..."

cd /opt/slavalarionov-base

# 1. Сохранить локальные изменения в скриптах (stash)
echo "📦 Сохранение локальных изменений..."
git stash push -m "Local changes to deploy scripts" deploy-both.sh deploy-dev.sh deploy-prod.sh 2>/dev/null || true

# 2. Обновить код
echo "📥 Обновление кода из репозитория..."
git pull

# 3. Найти и остановить процесс на порту 8081
echo "🔍 Поиск процесса на порту 8081..."
PID=$(sudo lsof -ti:8081 2>/dev/null || sudo fuser 8081/tcp 2>/dev/null | awk '{print $2}' || echo "")

if [ ! -z "$PID" ]; then
    echo "🛑 Остановка процесса $PID на порту 8081..."
    sudo kill -9 $PID 2>/dev/null || true
    sleep 2
fi

# 4. Остановить все контейнеры, которые могут использовать порт
echo "🛑 Остановка всех контейнеров..."
docker compose -f docker-compose.dev.yml down 2>/dev/null || true
docker compose -f docker-compose.prod.yml down 2>/dev/null || true
docker stop slavalarionov-backend-dev 2>/dev/null || true
docker stop slavalarionov-backend-prod 2>/dev/null || true
docker stop slavalarionov-backend 2>/dev/null || true

# 5. Подождать немного
sleep 2

# 6. Проверить, свободен ли порт
if sudo lsof -ti:8081 >/dev/null 2>&1; then
    echo "⚠️  Порт 8081 все еще занят. Попытка принудительной очистки..."
    sudo fuser -k 8081/tcp 2>/dev/null || true
    sleep 2
fi

# 7. Запустить DEV окружение
echo "🚀 Запуск DEV окружения..."
docker compose -f docker-compose.dev.yml up -d --build

# 8. Показать статус
echo ""
echo "✅ Готово!"
echo ""
echo "📊 Статус контейнеров:"
docker compose -f docker-compose.dev.yml ps

echo ""
echo "📋 Логи (последние 10 строк):"
docker compose -f docker-compose.dev.yml logs --tail 10 backend-dev

