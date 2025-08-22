<?php

use Phalcon\Mvc\Model;

class Users extends Model
{
    public ?int $id = null;
    public string $email = '';
    public string $password = '';

    public function initialize(): void
    {
        $this->setSource('users');
    }

    public function beforeSave(): void
    {
        // Hashear si aún no está hasheado
        if (!preg_match('/^\$2y\$/', (string) $this->password)) {
            $this->password = password_hash($this->password, PASSWORD_BCRYPT);
        }
    }
}
