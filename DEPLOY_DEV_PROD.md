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

Создайте файл `/etc/nginx/sites-available/sl.cdn1.dev`:

```nginx
server {
    listen 80;
    server_name sl.cdn1.dev;

    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# SSL версия (после получения сертификата)
server {
    listen 443 ssl http2;
    server_name sl.cdn1.dev;

    ssl_certificate /etc/letsencrypt/live/sl.cdn1.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sl.cdn1.dev/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Конфигурация для PROD (custom.slavalarionov.com)

Обновите файл `/etc/nginx/sites-available/custom.slavalarionov.com`:

```nginx
server {
    listen 80;
    server_name custom.slavalarionov.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name custom.slavalarionov.com;

    ssl_certificate /etc/letsencrypt/live/custom.slavalarionov.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/custom.slavalarionov.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://127.0.0.1:8082;  # Важно: порт 8082 для PROD
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

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

