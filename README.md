# 📘 Mini Tasker

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

## 🐳 Levantar el proyecto

### 1. Variables frontend
Crear `frontend/.env`:


VITE_API_URL=http://localhost:8080

2. Docker up

docker compose up -d --build

    Backend (API) → http://localhost:8080

Frontend (Vite) → http://localhost:5174

    MySQL → expuesto en localhost:3307

🗄️ Base de datos
A) Cargar SQL manualmente

Linux / Git Bash

docker exec -i mysql_db mysql -u root -proot tasks_db < backend/db/001_users.sql
docker exec -i mysql_db mysql -u root -proot tasks_db < backend/db/002_tasks.sql

# O ejecutar todos en orden:
for f in backend/db/*.sql; do
  echo "Aplicando $f"
  docker exec -i mysql_db mysql -u root -proot tasks_db < "$f"
done

Windows PowerShell

# Ejecutar uno por uno
type .\backend\db\001_users.sql | docker exec -i mysql_db mysql -u root -proot tasks_db
type .\backend\db\002_tasks.sql | docker exec -i mysql_db mysql -u root -proot tasks_db

# Ejecutar todos en orden
Get-ChildItem .\backend\db\*.sql | Sort-Object Name | ForEach-Object {
  Write-Host "Aplicando $($_.Name)"
  Get-Content $_.FullName | docker exec -i mysql_db mysql -u root -proot tasks_db
}

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

Ejemplos con curl

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

Abrir: http://localhost:5174

Configura .env con:

VITE_API_URL=http://localhost:8080

Proxy opcional en vite.config.js:

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

Logs

docker logs -f nginx_server
docker logs -f phalcon_app
docker logs -f mysql_db

Entrar a contenedor

docker exec -it phalcon_app sh
docker exec -it mysql_db bash

Resetear

docker compose down -v
docker compose up -d --build

🧱 Migraciones (SQL)

Los scripts SQL están en backend/db/ y se ejecutan en orden alfabético:

backend/db/
├─ 001_users.sql
└─ 002_tasks.sql

    Importante: Mantén la numeración (003_, 004_, …) para nuevas migraciones.
    La base tasks_db la crea MySQL automáticamente con las variables del docker-compose.yml.
