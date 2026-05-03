<?php

namespace App\Tests;

use App\Entity\Task;
use App\Factory\TaskFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class TaskTest extends ApiTest
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;

    public function testGetCollection(): void
    {
        self::$alwaysBootKernel = false;

        // Create 100 tasks using our factory
        TaskFactory::createMany(100);

        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $response = static::createClient()->request('GET', '/api/tasks');

        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/api/contexts/Task',
            '@id' => '/api/tasks',
            '@type' => 'Collection',
            'totalItems' => 100,
            'view' => [
                '@id' => '/api/tasks?page=1',
                '@type' => 'PartialCollectionView',
                'first' => '/api/tasks?page=1',
                'last' => '/api/tasks?page=4',
                'next' => '/api/tasks?page=2',
            ],
        ]);

        // Because test fixtures are automatically loaded between each test, you can assert on them
        $this->assertCount(30, $response->toArray()['member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        // This generated JSON Schema is also used in the OpenAPI spec!
        $this->assertMatchesResourceCollectionJsonSchema(Task::class);
    }

    public function testCreateTask(): void
    {
        self::$alwaysBootKernel = false;

        $response = static::createClient()->request(
            'POST',
            '/api/tasks',
            [
                'headers' => ['Content-Type' => 'application/ld+json'],
                'json' => [
                    'description' => 'Do the bathroom',
                    'createdAt' => (new \DateTime)->format('Y-m-d\TH:i:s.v\Z'),
                    'category' => '/api/categories/1',
                ],
            ],
        );

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/Task',
            '@type' => 'Task',
            'description' => 'Do the bathroom',
            'category' => [
                '@id' => '/api/categories/1',
                '@type' => 'Category',
                'id' => 1,
            ],
        ]);
        $this->assertMatchesRegularExpression('~^/api/tasks/\d+$~', $response->toArray()['@id']);
        $this->assertArrayHasKey('label', $response->toArray()['category']);
        $this->assertNotNull($response->toArray()['category']['label']);
        $this->assertArrayHasKey('color', $response->toArray()['category']);
        $this->assertNotNull($response->toArray()['category']['color']);
        $this->assertMatchesResourceItemJsonSchema(Task::class);
    }

    public function testCreateInvalidTask(): void
    {
        self::$alwaysBootKernel = false;

        $response = static::createClient()->request(
            'POST',
            '/api/tasks',
            [
                'headers' => ['Content-Type' => 'application/ld+json'],
                'json' => [
                    'description' => (new \DateTime)->format('Y-m-d\TH:i:s.v\Z'),
                    'createdAt' => 'invalid task',
                    'category' => '/api/categories/200',
                ],
            ],
        );

        $this->assertResponseStatusCodeSame(400);
        $this->assertResponseHeaderSame('content-type', 'application/problem+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/api/contexts/Error',
            '@id' => '/api/errors/400',
            '@type' => 'Error',
            'title' => 'An error occurred',
            'detail' => 'Failed to parse time string (invalid task) at position 0 (i): The timezone could not be found in the database',
            'status' => 400,
            'type' => '/errors/400',
            'description' => 'Failed to parse time string (invalid task) at position 0 (i): The timezone could not be found in the database',
        ]);
    }

    public function testUpdateTask(): void
    {
        // Only create the task we need with a given label
        TaskFactory::createOne(['description' => 'Make an apple pie']);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(Task::class, ['description' => 'Make an apple pie']);

        // Use the PATCH method here to do a partial update
        $response = $client->request('PATCH', $iri, [
            'json' => [
                'createdAt' => (new \DateTime)->format('Y-m-d\TH:i:s.v\Z'),
                'category' => '/api/categories/20',
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'description' => 'Make an apple pie',
            'category' => [
                '@id' => '/api/categories/20',
                '@type' => 'Category',
                'id' => 20,
            ],
        ]);
        $this->assertArrayHasKey('label', $response->toArray()['category']);
        $this->assertNotNull($response->toArray()['category']['label']);
        $this->assertArrayHasKey('color', $response->toArray()['category']);
        $this->assertNotNull($response->toArray()['category']['color']);
    }

    public function testDeleteTask(): void
    {
        // Only create the task we need with a given label
        TaskFactory::createOne(['description' => 'Buy apples']);

        $client = static::createClient();
        $iri = $this->findIriBy(Task::class, ['description' => 'Buy apples']);

        $client->request('DELETE', $iri);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(Task::class)->findOneBy(['description' => 'Buy apples'])
        );
    }
}
