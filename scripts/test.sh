#!/bin/bash

# Script para probar la integración entre microservicios
# Kafka + NestJS Microservices Example

echo "🧪 Probando la integración de microservicios..."

# Verificar que los servicios estén corriendo
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Los servicios no están corriendo. Ejecuta ./scripts/start.sh primero."
    exit 1
fi

echo "📡 Probando Users Service..."

# Crear un usuario de prueba
USER_DATA='{
  "email": "test@example.com",
  "nombre": "Test User",
  "password": "password123"
}'

echo "📝 Creando usuario de prueba..."
RESPONSE=$(curl -s -X POST http://localhost:3000/users/v1/users \
  -H "Content-Type: application/json" \
  -d "$USER_DATA")

echo "✅ Respuesta del Users Service:"
echo "$RESPONSE"

USER_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

if [ -n "$USER_ID" ]; then
    echo ""
    echo "📋 Usuario creado con ID: $USER_ID"
    
    echo ""
    echo "📡 Consultando usuario creado..."
    curl -s http://localhost:3000/users/v1/users/$USER_ID | jq .
    
    echo ""
    echo "🔔 Verifica los logs del Notifications Service para ver el evento recibido:"
    echo "   docker-compose logs notifications-service --tail=10"
else
    echo "❌ No se pudo crear el usuario"
fi

echo ""
echo "🌐 URLs para monitoreo:"
echo "   - Kafdrop (UI de Kafka): http://localhost:9000"
echo "   - Users Service: http://localhost:3000/users/v1"
