#!/bin/bash

# Скрипт для получения SSL сертификата для custom.slavalarionov.com

set -e

DOMAIN="custom.slavalarionov.com"

echo "🔒 Получение SSL сертификата для $DOMAIN..."

# Остановить nginx временно
echo "⏸️  Остановка nginx..."
sudo systemctl stop nginx

# Получить сертификат в standalone режиме
echo "📜 Получение сертификата через certbot standalone..."
sudo certbot certonly --standalone -d $DOMAIN --non-interactive --agree-tos --email admin@slavalarionov.com || {
    echo "⚠️  Ошибка при получении сертификата. Попробуйте вручную:"
    echo "   sudo certbot certonly --standalone -d $DOMAIN"
    sudo systemctl start nginx
    exit 1
}

# Запустить nginx обратно
echo "▶️  Запуск nginx..."
sudo systemctl start nginx

# Проверить, что сертификат получен
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "✅ Сертификат успешно получен!"
    echo ""
    echo "📝 Теперь нужно добавить SSL конфигурацию в nginx."
    echo "   Используйте файл: nginx-custom.slavalarionov.com-ssl.conf"
    echo "   Или запустите: sudo certbot --nginx -d $DOMAIN (может не сработать из-за бага certbot)"
else
    echo "❌ Сертификат не найден. Проверьте логи:"
    echo "   sudo tail -50 /var/log/letsencrypt/letsencrypt.log"
fi

