<?php

namespace App\Tests;

use Zenstruck\Foundry\Test\ResetDatabase;

class AuthenticationTest extends ApiTest
{
    use ResetDatabase;

    public function testLogin(): void
    {
        self::$alwaysBootKernel = false;

        $client = $this->getAuthenticatedClient();

        $response = $client->request('POST', '/api/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'username' => 'joe.doe',
                'password' => '$3CR3T',
            ],
        ]);

        $json = $response->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertArrayHasKey('token', $json);

        $client->request('GET', '/api/users');
        $this->assertResponseStatusCodeSame(200);

        $client->request('GET', '/api/users', ['auth_bearer' => $json['token']]);
        $this->assertResponseIsSuccessful();
    }
}
