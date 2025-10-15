# Интеграция Payload CMS с проектом

## Архитектура

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend   │─────▶│ Payload CMS │
│  (Next.js)  │      │  (NestJS)   │      │  (Express)  │
│  Port 3000  │      │  Port 3002  │      │  Port 3001  │
└─────────────┘      └─────────────┘      └─────────────┘
                                                   │
                                                   ▼
                                           ┌─────────────┐
                                           │   MongoDB   │
                                           └─────────────┘
```

## Структура проекта

```
site-base/
├── frontend/          # Next.js приложение
├── backend/           # NestJS API
├── cms/              # Payload CMS
└── custom/           # Legacy Nuxt приложение
```

## Быстрый старт

### 1. Установка MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
```

**Windows:**
Скачайте и установите с https://www.mongodb.com/try/download/community

### 2. Установка зависимостей

```bash
# CMS
cd cms
npm install

# Backend
cd ../backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Настройка переменных окружения

**CMS (.env):**
```env
DATABASE_URI=mongodb://localhost:27017/watch-configurator
PAYLOAD_SECRET=watch-configurator-secret-key-2025
PORT=3001
```

**Backend (.env):**
```env
CMS_API_URL=http://localhost:3001/api
PORT=3002
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### 4. Запуск сервисов

**Терминал 1 - CMS:**
```bash
cd cms
npm run dev
```

**Терминал 2 - Backend:**
```bash
cd backend
npm run start:dev
```

**Терминал 3 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Первоначальная настройка CMS

1. Откройте http://localhost:3001/admin
2. Создайте учетную запись администратора
3. Наполните данными согласно `cms/seed-data.md`

### 6. Доступ к приложениям

- **Frontend**: http://localhost:3000
- **Frontend Configurator**: http://localhost:3000/configurator
- **Backend API**: http://localhost:3002
- **CMS Admin**: http://localhost:3001/admin
- **CMS API**: http://localhost:3001/api

## Как это работает

### Поток данных

1. **Загрузка данных:**
   - Frontend запрашивает данные у Backend
   - Backend получает данные из Payload CMS API
   - Backend трансформирует данные в нужный формат
   - Frontend отображает данные

2. **Создание заказа:**
   - Пользователь настраивает ремешок на Frontend
   - Данные отправляются в Backend
   - Backend сохраняет заказ и обновляет статистику в CMS (например, счетчик использований промокода)

### API Endpoints

**Backend endpoints для Frontend:**
- `GET /cms/watch-models` - Список моделей часов
- `GET /cms/watch-straps` - Список ремешков
- `GET /cms/strap-params/:strapId` - Параметры конкретного ремешка
- `GET /cms/additional-options` - Дополнительные опции
- `POST /cms/validate-promo` - Проверка промокода
- `POST /cms/increment-promo-usage` - Увеличение счетчика использований промокода

**Payload CMS endpoints (используются Backend):**
- `GET /api/watch-models` - Модели часов
- `GET /api/watch-straps` - Ремешки
- `GET /api/strap-params` - Параметры ремешков
- `GET /api/additional-options` - Дополнительные опции
- `GET /api/promo-codes` - Промокоды
- `GET /api/media` - Медиафайлы

## Управление контентом

### Добавление новой модели часов

1. Зайдите в CMS Admin → Watch Models → Create New
2. Заполните поля:
   - Model Name (идентификатор)
   - Watch Model Name (отображаемое название)
   - Manufacturer
   - Main Image (загрузите изображение)
   - Watch Sizes (добавьте размеры)
   - Frame Colors (добавьте цвета корпуса)
3. Сохраните
4. Данные автоматически появятся на фронтенде

### Добавление нового ремешка

1. Зайдите в CMS Admin → Watch Straps → Create New
2. Заполните основную информацию
3. Перейдите в Strap Params → Create New
4. Выберите созданный ремешок
5. Настройте параметры (цвета кожи, строчки и т.д.)
6. Сохраните

### Создание промокода

1. Зайдите в CMS Admin → Promo Codes → Create New
2. Введите код промокода (заглавными буквами)
3. Выберите тип скидки (процент или рубли)
4. Укажите размер скидки
5. Настройте условия (минимальная сумма, даты, лимит)
6. Активируйте промокод

## Разработка

### Добавление новой коллекции в CMS

1. Создайте файл коллекции в `cms/src/collections/`
2. Добавьте коллекцию в `cms/src/payload.config.ts`
3. Создайте метод в `backend/src/cms/cms.service.ts`
4. Добавьте endpoint в `backend/src/cms/cms.controller.ts`
5. Создайте API функцию в `frontend/src/shared/api/cms.api.ts`
6. Используйте в компонентах

### Изменение структуры данных

1. Обновите коллекцию в `cms/src/collections/`
2. Обновите трансформацию данных в `backend/src/cms/cms.service.ts`
3. Обновите типы в `frontend/src/shared/store/configurator.store.ts`
4. Обновите компоненты при необходимости

## Troubleshooting

### CMS не запускается
- Проверьте, что MongoDB запущен: `brew services list` (macOS)
- Проверьте DATABASE_URI в .env
- Проверьте логи: посмотрите ошибки в терминале

### Backend не получает данные из CMS
- Убедитесь, что CMS запущен и доступен
- Проверьте CMS_API_URL в backend/.env
- Проверьте CORS настройки в cms/src/payload.config.ts

### Frontend не получает данные
- Проверьте, что Backend запущен
- Проверьте NEXT_PUBLIC_API_URL в frontend/.env.local
- Откройте DevTools → Network и проверьте запросы

### Изображения не отображаются
- Убедитесь, что файлы загружены в CMS
- Проверьте путь в Media collection
- Убедитесь, что папка cms/uploads создана и доступна

## Production

### Build

```bash
# CMS
cd cms
npm run build

# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Deploy

1. Разверните MongoDB (Atlas, DigitalOcean и т.д.)
2. Обновите переменные окружения
3. Запустите сервисы:
   ```bash
   # CMS
   cd cms && npm run serve
   
   # Backend
   cd backend && npm run start:prod
   
   # Frontend
   cd frontend && npm run start
   ```

### Environment Variables для Production

**CMS:**
- `DATABASE_URI` - MongoDB connection string
- `PAYLOAD_SECRET` - Сильный секретный ключ
- `PAYLOAD_PUBLIC_SERVER_URL` - URL вашего CMS

**Backend:**
- `CMS_API_URL` - URL Payload CMS API
- `PORT` - Порт backend

**Frontend:**
- `NEXT_PUBLIC_API_URL` - URL Backend API

