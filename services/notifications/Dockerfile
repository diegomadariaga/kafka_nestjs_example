# Dockerfile para el servicio notifications
FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias de desarrollo y producción para el build
RUN npm install && npm cache clean --force

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]
