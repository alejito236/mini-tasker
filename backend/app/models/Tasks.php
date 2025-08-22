<?php

use Phalcon\Mvc\Model;

class Tasks extends Model
{
    public ?int $id = null;
    public int $user_id;
    public string $title = '';
    public ?string $description = null;
    public string $status = 'pending';

    public function initialize(): void
    {
        $this->setSource('tasks');
    }
}
