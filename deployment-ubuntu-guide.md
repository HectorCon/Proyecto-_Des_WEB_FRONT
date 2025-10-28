# 🚀 Guía de Deployment en VPS Ubuntu

## 1. Preparar el VPS (solo la primera vez)

### Actualizar sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### Instalar Docker
```bash
# Instalar dependencias
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y

# Agregar Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Agregar repositorio Docker
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io -y

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
```

### Instalar Docker Compose
```bash
# Descargar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Dar permisos de ejecución
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
docker-compose --version
```

### Configurar Swap (importante para VPS gratuita)
```bash
# Crear archivo swap de 1GB
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Hacer permanente el swap
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verificar swap
free -h
```

### Reiniciar para aplicar cambios de grupo
```bash
sudo reboot
```

## 2. Clonar y Deployar tu proyecto

### Clonar repositorio
```bash
# Instalar Git si no está instalado
sudo apt install git -y

# Clonar tu repositorio
git clone https://github.com/HectorCon/Proyecto-_Des_WEB_FRONT.git

# Entrar al directorio
cd Proyecto-_Des_WEB_FRONT
```

### Deployment Optimizado
```bash
# Limpiar Docker (por si hay imágenes previas)
docker system prune -f
docker image prune -f

# Verificar memoria disponible
free -h

# Habilitar BuildKit para optimización
export DOCKER_BUILDKIT=1

# Construir y ejecutar (optimizado)
docker-compose up -d --build --force-recreate

# Verificar estado
docker-compose ps
docker stats --no-stream
```

## 3. Comandos de Mantenimiento

### Verificar logs
```bash
# Ver logs del contenedor
docker-compose logs -f frontend

# Ver logs de las últimas 100 líneas
docker-compose logs --tail=100 frontend
```

### Restart servicios
```bash
# Reiniciar servicios
docker-compose restart

# Parar servicios
docker-compose down

# Iniciar servicios
docker-compose up -d
```

### Actualizar aplicación
```bash
# Pull cambios del repositorio
git pull origin main

# Reconstruir y deployar
docker-compose up -d --build --force-recreate
```

### Monitoreo de recursos
```bash
# Monitorear uso de CPU/RAM
htop

# Ver uso de disco
df -h

# Ver procesos Docker
docker ps

# Ver estadísticas de contenedores
docker stats
```

### Limpiar espacio (cuando sea necesario)
```bash
# Limpiar imágenes no utilizadas
docker system prune -f

# Limpiar todo (cuidado - elimina todo lo no usado)
docker system prune -a -f

# Ver espacio usado por Docker
docker system df
```

## 4. Comandos de Troubleshooting

### Si el build falla por memoria
```bash
# Verificar memoria
free -h

# Parar otros servicios si es necesario
sudo systemctl stop apache2 nginx

# Intentar build con menos paralelismo
docker-compose build --parallel 1

# O build sin cache
docker-compose build --no-cache
```

### Si el puerto está ocupado
```bash
# Ver qué usa el puerto 8081
sudo lsof -i :8081

# Cambiar puerto en docker-compose.yml y rebuild
```

### Verificar conectividad
```bash
# Probar desde el VPS
curl http://localhost:8081

# Ver firewall (si aplicable)
sudo ufw status
```

## 5. Comandos Rápidos para Deployment Diario

```bash
# Comando completo de deployment
cd Proyecto-_Des_WEB_FRONT && \
git pull origin main && \
docker system prune -f && \
export DOCKER_BUILDKIT=1 && \
docker-compose up -d --build --force-recreate && \
docker-compose ps
```