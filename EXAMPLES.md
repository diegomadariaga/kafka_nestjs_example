# Ejemplos de uso del Monorepo de Microservicios

## 🚀 Comandos de Docker Compose

### Iniciar todos los servicios
```bash
docker-compose up --build
```

### Iniciar en segundo plano
```bash
docker-compose up -d --build
```

### Ver logs de todos los servicios
```bash
docker-compose logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f users-service
docker-compose logs -f notifications-service
docker-compose logs -f kafka
```

### Detener todos los servicios
```bash
docker-compose down
```

### Limpiar volúmenes y contenedores
```bash
docker-compose down -v --remove-orphans
```

## 🔗 Ejemplos de API a través del Gateway

### Health Checks
```bash
# Gateway health
curl http://localhost/health

# Users service health
curl http://localhost/api/users/health

# Notifications service health
curl http://localhost/api/notifications/health
```

### Gestión de Usuarios

#### Obtener todos los usuarios
```bash
curl http://localhost/api/users
```

#### Crear un usuario
```bash
curl -X POST http://localhost/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García",
    "email": "maria.garcia@example.com"
  }'
```

#### Obtener un usuario específico
```bash
curl http://localhost/api/users/1
```

#### Actualizar un usuario
```bash
curl -X PUT http://localhost/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García López",
    "email": "maria.lopez@example.com"
  }'
```

### Gestión de Notificaciones

#### Obtener todas las notificaciones
```bash
curl http://localhost/api/notifications
```

#### Obtener notificaciones de un usuario específico
```bash
curl http://localhost/api/notifications?userId=1
```

#### Crear una notificación
```bash
curl -X POST http://localhost/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "title": "Nueva actualización",
    "message": "Tu perfil ha sido actualizado correctamente",
    "type": "push"
  }'
```

#### Marcar notificación como enviada
```bash
curl -X POST http://localhost/api/notifications/1/send
```

#### Actualizar una notificación
```bash
curl -X PUT http://localhost/api/notifications/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Actualización importante",
    "status": "sent"
  }'
```

#### Eliminar una notificación
```bash
curl -X DELETE http://localhost/api/notifications/2
```

## 🔄 Flujo completo de ejemplo

### 1. Crear un usuario
```bash
curl -X POST http://localhost/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos Mendez",
    "email": "carlos@example.com"
  }'
```

### 2. Crear notificación de bienvenida para el usuario
```bash
curl -X POST http://localhost/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 3,
    "title": "¡Bienvenido Carlos!",
    "message": "Gracias por registrarte en nuestra plataforma",
    "type": "email"
  }'
```

### 3. Verificar las notificaciones del usuario
```bash
curl http://localhost/api/notifications?userId=3
```

### 4. Marcar la notificación como enviada
```bash
curl -X POST http://localhost/api/notifications/3/send
```

## 🐳 Comandos útiles de Docker

### Ver contenedores en ejecución
```bash
docker ps
```

### Acceder al shell de un contenedor
```bash
docker exec -it kafka_nestjs_example_users-service_1 sh
docker exec -it kafka_nestjs_example_notifications-service_1 sh
```

### Ver uso de recursos
```bash
docker stats
```

### Limpiar imágenes no utilizadas
```bash
docker image prune
```

## 📊 Monitoreo de Kafka

### Listar topics
```bash
docker exec kafka_nestjs_example_kafka_1 kafka-topics --bootstrap-server localhost:9092 --list
```

### Crear un topic manualmente
```bash
docker exec kafka_nestjs_example_kafka_1 kafka-topics --bootstrap-server localhost:9092 --create --topic user-events --partitions 1 --replication-factor 1
```

### Consumir mensajes de un topic
```bash
docker exec kafka_nestjs_example_kafka_1 kafka-console-consumer --bootstrap-server localhost:9092 --topic user-events --from-beginning
```

## 🔧 Desarrollo local

### Instalar dependencias en un servicio específico
```bash
cd services/users && npm install
cd services/notifications && npm install
```

### Ejecutar un servicio en modo desarrollo
```bash
cd services/users && npm run start:dev
cd services/notifications && npm run start:dev
```

### Construir un servicio específico
```bash
cd services/users && npm run build
cd services/notifications && npm run build
```
