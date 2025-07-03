# Users Service

Microservicio para la gestión de usuarios del sistema.

## 🚀 Características

- CRUD completo de usuarios
- Validaciones de entrada
- Manejo de errores HTTP
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
- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `POST /users` - Crear nuevo usuario
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

## 📝 Ejemplo de usuario

```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "createdAt": "2025-07-01T00:00:00.000Z"
}
```

## 🐳 Docker

```bash
# Construir imagen
docker build -t users-service .

# Ejecutar contenedor
docker run -p 3001:3001 users-service
```
