<?php

use Phalcon\Mvc\Controller;
use Firebase\JWT\JWT;

class AuthController extends Controller
{
    public function registerAction()
    {
        $data = $this->request->getJsonRawBody(true);

        $user = new Users();
        $user->email = $data['email'];
        $user->password = $data['password'];

        if ($user->save()) {
            return $this->response->setJsonContent(['message' => 'User registered']);
        }

        return $this->response->setStatusCode(400, "Bad Request")
            ->setJsonContent(['errors' => $user->getMessages()]);
    }

    public function loginAction()
    {
        $data = $this->request->getJsonRawBody(true);
        $user = Users::findFirstByEmail($data['email']);

        if ($user && password_verify($data['password'], $user->password)) {
            $token = JWT::encode(
                ['id' => $user->id, 'email' => $user->email, 'exp' => time() + 3600],
                'secret_key',
                'HS256'
            );
            return $this->response->setJsonContent(['token' => $token]);
        }

        return $this->response->setStatusCode(401, "Unauthorized")
            ->setJsonContent(['message' => 'Invalid credentials']);
    }
}
