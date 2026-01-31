#!/bin/bash

# Скрипт для синхронизации базы данных с сервера
# Использование: ./sync-db-from-server.sh [dev|prod] [server_user@server_host]

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
LOCAL_DB_PATH="./backend/prisma/${ENV}.db"
BACKUP_PATH="./backend/prisma/${ENV}.db.backup"

echo "🔄 Синхронизация базы данных ${ENV} с сервера ${SERVER}..."

# Создаем резервную копию локальной базы
if [ -f "$LOCAL_DB_PATH" ]; then
    echo "💾 Создание резервной копии локальной базы..."
    cp "$LOCAL_DB_PATH" "$BACKUP_PATH"
    echo "✅ Резервная копия создана: ${BACKUP_PATH}"
fi

# Копируем базу с сервера
echo "📥 Копирование базы данных с сервера..."

# Пробуем скопировать из контейнера
ssh "$SERVER" "docker cp ${CONTAINER_NAME}:${DB_PATH} /tmp/${ENV}.db" 2>/dev/null || {
    echo "⚠️  Не удалось скопировать из контейнера, пробуем найти volume..."
    # Пробуем найти volume
    VOLUME_NAME="slavalarionov-base_backend_db_${ENV}"
    ssh "$SERVER" "docker run --rm -v ${VOLUME_NAME}:/data -v /tmp:/output alpine sh -c 'cp /data/${ENV}.db /output/${ENV}.db 2>/dev/null || find /data -name \"*.db\" -exec cp {} /output/${ENV}.db \\;'"
}

# Скачиваем файл
scp "${SERVER}:/tmp/${ENV}.db" "$LOCAL_DB_PATH" || {
    echo "❌ Не удалось скачать базу данных"
    if [ -f "$BACKUP_PATH" ]; then
        echo "🔄 Восстанавливаем резервную копию..."
        mv "$BACKUP_PATH" "$LOCAL_DB_PATH"
    fi
    exit 1
}

# Очищаем временный файл на сервере
ssh "$SERVER" "rm -f /tmp/${ENV}.db"

echo "✅ База данных синхронизирована: ${LOCAL_DB_PATH}"
echo ""
echo "📊 Для просмотра данных используйте:"
echo "   sqlite3 ${LOCAL_DB_PATH}"
echo ""
echo "🔧 Или используйте Prisma Studio:"
echo "   cd backend && DATABASE_URL=\"file:./prisma/${ENV}.db\" npx prisma studio"
