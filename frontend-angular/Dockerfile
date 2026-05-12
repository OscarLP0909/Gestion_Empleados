# Stage de desarrollo
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200
CMD ["node_modules/.bin/ng", "serve", "--host", "0.0.0.0"]

# Stage de build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN node_modules/.bin/ng build

# Stage de producción
FROM nginx:alpine AS prod
COPY --from=build /app/dist/frontend-angular/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80