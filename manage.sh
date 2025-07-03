#!/bin/bash

# Script para gestionar el monorepo de microservicios

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}🚀 Gestión del Monorepo de Microservicios${NC}"
    echo ""
    echo "Uso: ./manage.sh [COMANDO]"
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
    echo ""
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
    echo -e "${YELLOW}🚀 Iniciando servicios...${NC}"
    docker-compose up -d --build
    echo -e "${GREEN}✅ Servicios iniciados${NC}"
    
    echo -e "${BLUE}Esperando que los servicios estén listos...${NC}"
    sleep 10
    
    show_status
}

# Función para detener servicios
stop_services() {
    echo -e "${YELLOW}🛑 Deteniendo servicios...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Servicios detenidos${NC}"
}

# Función para reiniciar servicios
restart_services() {
    echo -e "${YELLOW}🔄 Reiniciando servicios...${NC}"
    docker-compose down
    docker-compose up -d --build
    echo -e "${GREEN}✅ Servicios reiniciados${NC}"
}

# Función para construir imágenes
build_services() {
    echo -e "${YELLOW}🔨 Construyendo imágenes...${NC}"
    docker-compose build
    echo -e "${GREEN}✅ Imágenes construidas${NC}"
}

# Función para mostrar logs
show_logs() {
    if [ -z "$1" ]; then
        echo -e "${BLUE}📋 Mostrando logs de todos los servicios...${NC}"
        docker-compose logs -f
    else
        echo -e "${BLUE}📋 Mostrando logs del servicio: $1${NC}"
        docker-compose logs -f "$1"
    fi
}

# Función para mostrar estado
show_status() {
    echo -e "${BLUE}📊 Estado de los servicios:${NC}"
    docker-compose ps
    echo ""
    
    # Verificar health de los servicios
    echo -e "${BLUE}🔍 Verificando salud de los servicios:${NC}"
    
    # API Gateway
    if curl -s http://localhost/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ API Gateway (Puerto 80) - OK${NC}"
    else
        echo -e "${RED}❌ API Gateway (Puerto 80) - NO DISPONIBLE${NC}"
    fi
    
    # Users Service
    if curl -s http://localhost/api/users/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Users Service (Puerto 3001) - OK${NC}"
    else
        echo -e "${RED}❌ Users Service (Puerto 3001) - NO DISPONIBLE${NC}"
    fi
    
    # Notifications Service
    if curl -s http://localhost/api/notifications/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Notifications Service (Puerto 3002) - OK${NC}"
    else
        echo -e "${RED}❌ Notifications Service (Puerto 3002) - NO DISPONIBLE${NC}"
    fi
}

# Función para probar endpoints
test_endpoints() {
    echo -e "${BLUE}🧪 Probando endpoints...${NC}"
    
    # Test API Gateway
    echo -e "${YELLOW}Testing API Gateway...${NC}"
    curl -s http://localhost/ | jq .
    
    # Test Users Service
    echo -e "${YELLOW}Testing Users Service...${NC}"
    curl -s http://localhost/api/users | jq .
    
    # Test Notifications Service
    echo -e "${YELLOW}Testing Notifications Service...${NC}"
    curl -s http://localhost/api/notifications | jq .
}

# Función para limpiar
clean_all() {
    echo -e "${YELLOW}🧹 Limpiando contenedores y volúmenes...${NC}"
    docker-compose down -v --remove-orphans
    docker system prune -f
    echo -e "${GREEN}✅ Limpieza completada${NC}"
}

# Verificar Docker antes de ejecutar comandos
check_docker

# Procesar argumentos
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
