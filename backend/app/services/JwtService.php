<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Phalcon\Di\DiInterface;

class JwtService
{
    private string $secret;
    private int $ttl;

    public function __construct(DiInterface $di)
    {
        $cfg = $di->get('config');
        $this->secret = $cfg->security->jwt_secret;
        $this->ttl    = (int)$cfg->security->jwt_ttl;
    }

    public function makeToken(array $payload): string
    {
        $now = time();
        $claims = array_merge([
            'iat' => $now,
            'exp' => $now + $this->ttl,
        ], $payload);

        return JWT::encode($claims, $this->secret, 'HS256');
    }

    public function decode(string $jwt): object
    {
        return JWT::decode($jwt, new Key($this->secret, 'HS256'));
    }
}
