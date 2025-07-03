# Monorepo de Microservicios con NestJS y Kafka

Un monorepo que contiene microservicios construidos con NestJS, comunicándose a través de Apache Kafka y orquestados con Docker Compose.

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │     Kafka       │
│    (Nginx)      │    │   (Message      │
│    Port: 80     │    │    Broker)      │
└─────────┬───────┘    └─────────────────┘
          │                      │
          │              ┌───────┴───────┐
          │              │               │
┌─────────▼───────┐    ┌─▼─────────┐   ┌─▼──────────────----┐
│ Users Service   │    │ Notifications │   │  Zookeeper     │
│ Port: 3001      │    │ Service       │   │  Port: 2181    │
│                 │    │ Port: 3002    │   │                │
└─────────────────┘    └───────────────┘   └────────────────┘
```

## 🚀 Microservicios

### 1. Users Service (Puerto 3001)
- Gestión completa de usuarios (CRUD)
- Endpoints: `/users`
- Base de datos en memoria (para desarrollo)

### 2. Notifications Service (Puerto 3002)
- Gestión de notificaciones
- Endpoints: `/notifications`
- Soporte para email, SMS y push notifications

## 📦 Inicio rápido

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)

### Configuración de entorno
```bash
# Copia el archivo de ejemplo y configura las variables
cp .env.example .env

# Edita las variables según tu entorno
nano .env
```

### Ejecutar con Docker Compose
```bash
# Iniciar todos los servicios (desarrollo)
./manage.sh start

# Iniciar en entorno de producción
./manage.sh start --env prod

# Iniciar en entorno de testing
./manage.sh start --env test

# Detener todos los servicios
./manage.sh stop
```

### Desarrollo local
```bash
# Instalar dependencias en todos los servicios
./manage.sh install

# Ver estado de los servicios
./manage.sh status

# Ver variables de entorno actuales
./manage.sh env
```

## 🛠️ Endpoints del API Gateway

Todos los servicios están disponibles a través del API Gateway en `http://localhost`

### General
- `GET /` - Información del API Gateway
- `GET /health` - Estado del API Gateway

### Users Service
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Notifications Service
- `GET /api/notifications` - Obtener todas las notificaciones
- `GET /api/notifications?userId=:id` - Obtener notificaciones por usuario
- `GET /api/notifications/:id` - Obtener notificación por ID
- `POST /api/notifications` - Crear nueva notificación
- `PUT /api/notifications/:id` - Actualizar notificación
- `POST /api/notifications/:id/send` - Marcar notificación como enviada
- `DELETE /api/notifications/:id` - Eliminar notificación

## 📝 Ejemplos de uso

### Crear un usuario
```bash
curl -X POST http://localhost/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana López",
    "email": "ana@example.com"
  }'
```

### Crear una notificación
```bash
curl -X POST http://localhost/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "title": "Bienvenida",
    "message": "¡Bienvenida Ana!",
    "type": "email"
  }'
```

### Obtener notificaciones de un usuario
```bash
curl http://localhost/api/notifications?userId=1
```

## 🏗️ Estructura del proyecto

```
├── services/
│   ├── users/                 # Microservicio de usuarios
│   │   ├── src/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── notifications/         # Microservicio de notificaciones
│       ├── src/
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
├── docker-compose.yml         # Orquestación de servicios
├── nginx.conf                 # Configuración del API Gateway
├── package.json               # Scripts del monorepo
└── README.md
```

## 🔧 Tecnologías utilizadas

- **NestJS** - Framework de Node.js para microservicios
- **TypeScript** - Superset tipado de JavaScript
- **Apache Kafka** - Message broker para comunicación entre servicios
- **Docker & Docker Compose** - Containerización y orquestación
- **Nginx** - API Gateway y load balancer
- **Zookeeper** - Coordinación de servicios para Kafka

## 🚦 Puertos utilizados

- **80** - API Gateway (Nginx)
- **3001** - Users Service
- **3002** - Notifications Service
- **9092** - Kafka Broker
- **2181** - Zookeeper

## � Próximos pasos

- [ ] Implementar comunicación entre servicios via Kafka
- [ ] Agregar autenticación y autorización
- [ ] Implementar base de datos persistente
- [ ] Agregar logging centralizado
- [ ] Implementar monitoring y métricas
- [ ] Agregar tests automatizados
- [ ] CI/CD pipeline