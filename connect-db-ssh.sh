#!/bin/bash

# Скрипт для подключения к базе данных на сервере через SSH
# Использование: ./connect-db-ssh.sh [dev|prod] [server_user@server_host]

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

echo "🔌 Подключение к контейнеру ${CONTAINER_NAME} на сервере ${SERVER}..."
echo ""
echo "Доступные команды:"
echo "  sqlite3 /app/backend/prisma/${ENV}.db  - открыть базу данных"
echo "  npx prisma studio                      - запустить Prisma Studio"
echo "  exit                                   - выйти"
echo ""

# Подключаемся к контейнеру через SSH
ssh -t "$SERVER" "docker exec -it ${CONTAINER_NAME} sh"
