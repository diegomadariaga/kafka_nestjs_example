# Dockerfile para el servicio users
FROM node:20-alpine

WORKDIR /app

# Instalar Python y build tools necesarios para algunas dependencias nativas
RUN apk add --no-cache python3 make g++

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias de desarrollo y producción para el build
RUN npm install && npm cache clean --force

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Crear directorio para datos
RUN mkdir -p /app/data

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]
