# PowerShell скрипт для полной очистки и перезапуска проекта через Docker Compose

Write-Host "🧹 Останавливаем и удаляем контейнеры..." -ForegroundColor Yellow
docker compose down -v

Write-Host "🗑️  Удаляем старые образы..." -ForegroundColor Yellow
docker compose down --rmi all 2>$null

Write-Host "🔨 Собираем образы заново..." -ForegroundColor Yellow
docker compose build --no-cache

Write-Host "🚀 Запускаем контейнеры..." -ForegroundColor Yellow
docker compose up -d

Write-Host "⏳ Ждем запуска сервера..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "📊 Статус контейнеров:" -ForegroundColor Cyan
docker compose ps

Write-Host ""
Write-Host "📝 Логи (последние 50 строк):" -ForegroundColor Cyan
docker compose logs --tail=50

Write-Host ""
Write-Host "✅ Проект перезапущен!" -ForegroundColor Green
Write-Host "🌐 Приложение доступно по адресу: http://localhost:8081" -ForegroundColor Green
Write-Host ""
Write-Host "Для просмотра логов в реальном времени используйте:" -ForegroundColor Yellow
Write-Host "  docker compose logs -f backend" -ForegroundColor Yellow






