# Настройка SSH ключей для доступа к серверу

## Быстрое добавление ключа

### Linux/Mac:
```bash
chmod +x add-ssh-key.sh
./add-ssh-key.sh user@server
```

### Windows (PowerShell):
```powershell
.\add-ssh-key.ps1 user@server
```

**Пример:**
```bash
./add-ssh-key.sh root@192.168.1.100
# или
./add-ssh-key.sh deploy@example.com
```

## Ручное добавление ключа

Если автоматический скрипт не работает, можно добавить ключ вручную:

1. **Подключитесь к серверу:**
   ```bash
   ssh user@server
   ```

2. **Создайте директорию .ssh (если её нет):**
   ```bash
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   ```

3. **Добавьте публичный ключ:**
   ```bash
   echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC4cTArWr/uRWKDn8UFPGUv/b8iAa1Fx7MgJOSnWsuYPFTun/xRxPlzmQTuAokL5M/w9OqFdsCLez61S2x4gJGCeyghZesTrogs7UypTN7LR373Pw4IIkUL8C8s2NWcxlcLIdQBMgNI3W2q1832QesoRjd7p42+hl5N/B4UE9NQxuIjVL4xD8LXYxdGF03Nu/Yvi4FUkXQJRF5XLVIONIo64pA46fol54voQtdyHIlpPXC/34YcqEGXCvsLDvQISm/Hr8RAgxuuT0tgblEUiVubyVhHOl+SOtDx76eYxPcr6LK2JryzZp9k+9utP58TcyvgLHg0eUUQxps2kGc1s5ogHYfHj2rrbUcUAEWzon3559t+IA1ZhatFZAjzTqWdksv1vbi+hUkFE8Gf1Yd84Uv9Tyx1CKLsGAXhzmj+EZxrasMPLscHnp+O54xLFzt89PMT5ToXHYFdwNDdOQpwQpW1T5X1R/MIQ69nFdFTWoSHLGelMJiOR9/ak0q8IU0VitU= user@users-MacBook-Pro.local" >> ~/.ssh/authorized_keys
   ```

4. **Установите правильные права:**
   ```bash
   chmod 600 ~/.ssh/authorized_keys
   ```

5. **Выйдите из сессии:**
   ```bash
   exit
   ```

6. **Проверьте подключение:**
   ```bash
   ssh user@server
   ```

Теперь вы должны подключаться без ввода пароля.

## Использование ключа с другого компьютера

Если у вас есть **приватный ключ** с другого компьютера:

1. **Скопируйте приватный ключ** на текущий компьютер
2. **Сохраните его** в `~/.ssh/id_rsa` (или другое имя)
3. **Установите права:**
   ```bash
   chmod 600 ~/.ssh/id_rsa
   ```
4. **Подключайтесь:**
   ```bash
   ssh -i ~/.ssh/id_rsa user@server
   ```

Или добавьте в `~/.ssh/config`:
```
Host server
    HostName your-server.com
    User your-username
    IdentityFile ~/.ssh/id_rsa
```

Тогда можно просто: `ssh server`

## Важные замечания

- ⚠️ **Публичный ключ** (который вы добавляете на сервер) можно безопасно показывать
- 🔒 **Приватный ключ** должен оставаться секретным и никогда не передаваться
- 📁 Публичный ключ сохранен в `ssh-keys/authorized_key.pub`
- 🔑 Для подключения нужен **приватный ключ**, который должен быть на вашем компьютере

## Проверка ключа

Проверить, что ключ добавлен правильно:
```bash
ssh user@server "cat ~/.ssh/authorized_keys"
```

Должен отобразиться ваш публичный ключ.


