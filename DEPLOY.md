# Инструкция по развертыванию на сервере

## Быстрый старт

```bash
# 1. Клонировать репозиторий
git clone <repository-url>
cd site-base

# 2. Установить зависимости и сгенерировать Prisma client
cd backend
npm install
npm run prisma:generate
cd ../frontend
npm install
cd ..

# 3. Собрать и запустить через Docker Compose
docker compose up -d --build

# 4. Проверить статус
docker compose ps
docker compose logs -f backend
```

## Подробная инструкция

### Шаг 1: Подготовка сервера

Убедитесь, что на сервере установлены:
- Docker (версия 20.10+)
- Docker Compose (версия 2.0+)
- Node.js (версия 20+) и npm
- Git

Проверка:
```bash
docker --version
docker compose version
node --version
npm --version
git --version
```

### Шаг 2: Клонирование репозитория

```bash
git clone <repository-url>
cd site-base
```

### Шаг 3: Установка зависимостей и генерация Prisma client

**Важно**: Prisma client должен быть сгенерирован локально перед сборкой Docker образа.

```bash
# Backend
cd backend
npm install
npm run prisma:generate
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### Шаг 4: Сборка и запуск Docker контейнеров

```bash
# Собрать образы
docker compose build

# Запустить контейнеры в фоновом режиме
docker compose up -d

# Или собрать и запустить одной командой
docker compose up -d --build
```

### Шаг 5: Проверка работы

```bash
# Проверить статус контейнеров
docker compose ps

# Посмотреть логи
docker compose logs -f backend

# Проверить доступность приложения
curl http://localhost:8081
```

### Шаг 6: Открыть приложение

Откройте в браузере:
- **http://localhost:8081** — главная страница
- **http://localhost:8081/configurator** — конструктор
- **http://localhost:8081/api/greeting** — пример API

## Управление контейнерами

```bash
# Остановить контейнеры
docker compose down

# Остановить и удалить volumes (БД будет удалена!)
docker compose down -v

# Перезапустить контейнеры
docker compose restart

# Посмотреть логи
docker compose logs -f backend

# Войти в контейнер
docker compose exec backend sh
```

## Обновление приложения

```bash
# 1. Остановить контейнеры
docker compose down

# 2. Обновить код
git pull

# 3. Обновить зависимости (если изменились)
cd backend && npm install && npm run prisma:generate
cd ../frontend && npm install
cd ..

# 4. Пересобрать и запустить
docker compose up -d --build
```

## Решение проблем

### Проблема: Prisma client не генерируется

**Решение:**
```bash
cd backend
npm install
npm run prisma:generate
cd ..
docker compose build
```

### Проблема: Контейнер не запускается

**Проверка:**
```bash
# Посмотреть логи
docker compose logs backend

# Проверить статус
docker compose ps

# Проверить порты
netstat -tulpn | grep 8081
```

### Проблема: База данных не работает

**Решение:**
```bash
# Проверить volumes
docker volume ls

# Войти в контейнер и проверить БД
docker compose exec backend sh
cd prisma
ls -la dev.db
```

### Проблема: Сборка занимает слишком много времени

**Оптимизация:**
- Используйте кэш Docker: `docker compose build --no-cache` только при необходимости
- Убедитесь, что Prisma client сгенерирован локально перед сборкой
- Проверьте доступность сервера Prisma (https://binaries.prisma.sh)

## Переменные окружения

Создайте файл `.env` в корне проекта (если нужен):

```env
NODE_ENV=production
PORT=8081
DATABASE_URL=file:./prisma/dev.db
```

## Полезные команды

```bash
# Очистить все неиспользуемые Docker ресурсы
docker system prune -a

# Посмотреть использование дискового пространства
docker system df

# Очистить кэш сборки
docker builder prune
```

## Производительность

Сборка оптимизирована для ускорения:
- ✅ SWC компилятор вместо TypeScript (быстрее в 5-20 раз)
- ✅ Отключена проверка типов во время сборки
- ✅ Кэширование промежуточных результатов
- ✅ Отключены ненужные оптимизации

Ожидаемое время сборки: **3-5 минут** (первая сборка), **1-2 минуты** (повторная с кэшем).

