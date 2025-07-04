# Kafka NestJS Example

Este proyecto incluye un setup completo de Kafka con Kafdrop para monitoreo usando Docker Compose.

## Componentes

- **Zookeeper**: Coordinador de Kafka
- **Kafka**: Message broker
- **Kafdrop**: Interface web para monitorear Kafka

## Configuración

Las variables de entorno están configuradas en el archivo `.env` en la raíz del proyecto.

### Variables de entorno principales:

- `KAFKA_PORT`: Puerto para Kafka (default: 9092)
- `ZOOKEEPER_PORT`: Puerto para Zookeeper (default: 2181)
- `KAFDROP_PORT`: Puerto para Kafdrop UI (default: 9000)

## Uso

### Levantar los servicios

```bash
docker-compose up -d
```

### Ver logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f kafka
docker-compose logs -f kafdrop
```

### Verificar el estado de los servicios

```bash
docker-compose ps
```

### Acceder a Kafdrop

Una vez que los servicios estén corriendo, puedes acceder a Kafdrop en:
- http://localhost:9000

### Parar los servicios

```bash
docker-compose down
```

### Eliminar volúmenes (datos persistentes)

```bash
docker-compose down -v
```

## Conexión desde aplicaciones NestJS

Para conectar tus servicios NestJS a Kafka, usa la siguiente configuración:

```typescript
{
  brokers: ['localhost:9092']
}
```

## Verificar que Kafka esté funcionando

Puedes verificar que Kafka esté funcionando correctamente ejecutando:

```bash
# Crear un topic de prueba
docker exec -it kafka kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic test-topic

# Listar topics
docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092

# Eliminar el topic de prueba
docker exec -it kafka kafka-topics --delete --bootstrap-server localhost:9092 --topic test-topic
```
