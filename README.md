# 👥 Employee Management App

Aplicación fullstack para la **gestión integral de empleados y contratos** dentro de una organización. Incluye autenticación con JWT, sistema de roles y permisos, CRUD completo de empleados y contratos, y una interfaz React moderna.

---

## 🚀 Stack tecnológico

### Backend
- **Node.js** + **Express.js**
- **TypeScript**
- **MySQL** + **Sequelize** (ORM)
- **Passport.js** (autenticación local + JWT)
- **bcrypt** (hash de contraseñas)

### Frontend
- **React**
- **TypeScript**
- **Vite**

---

## ✨ Funcionalidades

- 🔐 **Autenticación** — Login seguro con JWT (sin sesiones)
- 👤 **Gestión de empleados** — Crear, editar, consultar y eliminar empleados
- 📄 **Gestión de contratos** — CRUD completo, cambio de estado y filtrado por empleado
- 🛡️ **Sistema de roles** — `ADMIN`, `HR_MANAGER`, `MANAGER`, `EMPLOYEE`
- 🏢 **Departamentos, categorías y puestos** — Relación jerárquica entre entidades
- 🔒 **Rutas protegidas** — Middleware de autorización por rol

---

## 📁 Estructura del proyecto

```
employee-management/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── employeeController.ts
│   │   │   └── contractController.ts
│   │   ├── middlewares/
│   │   │   ├── auth/
│   │   │   │   ├── local.ts
│   │   │   │   └── jwt.ts
│   │   │   ├── authorization.ts
│   │   │   └── employee.ts
│   │   ├── models/
│   │   │   ├── user.ts
│   │   │   ├── employee.ts
│   │   │   └── contract.ts
│   │   ├── routes/
│   │   │   ├── authRouter.ts
│   │   │   ├── employeeRouter.ts
│   │   │   └── contractRouter.ts
│   │   └── app.ts
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── main.tsx
    └── package.json
```

---

## 🔌 API Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth/login` | Iniciar sesión |
| `POST` | `/auth/register` | Registrar usuario |

### Empleados
| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| `GET` | `/employees` | Listar todos los empleados | Autenticado |
| `POST` | `/employees` | Crear empleado | Autenticado |
| `GET` | `/employees/id/:id` | Obtener empleado por ID | Autenticado |
| `GET` | `/employees/nif/:nif` | Obtener empleado por NIF | Autenticado |
| `PUT` | `/employees/:id` | Actualizar empleado | Autenticado |
| `DELETE` | `/employees/:id` | Eliminar empleado | Autenticado |

### Contratos
| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| `GET` | `/contracts` | Listar todos los contratos | Autenticado |
| `POST` | `/contracts` | Crear contrato | Autenticado |
| `GET` | `/contracts/:id` | Obtener contrato por ID | Autenticado |
| `PUT` | `/contracts/:id` | Actualizar contrato | Autenticado |
| `DELETE` | `/contracts/:id` | Eliminar contrato | Autenticado |
| `PATCH` | `/contracts/status/:id` | Cambiar estado del contrato | Autenticado |
| `GET` | `/contracts/employee/:employeeId` | Contratos de un empleado | Autenticado |
| `GET` | `/contracts/employee/active/:employeeId` | Contrato activo de un empleado | Autenticado |

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
- Node.js v18+
- MySQL

### Backend

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/employee-management.git
cd employee-management/backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MySQL y JWT_SECRET

# Ejecutar migraciones
npx sequelize-cli db:migrate

# Iniciar el servidor
npm run dev
```

### Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Iniciar la aplicación
npm run dev
```

La API estará disponible en `http://localhost:3000` y el frontend en `http://localhost:5173`.

---

## 🔑 Variables de entorno

Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=employee_management
DB_USER=root
DB_PASSWORD=tu_password
JWT_SECRET=tu_jwt_secret
```

---

## 👤 Autor

**Óscar Luque** — Desarrollador Full Stack  
[GitHub](https://github.com/OscarLP0909) · [Portfolio](https://oscarlp0909.github.io/portfolio_personal/)
