# API Básica con NestJS

Una API REST básica construida con NestJS que incluye operaciones CRUD para gestión de usuarios.

## 🚀 Características

- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Arquitectura**: Modular
- **Endpoints**: CRUD completo para usuarios
- **Validaciones**: Manejo de errores HTTP

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev

# Construir el proyecto
npm run build

# Ejecutar en producción
npm start
```

## 🛠️ Endpoints disponibles

### Generales
- `GET /` - Mensaje de bienvenida
- `GET /health` - Estado de la API

### Usuarios
- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener un usuario por ID
- `POST /users` - Crear un nuevo usuario
- `PUT /users/:id` - Actualizar un usuario
- `DELETE /users/:id` - Eliminar un usuario

## 📝 Ejemplos de uso

### Crear un usuario
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana López",
    "email": "ana@example.com"
  }'
```

### Obtener todos los usuarios
```bash
curl http://localhost:3000/users
```

### Actualizar un usuario
```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Carlos Pérez",
    "email": "juancarlos@example.com"
  }'
```

## 🏗️ Estructura del proyecto

```
src/
├── main.ts              # Punto de entrada de la aplicación
├── app.module.ts        # Módulo principal
├── app.controller.ts    # Controlador principal
├── app.service.ts       # Servicio principal
└── users/               # Módulo de usuarios
    ├── users.module.ts
    ├── users.controller.ts
    ├── users.service.ts
    └── interfaces/
        └── user.interface.ts
```

## 🔧 Tecnologías utilizadas

- [NestJS](https://nestjs.com/) - Framework de Node.js
- [TypeScript](https://www.typescriptlang.org/) - Superset de JavaScript
- [Express](https://expressjs.com/) - Framework web para Node.js

## 📖 Próximos pasos

- [ ] Integración con base de datos
- [ ] Autenticación y autorización
- [ ] Validación de DTOs
- [ ] Documentación con Swagger
- [ ] Integración con Kafka