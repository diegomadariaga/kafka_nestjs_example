#!/bin/bash

# Script para demostrar el flujo completo de Kafka
# Usuario creado → Evento Kafka → Notificación automática

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuración
GATEWAY_URL="http://localhost"
GATEWAY_PORT=80

echo -e "${BLUE}🚀 DEMOSTRACIÓN COMPLETA DE KAFKA${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Función para esperar que los servicios estén listos
wait_for_services() {
    echo -e "${YELLOW}⏳ Esperando que los servicios estén listos...${NC}"
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$GATEWAY_PORT/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ API Gateway está listo${NC}"
            break
        fi
        
        echo -e "${CYAN}   Intento $attempt/$max_attempts - Esperando...${NC}"
        sleep 2
        ((attempt++))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        echo -e "${RED}❌ Los servicios no están listos después de $max_attempts intentos${NC}"
        exit 1
    fi
    
    sleep 5  # Esperar un poco más para Kafka
}

# Función para mostrar el estado inicial
show_initial_state() {
    echo -e "${BLUE}📋 Estado inicial:${NC}"
    echo ""
    
    echo -e "${CYAN}Usuarios existentes:${NC}"
    curl -s http://localhost:$GATEWAY_PORT/api/users | jq . 2>/dev/null || echo "Error obteniendo usuarios"
    echo ""
    
    echo -e "${CYAN}Notificaciones existentes:${NC}"  
    curl -s http://localhost:$GATEWAY_PORT/api/notifications | jq . 2>/dev/null || echo "Error obteniendo notificaciones"
    echo ""
}

# Función para crear un usuario y demostrar el flujo
demonstrate_kafka_flow() {
    echo -e "${YELLOW}🔄 DEMOSTRACIÓN DEL FLUJO KAFKA:${NC}"
    echo -e "${YELLOW}1. Crear usuario → 2. Evento Kafka → 3. Notificación automática${NC}"
    echo ""
    
    # Paso 1: Crear usuario
    echo -e "${CYAN}📝 Paso 1: Creando nuevo usuario...${NC}"
    
    local user_data='{
        "name": "Ana García", 
        "email": "ana.garcia@example.com"
    }'
    
    echo -e "${BLUE}Datos del usuario:${NC} $user_data"
    
    local new_user=$(curl -s -X POST http://localhost:$GATEWAY_PORT/api/users \
        -H "Content-Type: application/json" \
        -d "$user_data")
    
    echo -e "${GREEN}✅ Usuario creado:${NC}"
    echo "$new_user" | jq . 2>/dev/null || echo "$new_user"
    echo ""
    
    # Paso 2: Esperar procesamiento de Kafka
    echo -e "${CYAN}⏳ Paso 2: Esperando que Kafka procese el evento...${NC}"
    echo -e "${YELLOW}   (El evento USER_CREATED se envía automáticamente)${NC}"
    sleep 3
    echo ""
    
    # Paso 3: Verificar notificación creada
    echo -e "${CYAN}🔔 Paso 3: Verificando notificación automática...${NC}"
    
    local notifications=$(curl -s http://localhost:$GATEWAY_PORT/api/notifications)
    echo -e "${GREEN}✅ Notificaciones actuales:${NC}"
    echo "$notifications" | jq . 2>/dev/null || echo "$notifications"
    echo ""
    
    # Extraer ID del usuario para filtrar notificaciones
    local user_id=$(echo "$new_user" | jq -r '.id' 2>/dev/null)
    if [ "$user_id" != "null" ] && [ -n "$user_id" ]; then
        echo -e "${CYAN}🎯 Notificaciones específicas para el usuario $user_id:${NC}"
        curl -s "http://localhost:$GATEWAY_PORT/api/notifications?userId=$user_id" | jq . 2>/dev/null || echo "Error obteniendo notificaciones del usuario"
        echo ""
    fi
}

# Función para demostrar más casos de uso
demonstrate_update_flow() {
    echo -e "${YELLOW}🔄 DEMOSTRACIÓN: Actualizar usuario → Evento Kafka → Notificación${NC}"
    echo ""
    
    # Actualizar el primer usuario
    echo -e "${CYAN}📝 Actualizando usuario con ID 1...${NC}"
    
    local update_data='{
        "name": "Juan Carlos Pérez",
        "email": "juan.carlos@example.com"
    }'
    
    echo -e "${BLUE}Nuevos datos:${NC} $update_data"
    
    local updated_user=$(curl -s -X PUT http://localhost:$GATEWAY_PORT/api/users/1 \
        -H "Content-Type: application/json" \
        -d "$update_data")
    
    echo -e "${GREEN}✅ Usuario actualizado:${NC}"
    echo "$updated_user" | jq . 2>/dev/null || echo "$updated_user"
    echo ""
    
    echo -e "${CYAN}⏳ Esperando procesamiento del evento USER_UPDATED...${NC}"
    sleep 3
    echo ""
    
    echo -e "${CYAN}🔔 Nuevas notificaciones:${NC}"
    curl -s "http://localhost:$GATEWAY_PORT/api/notifications?userId=1" | jq . 2>/dev/null || echo "Error obteniendo notificaciones"
    echo ""
}

# Función para mostrar logs de Kafka
show_kafka_logs() {
    echo -e "${YELLOW}📋 Logs recientes de los servicios (últimas 10 líneas):${NC}"
    echo ""
    
    echo -e "${CYAN}--- Users Service ---${NC}"
    docker-compose --env-file .env logs --tail=10 users-service 2>/dev/null || echo "Error obteniendo logs"
    echo ""
    
    echo -e "${CYAN}--- Notifications Service ---${NC}"
    docker-compose --env-file .env logs --tail=10 notifications-service 2>/dev/null || echo "Error obteniendo logs"
    echo ""
}

# Función para mostrar comandos de monitoreo
show_monitoring_commands() {
    echo -e "${BLUE}🛠️  COMANDOS PARA MONITOREO MANUAL:${NC}"
    echo ""
    
    echo -e "${CYAN}Ver todos los topics:${NC}"
    echo "docker exec kafka_nestjs_example-kafka-1 kafka-topics --list --bootstrap-server localhost:9092"
    echo ""
    
    echo -e "${CYAN}Ver detalles del topic 'user-events':${NC}"
    echo "docker exec kafka_nestjs_example-kafka-1 kafka-topics --describe --topic user-events --bootstrap-server localhost:9092"
    echo ""
    
    echo -e "${CYAN}Consumir mensajes en tiempo real:${NC}"
    echo "docker exec kafka_nestjs_example-kafka-1 kafka-console-consumer --topic user-events --bootstrap-server localhost:9092"
    echo ""
    
    echo -e "${CYAN}Ver consumer groups:${NC}"
    echo "docker exec kafka_nestjs_example-kafka-1 kafka-consumer-groups --list --bootstrap-server localhost:9092"
    echo ""
}

# Función principal
main() {
    wait_for_services
    show_initial_state
    demonstrate_kafka_flow
    demonstrate_update_flow
    show_kafka_logs
    show_monitoring_commands
    
    echo -e "${GREEN}🎉 DEMOSTRACIÓN COMPLETADA${NC}"
    echo -e "${YELLOW}💡 Revisa los logs arriba para ver los eventos de Kafka en tiempo real${NC}"
}

# Ejecutar si se llama directamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
