# 📘 Mini Tasker — README

Aplicación full-stack (Phalcon PHP + MySQL + React/Redux) para gestionar tareas:

- Registro / Login (JWT)
- Listar / filtrar tareas
- Crear / editar tareas
- Frontend con Vite + Tailwind

---

## 🚀 Stack

- **Backend**: Phalcon PHP (Micro), Nginx, PHP-FPM, MySQL 8
- **Frontend**: React + Redux Toolkit + Vite + TailwindCSS
- **Infra**: Docker Compose

---

## 📂 Estructura del proyecto

mini-tasker/
├─ backend/
│ ├─ app/
│ │ ├─ config/ # config.php (DB, rutas locales)
│ │ ├─ models/ # Users.php, Tasks.php
│ │ └─ services/ # JwtService.php
│ ├─ db/
│ │ ├─ 001_users.sql
│ │ └─ 002_tasks.sql
│ ├─ nginx/
│ │ └─ default.conf # vhost nginx → /backend/public/index.php
│ ├─ composer.json
│ └─ public/
│ └─ index.php # Bootstrap Micro + endpoints
├─ frontend/
│ ├─ src/
│ │ ├─ api/client.js
│ │ ├─ pages/ # Login.jsx, Register.jsx, Tasks.jsx
│ │ ├─ components/ # Navbar.jsx, TaskForm.jsx, TaskList.jsx
│ │ └─ store/ # authSlice.js, tasksSlice.js, index.js
│ ├─ index.html
│ ├─ vite.config.js
│ ├─ tailwind.config.js
│ ├─ postcss.config.js
│ └─ .env # VITE_API_URL=http://localhost:8080


├─ docker-compose.yml
└─ README.md


---

## 🐳 Levantar el proyecto

1. **Variables frontend**  
   Crear `frontend/.env`:

VITE_API_URL=http://localhost:8080


2. **Docker up**
```bash
docker compose up -d --build

    Backend (API) → http://localhost:8080

    Frontend (Vite) → http://localhost:5174

    MySQL → expuesto en localhost:3307

🗄️ Base de datos
A) Cargar SQL manualmente
Linux / Git Bash

docker exec -i mysql_db mysql -u root -proot tasks_db < backend/db/001_users.sql
docker exec -i mysql_db mysql -u root -proot tasks_db < backend/db/002_tasks.sql

PowerShell (usar type en lugar de <)

type .\backend\db\001_users.sql | docker exec -i mysql_db mysql -u root -proot tasks_db
type .\backend\db\002_tasks.sql | docker exec -i mysql_db mysql -u root -proot tasks_db

Verificar tablas

docker exec -it mysql_db mysql -u root -proot -e "USE tasks_db; SHOW TABLES;"

B) Inicialización automática

En docker-compose.yml, mapear SQL:

volumes:
  - db_data:/var/lib/mysql
  - ./backend/db:/docker-entrypoint-initdb.d

Luego:

docker compose down -v
docker compose up -d --build

🔐 Endpoints principales

    POST /api/register → registrar usuario

    POST /api/login → retorna { token }

    GET /api/tasks → listar tareas (requiere Authorization: Bearer <token>)

    POST /api/tasks → crear tarea

    PUT /api/tasks/{id} → actualizar tarea

Ejemplos (curl)

# Registro
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"secret123"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"secret123"}' | jq -r .token)

# Crear tarea
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"Primera tarea","description":"prueba","status":"pending"}'

🖥️ Frontend
Desarrollo

cd frontend
npm install
npm run dev
# abre http://localhost:5174

Configura .env con:

VITE_API_URL=http://localhost:8080

Proxy opcional en vite.config.js

server: {
  port: 5174,
  proxy: {
    "/api": { target: "http://localhost:8080", changeOrigin: true },
  },
}

✅ Criterios de evaluación (checklist)

Autenticación JWT

API REST de usuarios y tareas

Validaciones (email, password, status)

Seguridad básica

Frontend React con Redux

UI con Tailwind

    Docker stack completo

🧰 Comandos útiles

Logs:

docker logs -f nginx_server
docker logs -f phalcon_app
docker logs -f mysql_db

Entrar a contenedor:

docker exec -it phalcon_app sh
docker exec -it mysql_db bash

Resetear:

docker compose down -v
docker compose up -d --build
