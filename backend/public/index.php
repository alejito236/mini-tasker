<?php

use Phalcon\Di\FactoryDefault;
use Phalcon\Mvc\Micro;
use Phalcon\Db\Adapter\Pdo\Mysql;
use Phalcon\Http\Response;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../app/models/Users.php';
require_once __DIR__ . '/../app/models/Tasks.php';
require_once __DIR__ . '/../app/services/JwtService.php';

$di = new FactoryDefault();

$di->setShared('config', function () {
    return require __DIR__ . '/../app/config/config.php';
});

$di->setShared('db', function () {
    $c = $this->get('config')->db; // usa la clave 'db' del config
    return new Mysql([
        'host'     => $c->host,
        'username' => $c->username,
        'password' => $c->password,
        'dbname'   => $c->dbname,
        'charset'  => $c->charset,
    ]);
});

$di->setShared('response', function () {
    $r = new Response();
    $r->setContentType('application/json', 'UTF-8');
    return $r;
});

// JWT
$di->setShared('jwt', function () use ($di) {
    return new JwtService($di);
});

$app = new Micro($di);

// --- Salud
$app->get('/', function () use ($app) {
    return json_encode([
        'status'  => 'ok',
        'message' => 'Mini Tasker API funcionando'
    ]);
});

// --- Helpers
$body = function () use ($app) {
    return $app->request->getJsonRawBody(true) ?? [];
};
$json = function ($data, int $code = 200) use ($app) {
    $app->response->setStatusCode($code);
    $app->response->setJsonContent($data);
    return $app->response;
};

// --- Auth helper: lee Authorization: Bearer <token>
$authUser = function () use ($app) {
    $h = $app->request->getHeader('Authorization');
    if (!$h || stripos($h, 'Bearer ') !== 0) {
        return [null, 'Falta Authorization: Bearer <token>'];
    }
    $jwt = trim(substr($h, 7));
    try {
        /** @var JwtService $svc */
        $svc = $app->di->get('jwt');
        $payload = (array) $svc->decode($jwt);
        return [$payload, null];
    } catch (\Throwable $e) {
        return [null, 'Token inválido o expirado'];
    }
};

// --- Auth: Register
$app->post('/api/register', function () use ($app, $body, $json) {
    $data = $body();
    $email = trim($data['email'] ?? '');
    $password = (string)($data['password'] ?? '');

    if ($email === '' || $password === '') {
        return $json(['message' => 'email y password son obligatorios'], 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return $json(['message' => 'Email inválido'], 400);
    }
    if (strlen($password) < 6) {
        return $json(['message' => 'password mínimo 6 caracteres'], 400);
    }

    if (Users::findFirstByEmail($email)) {
        return $json(['message' => 'El email ya está registrado'], 409);
    }

    $user = new Users();
    $user->email = $email;
    $user->password = $password;

    try {
        if (!$user->save()) {
            $errors = array_map(fn($m) => $m->getMessage(), $user->getMessages());
            return $json(['message' => 'No se pudo registrar', 'errors' => $errors], 400);
        }
    } catch (\Throwable $e) {
        if (strpos($e->getMessage(), '1062') !== false) {
            return $json(['message' => 'El email ya está registrado'], 409);
        }
        return $json(['message' => 'Error interno', 'error' => $e->getMessage()], 500);
    }

    return $json(['message' => 'Usuario registrado']);
});

// --- Auth: Login
$app->post('/api/login', function () use ($app, $body, $json) {
    $data = $body();
    $email = trim($data['email'] ?? '');
    $password = (string)($data['password'] ?? '');

    if ($email === '' || $password === '') {
        return $json(['message' => 'email y password son obligatorios'], 400);
    }

    $user = Users::findFirstByEmail($email);
    if (!$user || !password_verify($password, $user->password)) {
        return $json(['message' => 'Credenciales inválidas'], 401);
    }

    /** @var JwtService $jwt */
    $jwt = $app->di->get('jwt');
    $token = $jwt->makeToken(['id' => $user->id, 'email' => $user->email]);

    return $json(['token' => $token]);
});


// ======================================================================
// 5) Endpoints de TAREAS (protegidos con JWT)
// ======================================================================

// GET /api/tasks?status=pending|in_progress|done
$app->get('/api/tasks', function () use ($app, $json, $authUser) {
    [$u, $err] = $authUser();
    if ($err) return $json(['message' => $err], 401);

    $status = $app->request->getQuery('status');
    $conditions = 'user_id = :uid:';
    $params = ['uid' => (int)$u['id']];

    if ($status) {
        $allowed = ['pending','in_progress','done'];
        if (!in_array($status, $allowed, true)) {
            return $json(['message' => 'status inválido'], 400);
        }
        $conditions .= ' AND status = :status:';
        $params['status'] = $status;
    }

    $rows = Tasks::find([
        'conditions' => $conditions,
        'bind'       => $params,
        'order'      => 'id DESC'
    ]);

    $out = [];
    foreach ($rows as $t) {
        $out[] = [
            'id'          => $t->id,
            'title'       => $t->title,
            'description' => $t->description,
            'status'      => $t->status,
            'created_at'  => $t->created_at ?? null,
            'updated_at'  => $t->updated_at ?? null,
        ];
    }
    return $json($out);
});

// POST /api/tasks  {title, description?, status?}
$app->post('/api/tasks', function () use ($app, $json, $body, $authUser) {
    [$u, $err] = $authUser();
    if ($err) return $json(['message' => $err], 401);

    $data = $body();
    $title = trim((string)($data['title'] ?? ''));
    $description = isset($data['description']) ? (string)$data['description'] : null;
    $status = $data['status'] ?? 'pending';

    $allowed = ['pending','in_progress','done'];
    if ($title === '') return $json(['message' => 'title es obligatorio'], 400);
    if (!in_array($status, $allowed, true)) return $json(['message' => 'status inválido'], 400);

    $t = new Tasks();
    $t->user_id     = (int)$u['id'];
    $t->title       = $title;
    $t->description = $description;
    $t->status      = $status;

    if (!$t->save()) {
        $errors = array_map(fn($m) => $m->getMessage(), $t->getMessages());
        return $json(['message' => 'No se pudo crear', 'errors' => $errors], 400);
    }
    return $json(['message' => 'Tarea creada', 'id' => $t->id], 201);
});

// PUT /api/tasks/{id}  {title?, description?, status?}
$app->put('/api/tasks/{id:[0-9]+}', function ($id) use ($app, $json, $body, $authUser) {
    [$u, $err] = $authUser();
    if ($err) return $json(['message' => $err], 401);

    $task = Tasks::findFirst([
        'conditions' => 'id = :id: AND user_id = :uid:',
        'bind'       => ['id' => (int)$id, 'uid' => (int)$u['id']]
    ]);
    if (!$task) return $json(['message' => 'Tarea no encontrada'], 404);

    $data = $body();
    if (isset($data['title'])) {
        $task->title = trim((string)$data['title']);
        if ($task->title === '') return $json(['message' => 'title no puede ser vacío'], 400);
    }
    if (array_key_exists('description', $data)) {
        $task->description = $data['description'] !== null ? (string)$data['description'] : null;
    }
    if (isset($data['status'])) {
        $allowed = ['pending','in_progress','done'];
        if (!in_array($data['status'], $allowed, true)) {
            return $json(['message' => 'status inválido'], 400);
        }
        $task->status = $data['status'];
    }

    if (!$task->save()) {
        $errors = array_map(fn($m) => $m->getMessage(), $task->getMessages());
        return $json(['message' => 'No se pudo actualizar', 'errors' => $errors], 400);
    }
    return $json(['message' => 'Tarea actualizada']);
});

// --- 404 JSON
$app->notFound(function () use ($json) {
    return $json(['message' => 'Ruta no encontrada'], 404);
});

// --- Run
$app->handle($_SERVER['REQUEST_URI']);
