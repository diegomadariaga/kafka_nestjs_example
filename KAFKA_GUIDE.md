# 📚 Guía Completa de Apache Kafka

## 🎯 Conceptos Básicos

### ¿Qué es Kafka?
Kafka es un **sistema de mensajería distribuido** que permite comunicación asíncrona entre servicios mediante eventos.

### Analogía Simple
Imagina Kafka como un **sistema de correo postal**:
- **Topic** = Buzón de correo con un nombre específico
- **Producer** = Persona que envía cartas al buzón
- **Consumer** = Persona que recoge cartas del buzón
- **Partition** = Compartimentos dentro del buzón para organizar las cartas

## 🏗️ Arquitectura de Kafka

```
┌─────────────────────────────────────────────────────────────┐
│                        KAFKA CLUSTER                        │
├─────────────────────────────────────────────────────────────┤
│  Topic: "user-events"                                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ Partition 0 │ │ Partition 1 │ │ Partition 2 │            │
│  │ [Msg A]     │ │ [Msg B]     │ │ [Msg C]     │            │
│  │ [Msg D]     │ │ [Msg E]     │ │ [Msg F]     │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
           ↑                               ↓
    ┌─────────────┐                 ┌─────────────┐
    │ PRODUCERS   │                 │ CONSUMERS   │
    │             │                 │             │
    │ Users       │                 │ Notifications│
    │ Service     │                 │ Service     │
    │             │                 │             │
    │ Orders      │                 │ Email       │
    │ Service     │                 │ Service     │
    └─────────────┘                 └─────────────┘
```

## 📝 Conceptos Detallados

### 1. **Topic (Tema)**
```bash
# Crear un topic
docker exec kafka kafka-topics --bootstrap-server localhost:9092 \
  --create --topic user-events --partitions 3 --replication-factor 1
```

**Características:**
- Nombre único (ej: "user-events", "order-events")
- Almacena mensajes por tiempo configurable
- Se puede dividir en múltiples particiones

### 2. **Partitions (Particiones)**
```
Topic "user-events" con 3 particiones:

Partition 0: [User A created] [User D updated] [User G deleted]
Partition 1: [User B created] [User E updated] [User H deleted]  
Partition 2: [User C created] [User F updated] [User I deleted]
```

**¿Por qué particiones?**
- **Paralelismo**: Múltiples consumidores pueden procesar simultáneamente
- **Escalabilidad**: Distribuir carga entre múltiples servidores
- **Orden**: Los mensajes dentro de una partición mantienen el orden

**¿Cómo se distribuyen los mensajes?**
```javascript
// Por clave (key) - mismo usuario siempre va a la misma partición
{
  key: "user-123",     // Garantiza orden para este usuario
  value: "user created"
}

// Round-robin si no hay clave
// Distribución aleatoria entre particiones
```

### 3. **Replication Factor (Factor de Replicación)**
```
Replication Factor = 3

Partition 0:
├── Leader (Broker 1)     ← Maneja lecturas/escrituras
├── Replica (Broker 2)    ← Copia de seguridad
└── Replica (Broker 3)    ← Copia de seguridad
```

**Para desarrollo**: `replication-factor = 1` (un solo broker)
**Para producción**: `replication-factor = 3` (alta disponibilidad)

### 4. **Consumer Groups (Grupos de Consumidores)**
```
Topic "user-events" (3 particiones)

Consumer Group "notifications-group":
├── Consumer 1 → lee Partition 0
├── Consumer 2 → lee Partition 1  
└── Consumer 3 → lee Partition 2

Resultado: Cada mensaje se procesa UNA sola vez por grupo
```

**Beneficios:**
- **Load balancing**: Trabajo distribuido entre consumidores
- **Fault tolerance**: Si un consumidor falla, otro toma su partición
- **Scaling**: Agregar más consumidores = más paralelismo

## 🚀 Casos de Uso en tu Proyecto

### 1. **Eventos de Usuario** (Ya implementado)
```
Users Service → "user-events" → Notifications Service

Eventos:
- USER_CREATED → Notificación de bienvenida
- USER_UPDATED → Notificación de cambio de perfil  
- USER_DELETED → Notificación de despedida
```

### 2. **Eventos de Pedidos** (Sugerido)
```
Orders Service → "order-events" → Multiple Services

Eventos:
- ORDER_CREATED → Inventory Service (reservar stock)
                → Payment Service (procesar pago)
                → Notifications Service (confirmar pedido)
                
- ORDER_PAID → Shipping Service (preparar envío)
             → Notifications Service (pago confirmado)
             
- ORDER_SHIPPED → Notifications Service (pedido enviado)
                → Analytics Service (métricas de envío)
```

### 3. **Eventos de Audit/Logging** (Sugerido)
```
All Services → "audit-events" → Audit Service

Eventos:
- USER_LOGIN
- PASSWORD_CHANGED  
- ADMIN_ACTION
- SECURITY_ALERT
```

### 4. **Eventos de Analytics** (Sugerido)
```
All Services → "analytics-events" → Analytics Service

Eventos:
- PAGE_VIEW
- BUTTON_CLICK
- USER_BEHAVIOR
- PERFORMANCE_METRIC
```

## ⚙️ Configuración de Topics

### **Configuración para Desarrollo**
```bash
# Topic básico para desarrollo
kafka-topics --create \
  --topic user-events \
  --partitions 1 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092
```

### **Configuración para Producción**
```bash
# Topic para alta disponibilidad
kafka-topics --create \
  --topic user-events \
  --partitions 6 \
  --replication-factor 3 \
  --config retention.ms=604800000 \  # 7 días
  --config segment.ms=86400000 \     # 1 día
  --bootstrap-server localhost:9092
```

### **Configuraciones Importantes**

| Parámetro | Desarrollo | Producción | Descripción |
|-----------|------------|------------|-------------|
| `partitions` | 1-3 | 6-12 | Número de particiones |
| `replication-factor` | 1 | 3 | Copias de seguridad |
| `retention.ms` | 86400000 (1 día) | 604800000 (7 días) | Tiempo de retención |
| `cleanup.policy` | delete | delete/compact | Política de limpieza |

## 🛠️ Comandos Útiles

### **Gestión de Topics**
```bash
# Listar topics
kafka-topics --list --bootstrap-server localhost:9092

# Describir un topic
kafka-topics --describe --topic user-events --bootstrap-server localhost:9092

# Eliminar un topic
kafka-topics --delete --topic user-events --bootstrap-server localhost:9092
```

### **Producir Mensajes (Testing)**
```bash
# Enviar mensaje manualmente
kafka-console-producer --topic user-events --bootstrap-server localhost:9092
> {"userId": 1, "eventType": "USER_CREATED", "name": "Test User"}
```

### **Consumir Mensajes (Testing)**
```bash
# Leer mensajes desde el inicio
kafka-console-consumer --topic user-events \
  --from-beginning --bootstrap-server localhost:9092

# Leer solo mensajes nuevos
kafka-console-consumer --topic user-events --bootstrap-server localhost:9092
```

### **Monitoreo**
```bash
# Ver consumer groups
kafka-consumer-groups --list --bootstrap-server localhost:9092

# Estado de un consumer group
kafka-consumer-groups --describe \
  --group notifications-group --bootstrap-server localhost:9092
```

## 🎯 Próximos Casos de Uso a Implementar

### 1. **Sistema de Pedidos Completo**
- Order Service → Inventory Service (verificar stock)
- Order Service → Payment Service (procesar pago)
- Order Service → Shipping Service (preparar envío)
- Cada paso envía eventos de progreso

### 2. **Sistema de Autenticación**
- Auth Service → Audit Service (login/logout)
- Auth Service → Security Service (intentos fallidos)
- Auth Service → Analytics Service (patrones de uso)

### 3. **Sistema de Notificaciones Avanzado**
- Email Service consume eventos específicos
- SMS Service para notificaciones urgentes
- Push Notification Service para móviles

### 4. **Sistema de Analytics**
- User Behavior Tracking
- Performance Monitoring  
- Business Metrics
- Real-time Dashboards

¿Te gustaría que implementemos alguno de estos casos de uso específicos?
