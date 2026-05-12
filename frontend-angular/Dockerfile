# Stage de desarrollo
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200
CMD ["node_modules/.bin/ng", "serve", "--host", "0.0.0.0"]

# Stage de producción
FROM node:20-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN node_modules/.bin/ng build
FROM nginx:alpine
COPY --from=prod /app/dist/*/browser /usr/share/nginx/html
EXPOSE 80