# Servicio de Usuarios

Este servicio proporciona un API REST para la gestión de usuarios con persistencia en SQLite.

## Características

- Creación de usuarios con validación
- Encriptación de contraseñas con bcrypt
- Base de datos SQLite ubicada en la raíz del monorepo
- Validación de entrada con class-validator
- Verificación de duplicados por email

## Endpoints

### POST /users/v1/users

Crea un nuevo usuario.

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "miPassword123"
}
```

**Response:**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "createdAt": "2025-07-03T10:30:00.000Z"
}
```

### GET /users/v1/users/:id

Obtiene un usuario por su ID.

**Response:**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "createdAt": "2025-07-03T10:30:00.000Z"
}
```

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## Base de Datos

La base de datos SQLite se crea automáticamente en `../../users.db` (raíz del monorepo) al iniciar el servicio por primera vez.

### Estructura de la tabla `users`:

- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `nombre`: TEXT NOT NULL
- `email`: TEXT UNIQUE NOT NULL
- `password`: TEXT NOT NULL (encriptada con bcrypt)
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP

## Validaciones

- **nombre**: Requerido, debe ser string no vacío
- **email**: Requerido, debe ser un email válido y único
- **password**: Requerido, mínimo 6 caracteres

## Errores Comunes

- **409 Conflict**: El email ya está registrado
- **400 Bad Request**: Datos de entrada inválidos
