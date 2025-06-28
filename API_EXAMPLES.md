# Ejemplos de pruebas de API

## Endpoint principal
```bash
curl http://localhost:3000
```

## Health check
```bash
curl http://localhost:3000/health
```

## Obtener todos los usuarios
```bash
curl http://localhost:3000/users
```

## Obtener un usuario específico
```bash
curl http://localhost:3000/users/1
```

## Crear un nuevo usuario
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana López",
    "email": "ana@example.com"
  }'
```

## Actualizar un usuario
```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Carlos Pérez",
    "email": "juancarlos@example.com"
  }'
```

## Eliminar un usuario
```bash
curl -X DELETE http://localhost:3000/users/2
```

## Probar error 404 (usuario no encontrado)
```bash
curl http://localhost:3000/users/999
```

## Probar error 400 (datos inválidos)
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": ""
  }'
```
