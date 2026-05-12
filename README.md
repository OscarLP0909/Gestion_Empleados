# 👥 Employee Management App

Aplicación fullstack para la **gestión integral de empleados y contratos** dentro de una organización. Incluye autenticación con JWT, sistema de roles y permisos, CRUD completo de empleados y contratos, auditoría de acciones y una interfaz Angular moderna.

---

## 🚀 Stack tecnológico

### Backend
- **Node.js** + **Express.js**
- **TypeScript**
- **MongoDB** + **Mongoose** (ODM)
- **Passport.js** (autenticación local + JWT)
- **bcrypt** (hash de contraseñas)
- **node-cron** (tareas programadas)

### Frontend
- **Angular**
- **TypeScript**

### Infraestructura
- **Docker** + **Docker Compose**
- **Nginx** (servidor de producción para el frontend)

---

## ✨ Funcionalidades

- 🔐 **Autenticación** — Login seguro con JWT (httpOnly cookies)
- 👤 **Gestión de empleados** — Crear, editar, consultar y eliminar empleados
- 📄 **Gestión de contratos** — CRUD completo, cambio de estado y filtrado por empleado
- 🛡️ **Sistema de roles** — `ADMIN`, `HR_MANAGER`, `MANAGER`, `EMPLOYEE`
- 📋 **Auditoría** — Log de todas las acciones del sistema
- ⏰ **Tareas programadas** — Actualización automática de estados de contratos con node-cron
- 🔒 **Rutas protegidas** — Middleware de autorización por rol

---

## 🐳 Docker

El proyecto está completamente dockerizado con soporte para dos entornos.

### Producción

```bash
docker-compose up --build
```

Levanta tres contenedores:
- **backend** — Node.js compilado con TypeScript, puerto 3000
- **frontend** — Angular compilado, servido con Nginx, puerto 80
- **mongodb** — MongoDB 7, con volumen persistente

### Desarrollo (hot-reload)

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Levanta los mismos servicios pero con:
- **backend** — `tsx watch` para recargar automáticamente al guardar
- **frontend** — `ng serve` con hot-reload, puerto 4200
- Volúmenes montados desde tu máquina local

---

## 🔌 API Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth/login` | Iniciar sesión |
| `POST` | `/auth/register` | Registrar usuario |
| `GET` | `/auth/profile` | Obtener perfil |
| `PUT` | `/auth/profile` | Actualizar perfil |
| `PUT` | `/auth/password` | Cambiar contraseña |

### Empleados
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/employees` | Listar todos los empleados |
| `POST` | `/employees` | Crear empleado |
| `GET` | `/employees/id/:id` | Obtener empleado por ID |
| `GET` | `/employees/nif/:nif` | Obtener empleado por NIF |
| `PUT` | `/employees/:id` | Actualizar empleado |
| `DELETE` | `/employees/:id` | Eliminar empleado |

### Contratos
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/contracts` | Listar todos los contratos |
| `POST` | `/contracts` | Crear contrato |
| `GET` | `/contracts/:id` | Obtener contrato por ID |
| `PUT` | `/contracts/:id` | Actualizar contrato |
| `DELETE` | `/contracts/:id` | Eliminar contrato |
| `PATCH` | `/contracts/status/:id` | Cambiar estado |
| `GET` | `/contracts/employee/:employeeId` | Contratos de un empleado |
| `GET` | `/contracts/employee/active/:employeeId` | Contrato activo de un empleado |
| `GET` | `/contracts/pending` | Contratos pendientes |

### Usuarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/users` | Listar usuarios |
| `POST` | `/users` | Crear usuario |
| `PUT` | `/users/:id/role` | Cambiar rol |
| `PUT` | `/users/:id/deactivate` | Desactivar usuario |
| `PUT` | `/users/:id/activate` | Activar usuario |

### Auditoría
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/audit` | Obtener logs de auditoría |

---

## 🛡️ Sistema de roles

| Rol | Descripción |
|-----|-------------|
| `ADMIN` | Acceso total a todas las funcionalidades |
| `HR_MANAGER` | Gestión de empleados y contratos |
| `MANAGER` | Consulta de empleados de su departamento |
| `EMPLOYEE` | Acceso limitado a su propia información |

---

## ⚙️ Instalación y uso

### Requisitos previos
- Docker + Docker Compose

### Variables de entorno

Crea un archivo `.env` en la carpeta `backend/` basándote en el `.env.example`:

```env
PORT=3000
MONGO_URI=mongodb://mongodb:27017/gestion_empleados
JWT_SECRET=tu_jwt_secret
```

> ⚠️ La variable `MONGO_URI` usa `mongodb` como host (nombre del servicio en Docker Compose), no `localhost`.

### Arrancar en producción

```bash
docker-compose up --build
```

- Frontend disponible en: `http://localhost`
- API disponible en: `http://localhost:3000`

### Arrancar en desarrollo

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

- Frontend disponible en: `http://localhost:4200`
- API disponible en: `http://localhost:3000`

---

## 👤 Autor

**Óscar Luque** — Desarrollador Full Stack  
[GitHub](https://github.com/OscarLP0909) · [Portfolio](https://oscarlp0909.github.io/portfolio_personal/)
