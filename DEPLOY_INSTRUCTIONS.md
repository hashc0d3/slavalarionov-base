# Инструкция по деплою на DEV и PROD

## 🚀 Быстрый деплой

### Вариант 1: Деплой через скрипты (рекомендуется)

#### Деплой на DEV окружение:
```bash
cd /opt/slavalarionov-base
chmod +x deploy-dev.sh
./deploy-dev.sh
```

#### Деплой на PROD окружение:
```bash
cd /opt/slavalarionov-base
chmod +x deploy-prod.sh
./deploy-prod.sh
```

#### Деплой на оба окружения одновременно:
```bash
cd /opt/slavalarionov-base
chmod +x deploy-both.sh
./deploy-both.sh
```

---

### Вариант 2: Ручной деплой

#### 1. Подключитесь к серверу:
```bash
ssh root@your-server-ip
cd /opt/slavalarionov-base
```

#### 2. Обновите код из репозитория:
```bash
git pull origin main  # или ваша ветка
```

#### 3. Деплой на DEV (sl.cdn1.dev):
```bash
# Остановить существующий контейнер
docker compose -f docker-compose.dev.yml down

# Собрать и запустить
docker compose -f docker-compose.dev.yml up -d --build

# Проверить статус
docker compose -f docker-compose.dev.yml ps

# Просмотр логов
docker compose -f docker-compose.dev.yml logs -f backend-dev
```

#### 4. Деплой на PROD (custom.slavalarionov.com):
```bash
# Остановить существующий контейнер
docker compose -f docker-compose.prod.yml down

# Собрать и запустить
docker compose -f docker-compose.prod.yml up -d --build

# Проверить статус
docker compose -f docker-compose.prod.yml ps

# Просмотр логов
docker compose -f docker-compose.prod.yml logs -f backend-prod
```

---

## 📋 Проверка после деплоя

### Проверка DEV окружения:
```bash
# Проверить доступность
curl -I https://sl.cdn1.dev

# Проверить контейнер
docker compose -f docker-compose.dev.yml ps

# Проверить логи на ошибки
docker compose -f docker-compose.dev.yml logs backend-dev | grep -i error
```

### Проверка PROD окружения:
```bash
# Проверить доступность
curl -I https://custom.slavalarionov.com

# Проверить контейнер
docker compose -f docker-compose.prod.yml ps

# Проверить логи на ошибки
docker compose -f docker-compose.prod.yml logs backend-prod | grep -i error
```

---

## 🔧 Устранение проблем

### Если контейнер не запускается:
```bash
# Проверить логи
docker compose -f docker-compose.dev.yml logs backend-dev
# или
docker compose -f docker-compose.prod.yml logs backend-prod

# Пересобрать без кэша
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up -d
```

### Если nginx возвращает 502:
```bash
# Проверить, что контейнер запущен
docker compose -f docker-compose.dev.yml ps
docker compose -f docker-compose.prod.yml ps

# Проверить nginx конфигурацию
sudo nginx -t
sudo systemctl reload nginx

# Проверить доступность портов
curl http://127.0.0.1:8081  # DEV
curl http://127.0.0.1:8082  # PROD
```

### Если нужно перезапустить контейнер:
```bash
# DEV
docker compose -f docker-compose.dev.yml restart backend-dev

# PROD
docker compose -f docker-compose.prod.yml restart backend-prod
```

---

## 📊 Мониторинг

### Просмотр логов в реальном времени:
```bash
# DEV
docker compose -f docker-compose.dev.yml logs -f backend-dev

# PROD
docker compose -f docker-compose.prod.yml logs -f backend-prod
```

### Использование ресурсов:
```bash
# DEV
docker stats slavalarionov-backend-dev

# PROD
docker stats slavalarionov-backend-prod
```

---

## 🔄 Откат изменений

Если нужно откатиться к предыдущей версии:

```bash
# 1. Перейти на предыдущий коммит
git checkout <previous-commit-hash>

# 2. Пересобрать и запустить
docker compose -f docker-compose.dev.yml up -d --build
# или
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📝 Важные замечания

1. **DEV окружение** (`sl.cdn1.dev`):
   - Порт: `8081`
   - База данных: `dev.db`
   - Используется для тестирования

2. **PROD окружение** (`custom.slavalarionov.com`):
   - Порт: `8082` (внешний) → `8081` (внутренний)
   - База данных: `prod.db`
   - Используется для продакшена

3. **Данные сохраняются** в Docker volumes:
   - `backend_db_dev` / `backend_db_prod` - базы данных
   - `backend_uploads_dev` / `backend_uploads_prod` - загруженные файлы

4. **При деплое через скрипты** код автоматически обновляется из git репозитория.

---

## 🛡️ Деплой с изменениями БД (миграции, роли) без потери данных

При обновлении с новыми миграциями (например, таблица `users` и роли для админки):

1. **Данные не теряются**: БД и картинки лежат в Docker volumes (`backend_db_prod`, `backend_uploads_prod`). При `docker compose up -d --build` volumes не пересоздаются.

2. **При старте контейнера** выполняются только:
   - `prisma migrate deploy` — применяются **только новые** миграции (добавляются новые таблицы/поля, существующие данные не трогаются).
   - `scripts/init-db.js` — создаёт настройки конфигуратора, если их нет, и **создаёт первого администратора** (ddolgosheev2@gmail.com), если его ещё нет. Полный seed (очистка моделей/ремейшков) **не запускается** в проде.

3. **Опционально: бэкап перед деплоем** (если хочется подстраховаться):
   ```bash
   # На сервере: скопировать БД и uploads из volume в файлы
   docker run --rm -v slavalarionov-base_backend_db_prod:/data -v $(pwd):/backup alpine tar czf /backup/prod-db-backup-$(date +%Y%m%d).tar.gz -C /data .
   docker run --rm -v slavalarionov-base_backend_uploads_prod:/data -v $(pwd):/backup alpine tar czf /backup/prod-uploads-backup-$(date +%Y%m%d).tar.gz -C /data .
   ```
   Имена volumes могут быть с префиксом проекта (например, `slavalarionov-base_backend_db_prod`). Проверить: `docker volume ls`.

4. **Переменные окружения на проде**: в `backend/.env` на сервере должны быть `GOOGLE_CLIENT_ID`, `JWT_SECRET`; для фронта при сборке — `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (если задаётся через build-args, их нужно передать в Dockerfile при необходимости).

---

## 👤 Добавить администратора в запущенный прод

**Способ 1 — скрипт (после деплоя с этим скриптом в образе):**
```bash
docker exec slavalarionov-backend-prod node scripts/add-admin.js larionov38@gmail.com
```

**Способ 2 — без пересборки (одной командой):**
```bash
docker exec slavalarionov-backend-prod node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.upsert({ where: { email: 'larionov38@gmail.com' }, create: { email: 'larionov38@gmail.com', role: 'ADMIN' }, update: { role: 'ADMIN' } })
  .then(() => { console.log('OK'); return p.\$disconnect(); })
  .catch(e => { console.error(e); p.\$disconnect(); process.exit(1); });
"
```

Имя контейнера может отличаться — проверьте: `docker ps` (ищите backend-prod).

---

## 🎯 Рекомендуемый workflow

1. **Разработка** → коммит в git
2. **Тестирование на DEV**:
   ```bash
   ./deploy-dev.sh
   ```
3. **Проверка на DEV** → https://sl.cdn1.dev
4. **Деплой на PROD** (если всё ОК):
   ```bash
   ./deploy-prod.sh
   ```
5. **Проверка на PROD** → https://custom.slavalarionov.com

