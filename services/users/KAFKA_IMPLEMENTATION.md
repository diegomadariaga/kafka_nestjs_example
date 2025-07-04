# Implementación de Kafka en el Servicio de Usuarios

## Descripción
Este servicio implementa Kafka para emitir eventos cuando se crea un nuevo usuario. Después de que un usuario se guarda exitosamente en la base de datos, se emite un evento al tópico `user.created`.

## Configuración

### Variables de Entorno
Las siguientes variables están configuradas en `.env`:

```env
# Kafka Configuration
KAFKA_BROKER=kafka:9092
KAFKA_CLIENT_ID=users-service
KAFKA_GROUP_ID=users-group
KAFKA_USER_CREATED_TOPIC=user.created
```

### Dependencias
- `@nestjs/microservices`: Para la integración de microservicios con NestJS
- `kafkajs`: Cliente de Kafka para Node.js

## Arquitectura

### KafkaService
- **Ubicación**: `src/kafka/kafka.service.ts`
- **Propósito**: Maneja la conexión con Kafka y el envío de mensajes
- **Métodos principales**:
  - `sendUserCreatedEvent()`: Envía evento específico de usuario creado
  - `sendMessage()`: Método genérico para enviar mensajes a cualquier tópico

### KafkaModule
- **Ubicación**: `src/kafka/kafka.module.ts`
- **Propósito**: Módulo que exporta el KafkaService para ser usado en otros módulos

### Integración con UsersService
El `UsersService` ha sido modificado para:
1. Inyectar el `KafkaService`
2. Emitir un evento después de crear un usuario exitosamente
3. Manejar errores de Kafka sin afectar la creación del usuario

## Estructura del Evento

```typescript
{
  eventType: 'USER_CREATED',
  timestamp: '2025-07-04T10:30:00.000Z',
  data: {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    createdAt: '2025-07-04T10:30:00.000Z'
  }
}
```

## Manejo de Errores
- Si Kafka no está disponible, la creación del usuario no falla
- Los errores de Kafka se logean pero no interrumpen el flujo principal
- El productor se conecta automáticamente al iniciar el módulo

## Uso
Cuando se crea un usuario a través del endpoint `POST /users/v1/users`, automáticamente se enviará un evento al tópico `user.created` en Kafka con la información del usuario creado (sin incluir la contraseña).

## Tópicos de Kafka
- **user.created**: Eventos de usuarios creados
