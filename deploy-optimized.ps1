# Script de deployment optimizado para VPS - PowerShell
Write-Host "🚀 Iniciando deployment optimizado para VPS..." -ForegroundColor Green

# Limpiar imágenes Docker no utilizadas
Write-Host "🧹 Limpiando imágenes Docker no utilizadas..." -ForegroundColor Yellow
docker system prune -f
docker image prune -f

# Construir con BuildKit habilitado
Write-Host "🔨 Construyendo imagen optimizada..." -ForegroundColor Yellow
$env:DOCKER_BUILDKIT = "1"
docker compose build --no-cache --build-arg BUILDKIT_INLINE_CACHE=1

# Verificar tamaño de la imagen
Write-Host "📏 Tamaño de la imagen:" -ForegroundColor Cyan
docker images | Select-String "proyecto_escuela_frontend"

# Iniciar servicios
Write-Host "▶️ Iniciando servicios..." -ForegroundColor Yellow
docker compose up -d

# Verificar estado
Write-Host "✅ Verificando estado de los servicios..." -ForegroundColor Green
docker compose ps

Write-Host "🎉 Deployment completado!" -ForegroundColor Green
Write-Host "📊 Uso de recursos:" -ForegroundColor Cyan
docker stats --no-stream