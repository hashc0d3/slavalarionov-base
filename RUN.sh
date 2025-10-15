#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Запуск Watch Configurator с интегрированным фронтендом${NC}"
echo ""

# 1. Проверка PostgreSQL
echo -e "${BLUE}📦 Проверка PostgreSQL...${NC}"
docker ps | grep watch-configurator-db | grep Up > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PostgreSQL уже запущен${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL не запущен. Запускаю...${NC}"
    docker-compose up -d postgres
    sleep 5
    echo -e "${GREEN}✅ PostgreSQL запущен${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Запуск CMS (Payload) в фоне...${NC}"
cd cms && npm run dev > /tmp/cms.log 2>&1 &
CMS_PID=$!
echo -e "${GREEN}✅ CMS запущен (PID: $CMS_PID)${NC}"

# Ждем пока CMS запустится
sleep 8

echo ""
echo -e "${BLUE}🚀 Запуск Backend (с интегрированным Frontend)...${NC}"
echo -e "${YELLOW}📝 Backend будет запущен в текущем терминале${NC}"
echo -e "${YELLOW}📝 Для остановки нажмите Ctrl+C${NC}"
echo ""
echo -e "${GREEN}📍 Доступные URL:${NC}"
echo -e "  ${GREEN}CMS Admin:${NC}     http://localhost:3001/admin"
echo -e "  ${GREEN}Backend API:${NC}   http://localhost:3002"
echo -e "  ${GREEN}Frontend:${NC}      http://localhost:3002 (через backend)"
echo -e "  ${GREEN}Configurator:${NC}  http://localhost:3002/configurator"
echo ""
echo -e "${YELLOW}⏳ Запуск Backend через 2 секунды...${NC}"
sleep 2

cd ../backend && npm run start:dev

