#!/bin/bash

# Script para detener todos los servicios del proyecto
# Kafka + NestJS Microservices Example

echo "🛑 Deteniendo todos los servicios..."

# Detener y eliminar contenedores
docker-compose down

echo "✅ Servicios detenidos correctamente!"
echo ""
echo "💡 Para limpiar completamente (incluyendo volúmenes): ./scripts/clean.sh"
