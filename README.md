# Mini Tasker – Fullstack (Phalcon + React)

Mini gestor de tareas con **backend en Phalcon (PHP)** y **frontend en React**.  
Permite: **registro / login**, **crear / listar / actualizar tareas** y verlas en un **frontend**.

## 📦 Stack

- **Backend:** Phalcon 5 (Micro), PHP-FPM, Nginx, MySQL 8, JWT
- **Infra:** Docker & Docker Compose



---

## 🚀 Levantar el backend con Docker

### 1) Pre-requisitos
- Docker Desktop y Docker Compose
- (Windows) Compartir el disco `C:` con Docker Desktop (Settings → Resources → File sharing)

### 2) Arranque
Desde la raíz del proyecto:
bash
docker compose up -d --build

Servicios esperados

    nginx_server → http://localhost:8080

    phalcon_app → PHP-FPM (puerto interno 9000)

    mysql_db → MySQL en localhost:3307 (desde host)

3) Instalar dependencias PHP dentro del contenedor

docker exec -it -u root phalcon_app bash
cd /var/www/html
composer install --no-interaction --prefer-dist
exit

4) Crear tablas (migraciones simples)

Git Bash / Linux / WSL

docker exec -i mysql_db mysql -u root -proot tasks_db < backend/db/001_users.sql
docker exec -i mysql_db mysql -u root -proot tasks_db < backend/db/002_tasks.sql

PowerShell (Windows)

Get-Content backend\db\001_users.sql | docker exec -i mysql_db mysql -u root -proot tasks_db
Get-Content backend\db\002_tasks.sql | docker exec -i mysql_db mysql -u root -proot tasks_db

📡 Endpoints de la API

Base URL: http://localhost:8080
Autenticación

    Registro → POST /api/register

    Login → POST /api/login

Tareas (JWT requerido en header Authorization: Bearer <TOKEN>)

    Listar → GET /api/tasks

    Crear → POST /api/tasks

    Actualizar → PUT /api/tasks/{id}

🧪 Pruebas rápidas (curl)

Registro

curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"secret123"}'

Login

curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"secret123"}'

Crear tarea

curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Mi primera tarea","description":"Probar API","status":"pending"}'

🧰 Comandos útiles

Logs:

docker logs -f phalcon_app
docker logs -f nginx_server
docker logs -f mysql_db

Shell en contenedor:

docker exec -it phalcon_app bash

Reiniciar stack:

docker compose down -v
docker compose up -d --build
