# Настройка переменных окружения

## CMS (.env)

Создайте файл `/cms/.env`:

```env
DATABASE_URI=mongodb://localhost:27017/watch-configurator
PAYLOAD_SECRET=watch-configurator-secret-key-2025
PORT=3001
```

## Backend (.env)

Создайте файл `/backend/.env`:

```env
CMS_API_URL=http://localhost:3001/api
PORT=3002
```

## Frontend (.env.local)

Создайте файл `/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

## Для Production

### CMS
```env
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/watch-configurator
PAYLOAD_SECRET=your-super-secret-production-key
PORT=3001
PAYLOAD_PUBLIC_SERVER_URL=https://cms.yourdomain.com
```

### Backend
```env
CMS_API_URL=https://cms.yourdomain.com/api
PORT=3002
```

### Frontend
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Команды для создания файлов

```bash
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

