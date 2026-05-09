FROM node:22-alpine

WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer puerto
EXPOSE 3003

# Ejecutar la app compilada
CMD ["node", "dist/main.js"]