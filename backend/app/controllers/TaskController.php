<?php

use Phalcon\Mvc\Controller;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class TasksController extends Controller
{
    private function getUserId()
    {
        $authHeader = $this->request->getHeader('Authorization');
        if (!$authHeader) {
            return null;
        }

        list(, $jwt) = explode(" ", $authHeader);

        try {
            $decoded = JWT::decode($jwt, new Key('secret_key', 'HS256'));
            return $decoded->id;
        } catch (Exception $e) {
            return null;
        }
    }

    public function indexAction()
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return $this->response->setStatusCode(401, "Unauthorized");
        }

        $tasks = Tasks::find([
            'conditions' => 'user_id = :uid:',
            'bind' => ['uid' => $userId]
        ]);

        return $this->response->setJsonContent($tasks);
    }

    public function createAction()
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return $this->response->setStatusCode(401, "Unauthorized");
        }

        $data = $this->request->getJsonRawBody(true);

        if (!in_array($data['status'], ['pending', 'in_progress', 'done'])) {
            return $this->response->setStatusCode(400, "Bad Request")
                ->setJsonContent(['error' => 'Invalid status']);
        }

        $task = new Tasks();
        $task->user_id = $userId;
        $task->title = $data['title'];
        $task->description = $data['description'] ?? '';
        $task->status = $data['status'];

        if ($task->save()) {
            return $this->response->setJsonContent(['message' => 'Task created']);
        }

        return $this->response->setStatusCode(400, "Bad Request")
            ->setJsonContent(['errors' => $task->getMessages()]);
    }

    public function updateAction($id)
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return $this->response->setStatusCode(401, "Unauthorized");
        }

        $task = Tasks::findFirst([
            'conditions' => 'id = :id: AND user_id = :uid:',
            'bind' => ['id' => $id, 'uid' => $userId]
        ]);

        if (!$task) {
            return $this->response->setStatusCode(404, "Not Found");
        }

        $data = $this->request->getJsonRawBody(true);

        if (isset($data['status']) && !in_array($data['status'], ['pending', 'in_progress', 'done'])) {
            return $this->response->setStatusCode(400, "Bad Request")
                ->setJsonContent(['error' => 'Invalid status']);
        }

        $task->title = $data['title'] ?? $task->title;
        $task->description = $data['description'] ?? $task->description;
        $task->status = $data['status'] ?? $task->status;

        if ($task->save()) {
            return $this->response->setJsonContent(['message' => 'Task updated']);
        }

        return $this->response->setStatusCode(400, "Bad Request")
            ->setJsonContent(['errors' => $task->getMessages()]);
    }
}
