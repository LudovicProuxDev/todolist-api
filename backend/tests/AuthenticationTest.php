<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use Hautelook\AliceBundle\PhpUnit\ReloadDatabaseTrait;

class AuthenticationTest extends ApiTestCase
{
    use ReloadDatabaseTrait;

    public function testLogin(): void
    {
        self::$alwaysBootKernel = false;

        $client = self::createClient();
        $container = self::getContainer();

        $user = new User();
        $user->setUsername('joe.doe');
        $user->setLastname('DOE');
        $user->setFirstname('Joe');
        $user->setRoles(['ROLE_USER']);
        $user->setUsername('joe.doe');
        $user->setEmail('joe.doe@gmail.com');
        $user->setPassword(
            $container->get('test.user_password_hasher')->hashPassword($user, '$3CR3T')
        );

        $manager = $container->get('doctrine')->getManager();
        $manager->persist($user);
        $manager->flush();

        // retrieve a token
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

        // test not authorized
        $client->request('GET', '/api/users');
        $this->assertResponseStatusCodeSame(401);

        // test authorized
        $client->request('GET', '/api/users', ['auth_bearer' => $json['token']]);
        $this->assertResponseIsSuccessful();
    }
}
