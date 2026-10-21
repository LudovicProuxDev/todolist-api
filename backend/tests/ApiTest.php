<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Entity\User;
use App\Factory\UserFactory;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

abstract class ApiTest extends ApiTestCase
{
    private static ?string $cachedToken = null;

    protected function getTokenFromMotherApp(): string
    {
        // Cache from token
        if (null !== self::$cachedToken) {
            return self::$cachedToken;
        }

        $container = static::getContainer();
        $jwtManager = $container->get(JWTTokenManagerInterface::class);
        $em = $container->get(EntityManagerInterface::class);

        // Get User from the database
        $user = $em->getRepository(User::class)->findOneBy([
            'username' => 'joe.doe',
        ]);
        if (!$user) {
            $user = UserFactory::createOne([
                'username' => 'joe.doe',
                'roles' => ['ROLE_USER', 'ROLE_ADMIN'],
                'password' => password_hash('$3CR3T', PASSWORD_BCRYPT),
                'lastname' => 'DOE',
                'firstname' => 'Joe',
                'email' => 'joe.doe@gmail.com',
            ]);
        }

        self::$cachedToken = $jwtManager->create($user);

        return self::$cachedToken;
    }

    protected function getAuthenticatedClient(): Client
    {
        $token = $this->getTokenFromMotherApp();

        return static::createClient([], [
            'headers' => [
                'Authorization' => 'Bearer '.$token,
            ],
        ]);
    }
}
