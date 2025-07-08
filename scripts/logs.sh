#!/bin/bash

# Script para ver logs de los servicios
# Kafka + NestJS Microservices Example

SERVICE=$1

if [ -z "$SERVICE" ]; then
    echo "📋 Mostrando logs de todos los servicios..."
    docker-compose logs -f
else
    echo "📋 Mostrando logs de $SERVICE..."
    docker-compose logs -f $SERVICE
fi

echo ""
echo "💡 Uso: ./scripts/logs.sh [servicio]"
echo "   Servicios disponibles: users-service, notifications-service, kafka, zookeeper, kafdrop"
