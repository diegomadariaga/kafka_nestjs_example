# Ejemplo de prueba de Kafka en el servicio de usuarios

## Requisitos previos
1. Docker y Docker Compose instalados
2. Kafka corriendo (usando docker-compose.yml del proyecto principal)

## Pasos para probar

### 1. Levantar Kafka
Desde la raíz del proyecto:
```bash
docker-compose up -d kafka zookeeper kafdrop
```

### 2. Instalar dependencias del servicio de usuarios
```bash
cd services/users
npm install
```

### 3. Ejecutar el servicio de usuarios
```bash
npm run start:dev
```

### 4. Crear un usuario
```bash
curl -X POST http://localhost:3001/users/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### 5. Verificar el evento en Kafka
Acceder a Kafdrop en: http://localhost:9000

1. Buscar el tópico `user.created`
2. Ver los mensajes enviados
3. Verificar que el contenido del mensaje coincida con el usuario creado

### Estructura esperada del mensaje en Kafka:
```json
{
  "eventType": "USER_CREATED",
  "timestamp": "2025-07-04T10:30:00.000Z",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "createdAt": "2025-07-04T10:30:00.000Z"
  }
}
```

## Verificación de logs
El servicio de usuarios mostrará logs como:
```
Kafka producer connected
Message sent to topic user.created: { eventType: 'USER_CREATED', ... }
```

## Troubleshooting
- Si Kafka no está disponible, el usuario se creará igualmente pero no se enviará el evento
- Verificar que las variables de entorno estén configuradas correctamente
- Asegurarse de que Kafka esté corriendo en el puerto especificado
