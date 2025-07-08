#!/bin/bash

# Script para mostrar el estado completo del sistema
# Kafka + NestJS Microservices Example

echo "📊 Estado del Sistema - Kafka + NestJS Microservices"
echo "================================================="

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo"
    exit 1
fi

echo ""
echo "🐳 Estado de los contenedores:"
docker-compose ps

echo ""
echo "🌐 URLs de acceso:"
echo "   - Users Service: http://localhost:3000"
echo "   - Notifications Service: http://localhost:3001"
echo "   - Kafdrop (UI de Kafka): http://localhost:9000"

echo ""
echo "🔗 Pruebas rápidas:"
echo "   Users Service Health:"
USERS_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/users/v1 2>/dev/null || echo "000")
if [ "$USERS_HEALTH" = "200" ]; then
    echo "   ✅ Users Service: OK"
else
    echo "   ❌ Users Service: No disponible (código: $USERS_HEALTH)"
fi

echo "   Notifications Service Health:"
NOTIFICATIONS_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 2>/dev/null || echo "000")
if [ "$NOTIFICATIONS_HEALTH" = "200" ]; then
    echo "   ✅ Notifications Service: OK"
else
    echo "   ❌ Notifications Service: No disponible (código: $NOTIFICATIONS_HEALTH)"
fi

echo "   Kafdrop Health:"
KAFDROP_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9000 2>/dev/null || echo "000")
if [ "$KAFDROP_HEALTH" = "200" ]; then
    echo "   ✅ Kafdrop: OK"
else
    echo "   ❌ Kafdrop: No disponible (código: $KAFDROP_HEALTH)"
fi

echo ""
echo "📁 Volúmenes y datos:"
if [ -f "./data/users.db" ]; then
    echo "   ✅ Base de datos SQLite: Existe"
    USER_COUNT=$(sqlite3 ./data/users.db "SELECT COUNT(*) FROM user;" 2>/dev/null || echo "N/A")
    echo "   📊 Usuarios en BD: $USER_COUNT"
else
    echo "   ⚠️  Base de datos SQLite: No encontrada"
fi

echo ""
echo "🛠️ Comandos útiles:"
echo "   - Ver logs: ./scripts/logs.sh [servicio]"
echo "   - Probar integración: ./scripts/test.sh"
echo "   - Detener servicios: ./scripts/stop.sh"
echo "   - Limpiar todo: ./scripts/clean.sh"
