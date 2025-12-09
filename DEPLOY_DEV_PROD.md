# Инструкция по развертыванию DEV и PROD окружений

## Структура окружений

- **DEV**: https://sl.cdn1.dev (порт 8081)
- **PROD**: https://custom.slavalarionov.com (порт 8082)

## Быстрый старт

### Запуск DEV окружения

```bash
cd /opt/slavalarionov-base
docker compose -f docker-compose.dev.yml up -d --build
```

### Запуск PROD окружения

```bash
cd /opt/slavalarionov-base
docker compose -f docker-compose.prod.yml up -d --build
```

### Запуск обоих окружений одновременно

```bash
cd /opt/slavalarionov-base
docker compose -f docker-compose.dev.yml -f docker-compose.prod.yml up -d --build
```

## Настройка Nginx

### Конфигурация для DEV (sl.cdn1.dev)

Скопируйте готовую конфигурацию из файла `nginx-sl.cdn1.dev.conf`:

```bash
sudo cp nginx-sl.cdn1.dev.conf /etc/nginx/sites-available/sl.cdn1.dev
```

Или создайте файл `/etc/nginx/sites-available/sl.cdn1.dev` вручную (см. файл `nginx-sl.cdn1.dev.conf` в репозитории).

Конфигурация включает:
- Проксирование на localhost:8081 (DEV backend)
- Кэширование для `/uploads/` и `/_next/static`
- SSL настройки
- Таймауты и лимиты

### Конфигурация для PROD (custom.slavalarionov.com)

Скопируйте готовую конфигурацию из файла `nginx-custom.slavalarionov.com.conf`:

```bash
sudo cp nginx-custom.slavalarionov.com.conf /etc/nginx/sites-available/custom.slavalarionov.com
```

Или обновите существующий файл `/etc/nginx/sites-available/custom.slavalarionov.com` вручную (см. файл `nginx-custom.slavalarionov.com.conf` в репозитории).

**Важно**: Измените `proxy_pass` с внешнего IP на `http://127.0.0.1:8082` (порт 8082 для PROD).

Конфигурация включает:
- Проксирование на localhost:8082 (PROD backend)
- Кэширование для `/uploads/` и `/_next/static`
- SSL настройки
- Таймауты и лимиты

### Активация конфигураций Nginx

```bash
# Активировать DEV
sudo ln -sf /etc/nginx/sites-available/sl.cdn1.dev /etc/nginx/sites-enabled/

# Активировать PROD (если еще не активирован)
sudo ln -sf /etc/nginx/sites-available/custom.slavalarionov.com /etc/nginx/sites-enabled/

# Проверить конфигурацию
sudo nginx -t

# Перезагрузить nginx
sudo systemctl reload nginx
```

### Получение SSL сертификатов

```bash
# Для DEV
sudo certbot --nginx -d sl.cdn1.dev

# Для PROD (если еще не получен)
sudo certbot --nginx -d custom.slavalarionov.com
```

## Управление окружениями

### Проверка статуса

```bash
# Статус DEV
docker compose -f docker-compose.dev.yml ps

# Статус PROD
docker compose -f docker-compose.prod.yml ps

# Логи DEV
docker compose -f docker-compose.dev.yml logs -f backend-dev

# Логи PROD
docker compose -f docker-compose.prod.yml logs -f backend-prod
```

### Остановка окружений

```bash
# Остановить DEV
docker compose -f docker-compose.dev.yml down

# Остановить PROD
docker compose -f docker-compose.prod.yml down

# Остановить оба
docker compose -f docker-compose.dev.yml -f docker-compose.prod.yml down
```

### Обновление кода

```bash
cd /opt/slavalarionov-base

# Обновить DEV
git pull
docker compose -f docker-compose.dev.yml up -d --build

# Обновить PROD
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## Проверка работы

```bash
# Проверить DEV
curl -I https://sl.cdn1.dev

# Проверить PROD
curl -I https://custom.slavalarionov.com

# Проверить порты
sudo netstat -tulpn | grep -E '8081|8082'
# или
sudo ss -tulpn | grep -E '8081|8082'
```

## Важные отличия окружений

| Параметр | DEV | PROD |
|----------|-----|------|
| Домен | sl.cdn1.dev | custom.slavalarionov.com |
| Порт | 8081 | 8082 |
| База данных | dev.db | prod.db |
| Uploads | backend_uploads_dev | backend_uploads_prod |
| NODE_ENV | development | production |
| NEXT_PUBLIC_MEDIA_BASE_URL | https://sl.cdn1.dev | https://custom.slavalarionov.com |

## Решение проблем

### Проблема: Контейнер не запускается

```bash
# Проверить логи
docker compose -f docker-compose.dev.yml logs backend-dev
docker compose -f docker-compose.prod.yml logs backend-prod

# Проверить, заняты ли порты
sudo netstat -tulpn | grep -E '8081|8082'
```

### Проблема: Nginx не проксирует запросы

```bash
# Проверить конфигурацию nginx
sudo nginx -t

# Проверить логи nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Убедиться, что proxy_pass указывает на правильный порт
# DEV: 8081, PROD: 8082
```

### Проблема: SSL сертификат не работает

```bash
# Обновить сертификаты
sudo certbot renew

# Проверить статус сертификатов
sudo certbot certificates
```

