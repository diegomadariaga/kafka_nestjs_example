#!/bin/bash

# Script para gestionar el monorepo de microservicios

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables de entorno
ENV_FILE=".env"

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}🚀 Gestión del Monorepo de Microservicios${NC}"
    echo ""
    echo "Uso: ./manage.sh [COMANDO] [OPCIONES]"
    echo ""
    echo "Comandos disponibles:"
    echo -e "  ${GREEN}start${NC}          - Iniciar todos los servicios"
    echo -e "  ${GREEN}stop${NC}           - Detener todos los servicios"
    echo -e "  ${GREEN}restart${NC}        - Reiniciar todos los servicios"
    echo -e "  ${GREEN}build${NC}          - Construir todas las imágenes"
    echo -e "  ${GREEN}logs${NC}           - Ver logs de todos los servicios"
    echo -e "  ${GREEN}logs [service]${NC} - Ver logs de un servicio específico"
    echo -e "  ${GREEN}status${NC}         - Ver estado de los servicios"
    echo -e "  ${GREEN}test${NC}           - Probar los endpoints"
    echo -e "  ${GREEN}clean${NC}          - Limpiar contenedores y volúmenes"
    echo -e "  ${GREEN}install${NC}        - Instalar dependencias en todos los servicios"
    echo -e "  ${GREEN}env${NC}            - Mostrar variables de entorno actuales"
    echo ""
    echo "Opciones de entorno:"
    echo -e "  ${YELLOW}--env dev${NC}      - Usar .env (desarrollo - por defecto)"
    echo -e "  ${YELLOW}--env prod${NC}     - Usar .env.production"
    echo -e "  ${YELLOW}--env test${NC}     - Usar .env.test"
    echo ""
    echo "Ejemplos:"
    echo -e "  ${BLUE}./manage.sh start --env prod${NC}"
    echo -e "  ${BLUE}./manage.sh logs users-service${NC}"
    echo -e "  ${BLUE}./manage.sh test --env test${NC}"
    echo ""
}

# Función para procesar argumentos de entorno
process_env_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --env)
                case $2 in
                    prod|production)
                        ENV_FILE=".env.production"
                        echo -e "${YELLOW}📋 Usando entorno de producción${NC}"
                        ;;
                    test|testing)
                        ENV_FILE=".env.test"
                        echo -e "${YELLOW}📋 Usando entorno de testing${NC}"
                        ;;
                    dev|development)
                        ENV_FILE=".env"
                        echo -e "${YELLOW}📋 Usando entorno de desarrollo${NC}"
                        ;;
                    *)
                        echo -e "${RED}❌ Entorno no reconocido: $2${NC}"
                        echo -e "Entornos disponibles: dev, prod, test"
                        exit 1
                        ;;
                esac
                shift 2
                ;;
            *)
                shift
                ;;
        esac
    done
}

# Función para verificar archivo de entorno
check_env_file() {
    if [ ! -f "$ENV_FILE" ]; then
        echo -e "${RED}❌ Archivo de entorno no encontrado: $ENV_FILE${NC}"
        echo -e "${YELLOW}💡 Crea el archivo desde el ejemplo:${NC}"
        echo -e "   cp .env.example $ENV_FILE"
        exit 1
    fi
    echo -e "${GREEN}✅ Usando archivo de entorno: $ENV_FILE${NC}"
}

# Función para mostrar variables de entorno
show_env() {
    echo -e "${BLUE}📋 Variables de entorno desde $ENV_FILE:${NC}"
    echo ""
    if [ -f "$ENV_FILE" ]; then
        grep -E "^[A-Z]" "$ENV_FILE" | head -20
        echo ""
        echo -e "${YELLOW}💡 Archivo completo: $ENV_FILE${NC}"
    else
        echo -e "${RED}❌ Archivo no encontrado: $ENV_FILE${NC}"
    fi
}

# Función para verificar si Docker está corriendo
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker no está corriendo. Por favor inicia Docker Desktop.${NC}"
        exit 1
    fi
}

# Función para instalar dependencias
install_deps() {
    echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
    
    echo -e "${BLUE}Instalando dependencias del servicio de usuarios...${NC}"
    cd services/users && npm install && cd ../..
    
    echo -e "${BLUE}Instalando dependencias del servicio de notificaciones...${NC}"
    cd services/notifications && npm install && cd ../..
    
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
}

# Función para iniciar servicios
start_services() {
    echo -e "${YELLOW}🚀 Iniciando servicios con $ENV_FILE...${NC}"
    docker-compose --env-file "$ENV_FILE" up -d --build
    echo -e "${GREEN}✅ Servicios iniciados${NC}"
    
    echo -e "${BLUE}Esperando que los servicios estén listos...${NC}"
    sleep 10
    
    show_status
}

# Función para detener servicios
stop_services() {
    echo -e "${YELLOW}🛑 Deteniendo servicios...${NC}"
    docker-compose --env-file "$ENV_FILE" down
    echo -e "${GREEN}✅ Servicios detenidos${NC}"
}

# Función para reiniciar servicios
restart_services() {
    echo -e "${YELLOW}🔄 Reiniciando servicios...${NC}"
    docker-compose --env-file "$ENV_FILE" down
    docker-compose --env-file "$ENV_FILE" up -d --build
    echo -e "${GREEN}✅ Servicios reiniciados${NC}"
}

# Función para construir imágenes
build_services() {
    echo -e "${YELLOW}🔨 Construyendo imágenes...${NC}"
    docker-compose --env-file "$ENV_FILE" build
    echo -e "${GREEN}✅ Imágenes construidas${NC}"
}

# Función para mostrar logs
show_logs() {
    if [ -z "$1" ]; then
        echo -e "${BLUE}📋 Mostrando logs de todos los servicios...${NC}"
        docker-compose --env-file "$ENV_FILE" logs -f
    else
        echo -e "${BLUE}📋 Mostrando logs del servicio: $1${NC}"
        docker-compose --env-file "$ENV_FILE" logs -f "$1"
    fi
}

# Función para mostrar estado
show_status() {
    echo -e "${BLUE}📊 Estado de los servicios:${NC}"
    docker-compose --env-file "$ENV_FILE" ps
    echo ""
    
    # Leer puerto del gateway desde el archivo .env
    GATEWAY_PORT=$(grep "^GATEWAY_PORT=" "$ENV_FILE" | cut -d '=' -f2)
    
    # Verificar health de los servicios
    echo -e "${BLUE}🔍 Verificando salud de los servicios:${NC}"
    
    # API Gateway
    if curl -s http://localhost:$GATEWAY_PORT/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ API Gateway (Puerto $GATEWAY_PORT) - OK${NC}"
    else
        echo -e "${RED}❌ API Gateway (Puerto $GATEWAY_PORT) - NO DISPONIBLE${NC}"
    fi
    
    # Users Service
    if curl -s http://localhost:$GATEWAY_PORT/api/users/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Users Service - OK${NC}"
    else
        echo -e "${RED}❌ Users Service - NO DISPONIBLE${NC}"
    fi
    
    # Notifications Service
    if curl -s http://localhost:$GATEWAY_PORT/api/notifications/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Notifications Service - OK${NC}"
    else
        echo -e "${RED}❌ Notifications Service - NO DISPONIBLE${NC}"
    fi
}

# Función para probar endpoints
test_endpoints() {
    # Leer puerto del gateway desde el archivo .env
    GATEWAY_PORT=$(grep "^GATEWAY_PORT=" "$ENV_FILE" | cut -d '=' -f2)
    
    echo -e "${BLUE}🧪 Probando endpoints en puerto $GATEWAY_PORT...${NC}"
    
    # Test API Gateway
    echo -e "${YELLOW}Testing API Gateway...${NC}"
    curl -s http://localhost:$GATEWAY_PORT/ | jq . 2>/dev/null || curl -s http://localhost:$GATEWAY_PORT/
    
    # Test Users Service
    echo -e "${YELLOW}Testing Users Service...${NC}"
    curl -s http://localhost:$GATEWAY_PORT/api/users | jq . 2>/dev/null || curl -s http://localhost:$GATEWAY_PORT/api/users
    
    # Test Notifications Service
    echo -e "${YELLOW}Testing Notifications Service...${NC}"
    curl -s http://localhost:$GATEWAY_PORT/api/notifications | jq . 2>/dev/null || curl -s http://localhost:$GATEWAY_PORT/api/notifications
}

# Función para limpiar
clean_all() {
    echo -e "${YELLOW}🧹 Limpiando contenedores y volúmenes...${NC}"
    docker-compose --env-file "$ENV_FILE" down -v --remove-orphans
    docker system prune -f
    echo -e "${GREEN}✅ Limpieza completada${NC}"
}

# Procesar argumentos de entorno primero
process_env_args "$@"

# Verificar Docker antes de ejecutar comandos
check_docker

# Verificar archivo de entorno
check_env_file

# Procesar argumentos principales
case "$1" in
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "build")
        build_services
        ;;
    "logs")
        show_logs "$2"
        ;;
    "status")
        show_status
        ;;
    "test")
        test_endpoints
        ;;
    "clean")
        clean_all
        ;;
    "install")
        install_deps
        ;;
    "env")
        show_env
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Comando no reconocido: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
