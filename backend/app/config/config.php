<?php

use Phalcon\Config\Config; 

return new Config([
    'db' => [
        'host'     => 'db',
        'username' => 'user',
        'password' => 'password',
        'dbname'   => 'tasks_db',
        'charset'  => 'utf8mb4',
    ],
    'security' => [
        'jwt_secret' => 'super_secret_change_me',
        'jwt_ttl'    => 3600,
    ],
    'application' => [
        'controllersDir' => __DIR__ . '/../controllers/',
        'modelsDir'      => __DIR__ . '/../models/',
        'baseUri'        => '/',
    ],
]);
