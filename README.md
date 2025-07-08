# Kafka + NestJS Microservices Example

Este proyecto es un ejemplo completo de microservicios usando **NestJS** y **Apache Kafka** con **Docker Compose**.

## 🏗️ Arquitectura

El proyecto consiste en:

- **Users Service** (Puerto 3000): Microservicio para gestión de usuarios
- **Notifications Service** (Puerto 3001): Microservicio para notificaciones
- **Apache Kafka** (Puerto 9092): Message broker para comunicación entre servicios
- **Zookeeper** (Puerto 2181): Coordinador de Kafka
- **Kafdrop** (Puerto 9000): Interfaz web para monitorear Kafka

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Users Service │───▶│      Kafka      │───▶│ Notifications   │
│   (Producer)    │    │                 │    │   Service       │
│                 │    │                 │    │  (Consumer)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SQLite DB     │    │    Kafdrop      │    │  Console Logs   │
│   (users.db)    │    │   (Monitoring)  │    │ (Notifications) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker y Docker Compose instalados
- Node.js 20+ (solo para desarrollo local)

### Iniciar el proyecto

```bash
# Clonar el repositorio
git clone <repository-url>
cd kafka_nestjs_example

# Iniciar todos los servicios
./scripts/start.sh
```

### Probar la integración

```bash
# Ejecutar pruebas de integración
./scripts/test.sh
```

## 📋 Scripts Disponibles

### Scripts de Shell
| Script | Descripción |
|--------|-------------|
| `./scripts/start.sh` | Construye e inicia todos los servicios |
| `./scripts/stop.sh` | Detiene todos los servicios |
| `./scripts/logs.sh [servicio]` | Muestra logs (todos o de un servicio específico) |
| `./scripts/test.sh` | Prueba la integración entre servicios |
| `./scripts/status.sh` | Muestra el estado completo del sistema |
| `./scripts/clean.sh` | Limpia completamente el proyecto |

### Scripts NPM (alternativos)
| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia todos los servicios |
| `npm stop` | Detiene todos los servicios |
| `npm run logs` | Muestra logs de todos los servicios |
| `npm test` | Ejecuta pruebas de integración |
| `npm run status` | Muestra el estado del sistema |
| `npm run clean` | Limpia completamente el proyecto |

## 🌐 URLs de Acceso

Una vez que los servicios estén corriendo:

- **Users Service API**: http://localhost:3000
- **Notifications Service**: http://localhost:3001
- **Kafdrop (UI de Kafka)**: http://localhost:9000

## 📖 Documentación de APIs

### Users Service

#### Crear Usuario
```bash
POST /users/v1/users
Content-Type: application/json

{
  "email": "user@example.com",
  "nombre": "John Doe",
  "password": "password123"
}
```

#### Obtener Usuario
```bash
GET /users/v1/users/{id}
```

### Ejemplo de Uso

```bash
# Crear un usuario
curl -X POST http://localhost:3000/users/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "nombre": "Test User",
    "password": "password123"
  }'

# Obtener usuario por ID
curl http://localhost:3000/users/v1/users/1
```

## 🔄 Flujo de Eventos

1. **Users Service** recibe una petición para crear un usuario
2. **Users Service** guarda el usuario en la base de datos SQLite
3. **Users Service** publica un evento `user.created` en Kafka
4. **Notifications Service** consume el evento y procesa la notificación
5. Se puede monitorear el flujo a través de Kafdrop

## 🛠️ Estructura del Proyecto

```
kafka_nestjs_example/
├── docker-compose.yml          # Configuración de Docker Compose
├── .env                       # Variables de entorno
├── scripts/                   # Scripts de utilidad
│   ├── start.sh              # Iniciar servicios
│   ├── stop.sh               # Detener servicios
│   ├── logs.sh               # Ver logs
│   ├── test.sh               # Probar integración
│   └── clean.sh              # Limpiar proyecto
├── services/
│   ├── users/                # Servicio de usuarios
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── notifications/        # Servicio de notificaciones
│       ├── src/
│       ├── Dockerfile
│       └── package.json
└── README.md                 # Esta documentación
```

### Variables de entorno principales:

- `KAFKA_PORT`: Puerto para Kafka (default: 9092)
- `ZOOKEEPER_PORT`: Puerto para Zookeeper (default: 2181)
- `KAFDROP_PORT`: Puerto para Kafdrop UI (default: 9000)
- `USERS_PORT`: Puerto para el servicio de usuarios (default: 3000)
- `NOTIFICATIONS_PORT`: Puerto para el servicio de notificaciones (default: 3001)

## Uso

### Levantar todos los servicios

```bash
# Construir y levantar todos los servicios
npm run all:up

# Ver logs de todos los servicios
npm run all:logs

# Parar todos los servicios
npm run all:down
```

### Comandos específicos para Kafka

```bash
# Solo levantar Kafka, Zookeeper y Kafdrop
npm run kafka:up

# Ver logs de Kafka
npm run kafka:logs

# Parar Kafka
npm run kafka:down

# Limpiar volúmenes de Kafka
npm run kafka:clean
```

### Comandos específicos para los servicios

```bash
# Solo levantar los servicios de aplicación
npm run services:up

# Ver logs de los servicios
npm run services:logs

# Parar los servicios
npm run services:down
```

### Comandos de construcción

```bash
# Construir imágenes
npm run build

# Reconstruir imágenes sin cache
npm run rebuild
```

### Verificar el estado de los servicios

```bash
docker-compose ps
```

### Acceder a las aplicaciones

Una vez que los servicios estén corriendo, puedes acceder a:

- **Kafdrop (Monitoreo de Kafka)**: http://localhost:9000
- **Users Service**: http://localhost:3000
- **Notifications Service**: http://localhost:3001

## API Endpoints

### Users Service

#### Crear un usuario
```bash
curl -X POST http://localhost:3000/users/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

#### Obtener un usuario
```bash
curl http://localhost:3000/users/v1/users/1
```

### Notifications Service

#### Health Check
```bash
curl http://localhost:3001/notifications/v1/
```

## Flujo de Eventos

1. **Crear Usuario**: Se envía una petición POST al Users Service
2. **Guardar en BD**: El usuario se guarda en SQLite
3. **Emitir Evento**: Se emite un evento `user.created` a Kafka
4. **Procesar Evento**: El Notifications Service consume el evento
5. **Enviar Notificación**: Se simula el envío de una notificación de bienvenida

## Monitoreo

### Kafdrop
Accede a http://localhost:9000 para:
- Ver tópicos de Kafka
- Monitorear mensajes
- Ver estadísticas de productores y consumidores

### Logs
```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f users-service
docker-compose logs -f notifications-service
docker-compose logs -f kafka
```

## Estructura del Proyecto

```
kafka_nestjs_example/
├── docker-compose.yml
├── .env
├── package.json
├── data/                    # Datos persistentes
│   └── users.db            # Base de datos SQLite
└── services/
    ├── users/              # Servicio de usuarios
    │   ├── src/
    │   │   ├── kafka/      # Kafka producer
    │   │   ├── users/      # Lógica de usuarios
    │   │   └── entities/   # Entidades TypeORM
    │   └── Dockerfile
    └── notifications/      # Servicio de notificaciones
        ├── src/
        │   └── kafka/      # Kafka consumer
        └── Dockerfile
```

## Desarrollo Local

Si quieres desarrollar localmente sin Docker:

1. Levantar solo Kafka:
```bash
npm run kafka:up
```

2. Instalar dependencias en cada servicio:
```bash
cd services/users && npm install
cd services/notifications && npm install
```

3. Ejecutar servicios en modo desarrollo:
```bash
# Terminal 1 - Users Service
cd services/users && npm run start:dev

# Terminal 2 - Notifications Service
cd services/notifications && npm run start:dev
```

## Troubleshooting

### Problemas comunes

1. **Puerto ocupado**: Verificar que los puertos 3000, 3001, 9000, 9092 y 2181 estén disponibles
2. **Kafka no conecta**: Esperar a que Kafka esté completamente inicializado (puede tomar 30-60 segundos)
3. **Servicios no se construyen**: Ejecutar `npm run rebuild` para reconstruir sin cache

### Verificar que Kafka esté funcionando

```bash
# Listar tópicos
docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092

# Ver mensajes en el tópico user.created
docker exec -it kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic user.created --from-beginning
```

### Limpiar y reiniciar

```bash
# Parar todos los servicios
npm run all:down

# Limpiar volúmenes
docker-compose down -v

# Reconstruir y levantar
npm run rebuild && npm run all:up
```
