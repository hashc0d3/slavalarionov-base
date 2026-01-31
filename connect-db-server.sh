#!/bin/bash

# Скрипт для подключения к базе данных на сервере
# Использование: ./connect-db-server.sh [dev|prod] [server_user@server_host]

set -e

ENV=${1:-dev}
SERVER=${2:-""}

if [ -z "$SERVER" ]; then
    echo "❌ Укажите сервер для подключения"
    echo "Использование: $0 [dev|prod] user@server"
    echo "Пример: $0 dev user@example.com"
    exit 1
fi

CONTAINER_NAME="slavalarionov-backend-${ENV}"
DB_PATH="/app/backend/prisma/${ENV}.db"
LOCAL_DB_PATH="./backend/prisma/${ENV}_server.db"

echo "🔌 Подключение к базе данных ${ENV} на сервере ${SERVER}..."

# Вариант 1: Скопировать базу данных с сервера
echo "📥 Копирование базы данных с сервера..."
ssh "$SERVER" "docker cp ${CONTAINER_NAME}:${DB_PATH} /tmp/${ENV}.db" || {
    echo "⚠️  Не удалось скопировать из контейнера, пробуем найти volume..."
    # Пробуем найти volume и скопировать оттуда
    VOLUME_NAME="slavalarionov-base_backend_db_${ENV}"
    ssh "$SERVER" "docker run --rm -v ${VOLUME_NAME}:/data -v /tmp:/output alpine sh -c 'cp /data/${ENV}.db /output/${ENV}.db 2>/dev/null || echo \"File not found\"'"
}

# Скачиваем файл
scp "${SERVER}:/tmp/${ENV}.db" "$LOCAL_DB_PATH" || {
    echo "❌ Не удалось скачать базу данных"
    exit 1
}

echo "✅ База данных скопирована в ${LOCAL_DB_PATH}"
echo ""
echo "📊 Для просмотра данных используйте:"
echo "   sqlite3 ${LOCAL_DB_PATH}"
echo ""
echo "🔧 Или используйте Prisma Studio:"
echo "   cd backend && DATABASE_URL=\"file:./prisma/${ENV}_server.db\" npx prisma studio"
