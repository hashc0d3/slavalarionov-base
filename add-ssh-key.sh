#!/bin/bash

# Скрипт для добавления SSH ключа на сервер
# Использование: ./add-ssh-key.sh user@server

set -e

SSH_KEY_FILE="ssh-keys/authorized_key.pub"
SSH_KEY="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC4cTArWr/uRWKDn8UFPGUv/b8iAa1Fx7MgJOSnWsuYPFTun/xRxPlzmQTuAokL5M/w9OqFdsCLez61S2x4gJGCeyghZesTrogs7UypTN7LR373Pw4IIkUL8C8s2NWcxlcLIdQBMgNI3W2q1832QesoRjd7p42+hl5N/B4UE9NQxuIjVL4xD8LXYxdGF03Nu/Yvi4FUkXQJRF5XLVIONIo64pA46fol54voQtdyHIlpPXC/34YcqEGXCvsLDvQISm/Hr8RAgxuuT0tgblEUiVubyVhHOl+SOtDx76eYxPcr6LK2JryzZp9k+9utP58TcyvgLHg0eUUQxps2kGc1s5ogHYfHj2rrbUcUAEWzon3559t+IA1ZhatFZAjzTqWdksv1vbi+hUkFE8Gf1Yd84Uv9Tyx1CKLsGAXhzmj+EZxrasMPLscHnp+O54xLFzt89PMT5ToXHYFdwNDdOQpwQpW1T5X1R/MIQ69nFdFTWoSHLGelMJiOR9/ak0q8IU0VitU= user@users-MacBook-Pro.local"

if [ -z "$1" ]; then
    echo "❌ Ошибка: Укажите адрес сервера"
    echo "Использование: ./add-ssh-key.sh user@server"
    echo "Пример: ./add-ssh-key.sh root@192.168.1.100"
    exit 1
fi

SERVER="$1"

echo "🔑 Добавляю SSH ключ на сервер $SERVER..."

# Проверяем, существует ли файл с ключом
if [ -f "$SSH_KEY_FILE" ]; then
    SSH_KEY=$(cat "$SSH_KEY_FILE")
    echo "✓ Используется ключ из файла $SSH_KEY_FILE"
fi

# Добавляем ключ на сервер
ssh "$SERVER" "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$SSH_KEY' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo '✓ SSH ключ успешно добавлен!'"

echo ""
echo "✅ SSH ключ успешно добавлен на сервер $SERVER"
echo ""
echo "Теперь вы можете подключаться к серверу без пароля:"
echo "  ssh $SERVER"


