# Watch Configurator CMS

Payload CMS для управления контентом конфигуратора ремешков.

## Установка

```bash
npm install
```

## Настройка

1. Создайте файл `.env` на основе `.env.example`
2. Убедитесь, что MongoDB запущен
3. Обновите `DATABASE_URI` и `PAYLOAD_SECRET` в `.env`

```env
DATABASE_URI=mongodb://localhost:27017/watch-configurator
PAYLOAD_SECRET=your-secret-key
PORT=3001
```

## Запуск

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run serve
```

## API

После запуска CMS доступна по адресу:
- Admin Panel: http://localhost:3001/admin
- API: http://localhost:3001/api

## Коллекции

### Watch Models (Модели часов)
Управление моделями часов (Apple Watch, Samsung Galaxy Watch и т.д.)

### Watch Straps (Ремешки)
Управление моделями ремешков (Brogue, Classic и т.д.)

### Strap Params (Параметры ремешков)
Настройка параметров дизайна для каждого ремешка (цвета кожи, строчки и т.д.)

### Additional Options (Дополнительные опции)
Управление дополнительными опциями заказа (инициалы, подарочная упаковка и т.д.)

### Promo Codes (Промокоды)
Управление промокодами и скидками

### Media (Медиа)
Управление изображениями и медиафайлами

