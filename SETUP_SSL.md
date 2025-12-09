# Инструкция по настройке SSL для custom.slavalarionov.com

## Проблема

Если при проверке nginx конфигурации возникает ошибка:
```
cannot load certificate "/etc/letsencrypt/live/custom.slavalarionov.com/fullchain.pem": No such file or directory
```

Это означает, что SSL сертификат еще не получен.

## Решение

### Шаг 1: Использовать HTTP версию конфигурации (временно)

```bash
# Использовать HTTP-only конфигурацию
sudo cp /opt/slavalarionov-base/nginx-custom.slavalarionov.com-http-only.conf /etc/nginx/sites-available/custom.slavalarionov.com

# Или использовать основную конфигурацию (она уже обновлена для работы без SSL)
sudo cp /opt/slavalarionov-base/nginx-custom.slavalarionov.com.conf /etc/nginx/sites-available/custom.slavalarionov.com

# Проверить и перезагрузить
sudo nginx -t
sudo systemctl reload nginx
```

### Шаг 2: Получить SSL сертификат

После того, как nginx запустится с HTTP конфигурацией, получите SSL сертификат:

```bash
# Получить сертификат через certbot
sudo certbot --nginx -d custom.slavalarionov.com
```

Certbot автоматически:
- Получит сертификат
- Обновит конфигурацию nginx для использования SSL
- Настроит редирект с HTTP на HTTPS

### Шаг 3: Обновить конфигурацию для SSL (если certbot не обновил автоматически)

Если certbot не обновил конфигурацию автоматически, используйте полную версию с SSL:

```bash
# Восстановить полную конфигурацию с SSL
sudo cp /opt/slavalarionov-base/nginx-custom.slavalarionov.com.conf /etc/nginx/sites-available/custom.slavalarionov.com

# Добавить SSL блок вручную (если нужно)
sudo nano /etc/nginx/sites-available/custom.slavalarionov.com
```

Добавьте SSL блок после HTTP блока:

```nginx
server {
    listen 443 ssl http2;
    server_name custom.slavalarionov.com;

    ssl_certificate /etc/letsencrypt/live/custom.slavalarionov.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/custom.slavalarionov.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # ... остальная конфигурация такая же как в HTTP блоке
}
```

И обновите HTTP блок для редиректа:

```nginx
server {
    if ($host = custom.slavalarionov.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name custom.slavalarionov.com;
    return 404;
}
```

### Альтернативный способ: Получить сертификат в standalone режиме

Если nginx плагин certbot не работает:

```bash
# Остановить nginx временно
sudo systemctl stop nginx

# Получить сертификат в standalone режиме
sudo certbot certonly --standalone -d custom.slavalarionov.com

# Запустить nginx обратно
sudo systemctl start nginx

# Затем вручную добавить SSL конфигурацию
```

## Проверка

После настройки SSL проверьте:

```bash
# Проверить конфигурацию
sudo nginx -t

# Проверить доступность через HTTPS
curl -I https://custom.slavalarionov.com

# Проверить статус сертификата
sudo certbot certificates
```

## Автоматическое обновление сертификатов

Certbot автоматически настроит обновление сертификатов. Проверить можно:

```bash
# Проверить таймер обновления
sudo systemctl status certbot.timer

# Вручную обновить сертификаты
sudo certbot renew
```

