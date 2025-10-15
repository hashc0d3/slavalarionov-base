#!/bin/bash

echo "🚀 Запуск Watch Configurator..."
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Запуск PostgreSQL через Docker
echo -e "${BLUE}📦 Запуск PostgreSQL в Docker...${NC}"
docker-compose up -d postgres

# Ждем пока PostgreSQL запустится
echo -e "${YELLOW}⏳ Ожидание запуска PostgreSQL...${NC}"
sleep 5

# Проверка что PostgreSQL запустился
docker-compose ps | grep postgres | grep Up > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PostgreSQL запущен${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL не запустился, проверьте docker-compose logs postgres${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Настройка переменных окружения...${NC}"

# Создаем .env файлы если их нет
if [ ! -f cms/.env ]; then
    echo "DATABASE_URI=postgresql://watchuser:watchpass@localhost:5432/watch_configurator
PAYLOAD_SECRET=watch-configurator-secret-key-2025
PORT=3001" > cms/.env
    echo -e "${GREEN}✅ Создан cms/.env${NC}"
fi

if [ ! -f backend/.env ]; then
    echo "CMS_API_URL=http://localhost:3001/api
PORT=3002" > backend/.env
    echo -e "${GREEN}✅ Создан backend/.env${NC}"
fi

if [ ! -f frontend/.env.local ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:3002" > frontend/.env.local
    echo -e "${GREEN}✅ Создан frontend/.env.local${NC}"
fi

echo ""
echo -e "${BLUE}📝 Информация о сервисах:${NC}"
echo ""
echo -e "${GREEN}CMS:${NC}      http://localhost:3001/admin"
echo -e "${GREEN}Backend:${NC}  http://localhost:3002"
echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}Config:${NC}   http://localhost:3000/configurator"
echo ""
echo -e "${YELLOW}📌 Для запуска сервисов откройте 3 терминала:${NC}"
echo ""
echo -e "${BLUE}Терминал 1 (CMS):${NC}"
echo "  cd /Users/user/slava-larionov/site-base/cms && npm run dev"
echo ""
echo -e "${BLUE}Терминал 2 (Backend):${NC}"
echo "  cd /Users/user/slava-larionov/site-base/backend && npm run start:dev"
echo ""
echo -e "${BLUE}Терминал 3 (Frontend):${NC}"
echo "  cd /Users/user/slava-larionov/site-base/frontend && npm run dev"
echo ""
echo -e "${YELLOW}💡 Первый запуск:${NC}"
echo "  1. Откройте http://localhost:3001/admin"
echo "  2. Создайте администратора"
echo "  3. Добавьте данные (см. cms/seed-data.md)"
echo ""

