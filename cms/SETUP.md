# Настройка Payload CMS

## Требования

- Node.js 18+
- MongoDB (локальный или удаленный)
- npm или yarn

## Установка

1. **Установите зависимости:**
   ```bash
   cd cms
   npm install
   ```

2. **Настройте переменные окружения:**
   
   Создайте файл `.env` в папке `cms`:
   ```env
   DATABASE_URI=mongodb://localhost:27017/watch-configurator
   PAYLOAD_SECRET=your-secret-key-change-this
   PORT=3001
   ```

3. **Запустите MongoDB:**
   
   Если используете локальный MongoDB:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

4. **Запустите CMS:**
   
   Development режим:
   ```bash
   npm run dev
   ```
   
   Production режим:
   ```bash
   npm run build
   npm run serve
   ```

5. **Откройте админ панель:**
   
   Перейдите на http://localhost:3001/admin
   
   При первом запуске создайте администратора.

## Наполнение данными

После первого входа в админ панель, создайте:

1. **Watch Models** (Модели часов):
   - Apple Watch 4-6 серия, SE (40mm, 44mm)
   - Apple Watch 7-9 серия (41mm, 45mm)
   - Apple Watch 10 серия (42mm, 46mm)
   - Apple Watch Ultra 1-2 (49mm)

2. **Watch Straps** (Ремешки):
   - Brogue
   - Classic
   - Modern
   - Sport

3. **Strap Params** (Параметры ремешков):
   Для каждого ремешка настройте:
   - Цвета кожи
   - Цвета строчки
   - Цвета края
   - Цвета пряжки
   - Цвета адаптера

4. **Additional Options** (Дополнительные опции):
   - Нанесение инициалов
   - Подарочная упаковка
   - Открытка

5. **Promo Codes** (Промокоды):
   - Создайте тестовые промокоды

## API Endpoints

После запуска CMS, API доступно по адресу: http://localhost:3001/api

- `GET /api/watch-models` - Все модели часов
- `GET /api/watch-straps` - Все ремешки
- `GET /api/strap-params` - Параметры ремешков
- `GET /api/additional-options` - Дополнительные опции
- `GET /api/promo-codes` - Промокоды
- `GET /api/media` - Медиафайлы

## Интеграция с Backend

Backend автоматически подключается к CMS через переменную окружения:

В `/backend/.env`:
```env
CMS_API_URL=http://localhost:3001/api
```

Backend предоставляет следующие эндпоинты:
- `GET /cms/watch-models`
- `GET /cms/watch-straps`
- `GET /cms/strap-params/:strapId`
- `GET /cms/additional-options`
- `POST /cms/validate-promo` (body: { code: string })
- `POST /cms/increment-promo-usage` (body: { code: string })

