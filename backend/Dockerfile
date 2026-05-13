# Stage de desarrollo
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node_modules/.bin/tsx", "watch", "src/server.ts"]

# Stage de compilación (tiene devDependencies: TypeScript, tipos, etc.)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN node node_modules/typescript/bin/tsc

# Stage de producción (solo el JS compilado + deps de runtime)
FROM node:20-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]