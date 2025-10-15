# 🚀 Быстрый запуск

## За 5 минут до запуска системы

### 1. Установите MongoDB (если еще не установлен)

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install mongodb
sudo systemctl start mongod

# Или используйте Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 2. Создайте переменные окружения

```bash
# В корне проекта выполните:
cd /Users/user/slava-larionov/site-base

# CMS
echo "DATABASE_URI=mongodb://localhost:27017/watch-configurator
PAYLOAD_SECRET=watch-configurator-secret-key-2025
PORT=3001" > cms/.env

# Backend  
echo "CMS_API_URL=http://localhost:3001/api
PORT=3002" > backend/.env

# Frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3002" > frontend/.env.local
```

### 3. Установите зависимости (если еще не установлены)

```bash
# CMS
cd cms && npm install

# Backend
cd ../backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Запустите систему

Откройте **3 терминала** и выполните:

**Терминал 1 - Payload CMS:**
```bash
cd /Users/user/slava-larionov/site-base/cms
npm run dev
```
✅ Откроется на http://localhost:3001

**Терминал 2 - Backend API:**
```bash
cd /Users/user/slava-larionov/site-base/backend
npm run start:dev
```
✅ Запустится на http://localhost:3002

**Терминал 3 - Frontend:**
```bash
cd /Users/user/slava-larionov/site-base/frontend
npm run dev
```
✅ Откроется на http://localhost:3000

### 5. Первый вход и настройка CMS

1. Откройте http://localhost:3001/admin
2. Создайте аккаунт администратора (email + пароль)
3. Добавьте данные:

#### Минимальные данные для теста:

**Watch Models** (1 модель для начала):
- Model Name: `apple-watch-7-9`
- Watch Model Name: `Apple Watch 7-9`
- Manufacturer: `Apple Watch`
- Sizes: `41`, `45`
- Frame Colors: Silver (`#C0C0C0`), Black (`#000000`)
- Загрузите изображение (или оставьте пустым)
- ✅ Is Active

**Watch Straps** (1 ремешок):
- Strap Name: `classic`
- Title: `Classic`
- Description: `Классический кожаный ремешок`
- Price: `7990`
- ✅ Is Active

**Strap Params** (параметры для Classic):
- Watch Strap: выберите `Classic`
- Strap Name: `classic`
- Leather Colors: добавьте 2-3 цвета (Черный, Коричневый)
- Stitching Colors: Черная, Белая
- Edge Colors: Черный
- Buckle Colors: Silver, Black
- Adapter Colors: Silver, Black

**Additional Options**:
- Title: `Дополнительные опции`
- Description: `Персонализируйте ваш ремешок`
- Options:
  - Initials (text, 390₽)
  - Present Box (checkbox, 300₽)

**Promo Codes** (опционально):
- Code: `TEST10`
- Discount Type: `percent`
- Discount Value: `10`
- ✅ Is Active

### 6. Проверьте работу

1. Откройте http://localhost:3000/configurator
2. Вы должны увидеть модели часов из CMS
3. Выберите модель → Выберите ремешок → Настройте дизайн
4. Все данные загружаются из Payload CMS! 🎉

## 📝 Важные URL

| Приложение | URL | Что здесь |
|-----------|-----|-----------|
| **Конфигуратор** | http://localhost:3000/configurator | Основное приложение |
| **CMS Admin** | http://localhost:3001/admin | Управление контентом |
| **Backend API** | http://localhost:3002/cms/watch-models | API для фронтенда |
| **Payload API** | http://localhost:3001/api/watch-models | CMS API |

## 🔧 Команды

```bash
# Остановить MongoDB
brew services stop mongodb-community  # macOS

# Перезапустить CMS
cd cms && npm run dev

# Посмотреть данные в MongoDB
mongo
> use watch-configurator
> db.watch-models.find()

# Пересобрать TypeScript
cd cms && npm run build
cd backend && npm run build
```

## 📚 Дополнительная документация

- `README.md` - Общая информация
- `INTEGRATION.md` - Подробная интеграция
- `ENV_SETUP.md` - Переменные окружения
- `cms/SETUP.md` - Настройка CMS
- `cms/seed-data.md` - Примеры данных

## ❓ Проблемы?

### CMS не запускается
```bash
# Проверьте MongoDB
brew services list
# Если не запущен:
brew services start mongodb-community
```

### Ошибка подключения к БД
Проверьте `cms/.env`:
```env
DATABASE_URI=mongodb://localhost:27017/watch-configurator
```

### Данные не загружаются
1. Проверьте что все 3 сервиса запущены
2. Откройте http://localhost:3001/api/watch-models
3. Должен вернуться JSON с данными

### Порты заняты
Измените порты в `.env` файлах

## ✅ Готово!

Теперь у вас работает полная система с CMS! 

Управляйте контентом через http://localhost:3001/admin, и все изменения автоматически отобразятся на фронтенде.

