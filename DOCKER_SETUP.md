# Инструкция по запуску проекта через Docker Compose

## Быстрый старт

### Вариант 1: Полная очистка и перезапуск (рекомендуется)

**Для Linux/Mac:**
```bash
chmod +x restart.sh
./restart.sh
```

**Для Windows (PowerShell):**
```powershell
.\restart.ps1
```

Этот скрипт:
- Остановит и удалит все контейнеры и volumes
- Удалит старые образы
- Соберет образы заново
- Запустит контейнеры
- Покажет статус и логи

### Вариант 2: Обычный запуск

```bash
docker compose up -d --build
```

### Вариант 3: Запуск с просмотром логов

```bash
docker compose up --build
```

## Полезные команды

### Просмотр логов
```bash
docker compose logs -f backend
```

### Остановка контейнеров
```bash
docker compose down
```

### Остановка с удалением volumes (очистка базы данных)
```bash
docker compose down -v
```

### Пересборка образов
```bash
docker compose build --no-cache
docker compose up -d
```

### Проверка статуса
```bash
docker compose ps
```

### Вход в контейнер
```bash
docker compose exec backend sh
```

## Доступ к приложению

После запуска приложение будет доступно по адресу:
- **Главная страница**: http://localhost:8081
- **Конфигуратор**: http://localhost:8081/configurator
- **API**: http://localhost:8081/api/greeting

## Структура проекта

- `backend/` - NestJS сервер с API и middleware для Next.js
- `frontend/` - Next.js приложение (React)
- `docker-compose.yml` - Конфигурация Docker Compose
- `backend/Dockerfile` - Dockerfile для сборки образа

## База данных

База данных SQLite хранится в Docker volume `backend_db` и автоматически инициализируется при первом запуске:
- Применяются миграции Prisma
- Заполняется база начальными данными (seed)

## Решение проблем

### Проблема: Контейнер не запускается
1. Проверьте логи: `docker compose logs backend`
2. Убедитесь, что порт 8081 свободен
3. Попробуйте полную пересборку: `./restart.sh` или `.\restart.ps1`

### Проблема: База данных не инициализируется
1. Остановите контейнеры: `docker compose down -v`
2. Запустите заново: `docker compose up -d --build`

### Проблема: Frontend не найден
Проверьте логи контейнера - должен быть путь к frontend. Если проблема сохраняется, проверьте что frontend собран в образе.

### Проблема: Prisma client не генерируется
1. Убедитесь, что Prisma schema находится в `backend/prisma/schema.prisma`
2. Проверьте логи сборки Docker образа
3. При необходимости сгенерируйте Prisma client локально перед сборкой:
   ```bash
   cd backend
   npm install
   npm run prisma:generate
   cd ..
   docker compose build
   ```

## Переменные окружения

Переменные окружения настраиваются в `docker-compose.yml`:
- `NODE_ENV=production`
- `PORT=8081`
- `DATABASE_URL=file:./prisma/dev.db`

При необходимости можно создать `.env` файл и использовать его в `docker-compose.yml`.


