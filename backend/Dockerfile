# Stage de desarrollo
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node_modules/.bin/tsx", "watch", "src/server.ts"]

# Stage de producción
FROM node:20-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN node node_modules/typescript/bin/tsc
EXPOSE 3000
CMD ["node", "dist/server.js"]