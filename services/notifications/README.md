# Notifications Service

Microservicio para la gestión de notificaciones del sistema.

## 🚀 Características

- CRUD completo de notificaciones
- Soporte para múltiples tipos: email, SMS, push
- Estados de notificación: pending, sent, failed
- Filtrado por usuario
- Arquitectura modular con NestJS

## 📦 Instalación local

```bash
npm install
```

## 🛠️ Desarrollo

```bash
# Ejecutar en modo desarrollo
npm run start:dev

# Construir
npm run build

# Ejecutar en producción
npm start
```

## 🔗 Endpoints

- `GET /` - Mensaje de bienvenida
- `GET /health` - Estado del servicio
- `GET /notifications` - Obtener todas las notificaciones
- `GET /notifications?userId=:id` - Obtener notificaciones por usuario
- `GET /notifications/:id` - Obtener notificación por ID
- `POST /notifications` - Crear nueva notificación
- `PUT /notifications/:id` - Actualizar notificación
- `POST /notifications/:id/send` - Marcar como enviada
- `DELETE /notifications/:id` - Eliminar notificación

## 📝 Ejemplo de notificación

```json
{
  "id": "1",
  "userId": 1,
  "title": "Bienvenido",
  "message": "Bienvenido a nuestro sistema",
  "type": "email",
  "status": "sent",
  "createdAt": "2025-07-01T00:00:00.000Z",
  "sentAt": "2025-07-01T00:00:00.000Z"
}
```

## 🔔 Tipos de notificación

- `email` - Notificación por correo electrónico
- `sms` - Notificación por SMS
- `push` - Notificación push

## 📊 Estados

- `pending` - Pendiente de envío
- `sent` - Enviada exitosamente
- `failed` - Falló el envío

## 🐳 Docker

```bash
# Construir imagen
docker build -t notifications-service .

# Ejecutar contenedor
docker run -p 3002:3002 notifications-service
```
