# Watch Configurator - Полная система с CMS

Конфигуратор ремешков для Apple Watch с интеграцией Payload CMS для управления контентом.

## 🏗 Архитектура

```
Frontend (Next.js) → Backend (NestJS) → Payload CMS → MongoDB
    :3000                :3002            :3001
```

## 📁 Структура проекта

```
site-base/
├── frontend/          # Next.js - пользовательский интерфейс
├── backend/           # NestJS - API сервер
├── cms/              # Payload CMS - управление контентом
├── custom/           # Legacy Nuxt приложение
├── INTEGRATION.md    # Подробная документация по интеграции
├── ENV_SETUP.md      # Настройка переменных окружения
└── README.md         # Этот файл
```

## 🚀 Быстрый старт

### 1. Установка MongoDB

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# или используйте Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 2. Настройка переменных окружения

Создайте файлы `.env` (см. `ENV_SETUP.md` для деталей):

```bash
# CMS
echo "DATABASE_URI=mongodb://localhost:27017/watch-configurator
PAYLOAD_SECRET=watch-configurator-secret-key-2025
PORT=3001" > cms/.env

# Backend
echo "CMS_API_URL=http://localhost:3001/api
PORT=3002" > backend/.env

# Frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3002" > frontend/.env.local
```

### 3. Установка зависимостей

```bash
# Установить все зависимости
npm install          # корневые зависимости
cd cms && npm install
cd ../backend && npm install
cd ../frontend && npm install
```

### 4. Запуск приложения

**Способ 1: Запуск в отдельных терминалах**

```bash
# Терминал 1 - CMS
cd cms && npm run dev

# Терминал 2 - Backend
cd backend && npm run start:dev

# Терминал 3 - Frontend
cd frontend && npm run dev
```

**Способ 2: Использование tmux или screen**

```bash
# Создайте скрипт start-all.sh
#!/bin/bash
cd cms && npm run dev &
cd backend && npm run start:dev &
cd frontend && npm run dev &
wait
```

### 5. Первоначальная настройка

1. **Откройте CMS Admin**: http://localhost:3001/admin
2. **Создайте учетную запись администратора**
3. **Наполните данными** согласно `cms/seed-data.md`:
   - Модели часов (Watch Models)
   - Ремешки (Watch Straps)
   - Параметры ремешков (Strap Params)
   - Дополнительные опции (Additional Options)
   - Промокоды (Promo Codes)

## 🔗 Доступ к приложениям

| Приложение | URL | Описание |
|-----------|-----|----------|
| Frontend | http://localhost:3000 | Главная страница |
| Configurator | http://localhost:3000/configurator | Конфигуратор ремешков |
| Backend API | http://localhost:3002 | REST API |
| CMS Admin | http://localhost:3001/admin | Панель управления |
| CMS API | http://localhost:3001/api | Payload API |

## 📚 Документация

- **[INTEGRATION.md](./INTEGRATION.md)** - Подробная документация по интеграции, API endpoints, управление контентом
- **[ENV_SETUP.md](./ENV_SETUP.md)** - Настройка переменных окружения
- **[cms/SETUP.md](./cms/SETUP.md)** - Настройка Payload CMS
- **[cms/seed-data.md](./cms/seed-data.md)** - Примеры данных для наполнения

## 🎯 Основные возможности

### Для пользователей:
- ✅ Выбор модели часов
- ✅ Выбор типа ремешка
- ✅ Настройка дизайна (цвета кожи, строчки, пряжки и т.д.)
- ✅ Добавление дополнительных опций (инициалы, упаковка)
- ✅ Применение промокодов
- ✅ Корзина с возможностью редактирования

### Для администраторов (CMS):
- ✅ Управление моделями часов
- ✅ Управление ремешками и их параметрами
- ✅ Управление дополнительными опциями
- ✅ Управление промокодами
- ✅ Загрузка и управление медиафайлами
- ✅ REST API и GraphQL

## 🔄 Поток данных

1. **Frontend** отправляет запрос к **Backend**
2. **Backend** получает данные из **Payload CMS**
3. **Backend** трансформирует данные в нужный формат
4. **Frontend** отображает данные пользователю

## 🛠 Разработка

### Добавление новой коллекции в CMS

1. Создайте файл коллекции в `cms/src/collections/`
2. Добавьте в `cms/src/payload.config.ts`
3. Создайте методы в `backend/src/cms/cms.service.ts`
4. Добавьте endpoints в `backend/src/cms/cms.controller.ts`
5. Создайте API функции в `frontend/src/shared/api/cms.api.ts`
6. Используйте в компонентах

### API Endpoints

**Backend для Frontend:**
- `GET /cms/watch-models` - Модели часов
- `GET /cms/watch-straps` - Ремешки
- `GET /cms/strap-params/:id` - Параметры ремешка
- `GET /cms/additional-options` - Доп. опции
- `POST /cms/validate-promo` - Проверка промокода

**Payload CMS (для Backend):**
- `GET /api/watch-models`
- `GET /api/watch-straps`
- `GET /api/strap-params`
- `GET /api/additional-options`
- `GET /api/promo-codes`
- `GET /api/media`

## 🐛 Troubleshooting

### CMS не запускается
```bash
# Проверьте MongoDB
brew services list  # macOS
sudo systemctl status mongod  # Linux

# Проверьте логи
tail -f cms/logs/payload.log
```

### Backend не получает данные
```bash
# Проверьте CMS
curl http://localhost:3001/api/watch-models

# Проверьте переменные окружения
cat backend/.env
```

### Frontend не загружает данные
```bash
# Проверьте Backend
curl http://localhost:3002/cms/watch-models

# Проверьте консоль браузера
# DevTools → Console → Network
```

## 📦 Production Build

```bash
# Build всех приложений
cd cms && npm run build
cd ../backend && npm run build
cd ../frontend && npm run build

# Запуск в production
cd cms && npm run serve &
cd backend && npm run start:prod &
cd frontend && npm run start &
```

## 🤝 Contributing

1. Создайте feature branch
2. Внесите изменения
3. Обновите документацию
4. Создайте Pull Request

## 📝 Технологии

- **Frontend**: Next.js 15, React 19, MobX, TypeScript
- **Backend**: NestJS, Express, Axios
- **CMS**: Payload 3.x, MongoDB, GraphQL
- **Database**: MongoDB

## 📄 Лицензия

Proprietary - Все права защищены

## 🆘 Поддержка

Для вопросов и поддержки:
- Документация: см. `INTEGRATION.md`
- Issues: создайте issue в репозитории
- Email: support@example.com
