# Next.js + NestJS Middleware Monorepo

## Описание

Монорепозиторий с фронтендом на Next.js и бэкендом на NestJS, объединёнными через middleware.  
Фронт и бэкенд разделены по папкам `frontend` и `backend`.

## Структура

- `frontend/` — Next.js приложение (React)
- `backend/` — NestJS сервер (API + middleware для Next.js)

## Запуск

1. Установить зависимости:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Запустить backend (NestJS + Next.js):
   ```bash
   cd backend
   npm run start:dev
   ```

3. Открыть [http://localhost:3000](http://localhost:3000) — фронт и API работают на одном порту.

## Основные команды

- `npm run start:dev` — запуск backend с hot-reload
- `npm run build` — сборка backend
- `npm run start` — запуск backend в production-режиме

## Прокси API

- Все запросы к `/api/*` обрабатываются NestJS-контроллерами.
- Остальные запросы обслуживаются Next.js.

## Примечания

- Папка `.idea` и артефакты сборки не должны попадать в git (см. `.gitignore`).
- Для разработки фронта и бэкенда используются отдельные `tsconfig.json` и `package.json`.
- Проект использует Next.js 14 и React 18 для совместимости с custom server API.
- Конфигурация Next.js должна быть в формате `.mjs` (не `.ts`).
