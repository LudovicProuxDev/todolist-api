<?php

namespace App\Tests;

use App\Entity\User;
use App\Factory\UserFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class UserTest extends ApiTest
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;

    public function testGetCollection(): void
    {
        self::$alwaysBootKernel = false;

        // Create 100 users using our factory
        UserFactory::createMany(100);

        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $client = $this->getAuthenticatedClient();
        $response = $client->request('GET', '/api/users');

        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/api/contexts/User',
            '@id' => '/api/users',
            '@type' => 'Collection',
            'totalItems' => 101,
            'view' => [
                '@id' => '/api/users?page=1',
                '@type' => 'PartialCollectionView',
                'first' => '/api/users?page=1',
                'last' => '/api/users?page=4',
                'next' => '/api/users?page=2',
            ],
        ]);

        // Because test fixtures are automatically loaded between each test, you can assert on them
        $this->assertCount(30, $response->toArray()['member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        // This generated JSON Schema is also used in the OpenAPI spec!
        $this->assertMatchesResourceCollectionJsonSchema(User::class);
    }

    public function testCreateUser(): void
    {
        self::$alwaysBootKernel = false;

        $client = $this->getAuthenticatedClient();
        $response = $client->request(
            'POST',
            '/api/users',
            [
                'headers' => ['Content-Type' => 'application/ld+json'],
                'json' => [
                    'username' => 'ludovic',
                    'roles' => ['ROLE_USER', 'ROLE_ADMIN'],
                    //'password' => self::getContainer()->get('test.user_password_hasher')->hashPassword(new User(), '$3CR3T'),
                    'plainPassword' => '$3CR3T',
                    'lastname' => 'PROUX',
                    'firstname' => 'Ludovic',
                    'email' => 'ludovic.proux@outlook.fr',
                ],
            ],
        );

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/User',
            '@type' => 'User',
            'username' => 'ludovic',
            'roles' => ['ROLE_USER', 'ROLE_ADMIN'],
            'lastname' => 'PROUX',
            'firstname' => 'Ludovic',
            'email' => 'ludovic.proux@outlook.fr',
        ]);
        $this->assertMatchesRegularExpression('~^/api/users/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(User::class);
    }

    public function testUpdateUser(): void
    {
        // Only create the user we need with a given username
        UserFactory::createOne(['username' => 'john.doe']);

        $client = $this->getAuthenticatedClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(User::class, ['username' => 'john.doe']);

        // Use the PATCH method here to do a partial update
        $client->request('PATCH', $iri, [
            'json' => [
                'lastname' => 'DOE',
                'firstname' => 'John',
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ],
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'username' => 'john.doe',
            'lastname' => 'DOE',
            'firstname' => 'John',
        ]);
    }

    public function testDeleteUser(): void
    {
        // Only create the user we need with a given username
        UserFactory::createOne(['username' => 'jane.doe']);

        $client = $this->getAuthenticatedClient();
        $iri = $this->findIriBy(User::class, ['username' => 'jane.doe']);

        $client->request('DELETE', $iri);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(User::class)->findOneBy(['username' => 'jane.doe'])
        );
    }

    public function testMe(): void
    {
        self::$alwaysBootKernel = false;

        $client = $this->getAuthenticatedClient();
        $response = $client->request(
            'GET',
            '/api/me',
            [
                'headers' => ['Content-Type' => 'application/ld+json'],
            ],
        );

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/User',
            '@type' => 'User',
            'username' => 'joe.doe',
            'roles' => ['ROLE_USER'],
            'lastname' => 'DOE',
            'firstname' => 'Joe',
            'email' => 'joe.doe@gmail.com',
        ]);
        $this->assertMatchesRegularExpression('~^/api/me$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(User::class);
    }
}
