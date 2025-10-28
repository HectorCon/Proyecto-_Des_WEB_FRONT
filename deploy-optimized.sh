#!/bin/bash
# Script de optimización para deployment en VPS de capa gratuita

echo "🚀 Iniciando deployment optimizado para VPS..."

# Limpiar imágenes Docker no utilizadas
echo "🧹 Limpiando imágenes Docker no utilizadas..."
docker system prune -f
docker image prune -f

# Verificar memoria disponible
echo "💾 Verificando memoria disponible..."
free -h

# Construir con límites de memoria
echo "🔨 Construyendo imagen optimizada..."
DOCKER_BUILDKIT=1 docker compose build --no-cache --build-arg BUILDKIT_INLINE_CACHE=1

# Verificar tamaño de la imagen
echo "📏 Tamaño de la imagen:"
docker images | grep proyecto_escuela_frontend

# Iniciar servicios
echo "▶️ Iniciando servicios..."
docker compose up -d

# Verificar estado
echo "✅ Verificando estado de los servicios..."
docker compose ps

echo "🎉 Deployment completado!"
echo "📊 Uso de recursos:"
docker stats --no-stream