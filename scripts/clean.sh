#!/bin/bash

# Script para limpiar completamente el proyecto
# Kafka + NestJS Microservices Example

echo "🧹 Limpiando proyecto completamente..."

# Detener y eliminar contenedores, redes, volúmenes e imágenes
docker-compose down -v --rmi all --remove-orphans

# Limpiar imágenes huérfanas
docker image prune -f

echo "✅ Limpieza completada!"
echo ""
echo "⚠️  Se han eliminado:"
echo "   - Todos los contenedores"
echo "   - Todas las imágenes del proyecto"
echo "   - Todos los volúmenes"
echo "   - Todas las redes"
echo ""
echo "🚀 Para volver a iniciar: ./scripts/start.sh"
