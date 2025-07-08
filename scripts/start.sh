#!/bin/bash

# Script para iniciar todos los servicios del proyecto
# Kafka + NestJS Microservices Example

echo "🚀 Iniciando todos los servicios..."

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Por favor, inicia Docker primero."
    exit 1
fi

# Construir las imágenes
echo "🔨 Construyendo imágenes..."
docker-compose build

# Iniciar los servicios
echo "⚡ Iniciando servicios..."
docker-compose up -d

# Esperar a que todos los servicios estén listos
echo "⏳ Esperando a que todos los servicios estén listos..."
sleep 10

# Verificar el estado de los servicios
echo "📊 Estado de los servicios:"
docker-compose ps

echo ""
echo "✅ Servicios iniciados correctamente!"
echo ""
echo "📋 URLs disponibles:"
echo "   - Users Service: http://localhost:3000"
echo "   - Notifications Service: http://localhost:3001"
echo "   - Kafdrop (UI de Kafka): http://localhost:9000"
echo ""
echo "🔧 Para ver los logs: ./scripts/logs.sh"
echo "🛑 Para detener los servicios: ./scripts/stop.sh"
