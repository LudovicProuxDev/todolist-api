<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Category;
use App\Factory\CategoryFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class CategoryTest extends ApiTestCase
{
    // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
    use ResetDatabase, Factories;
    
    public function testGetCollection(): void
    {
        self::$alwaysBootKernel = false;

        // Create 10 categories using our factory
        CategoryFactory::createMany(100);

        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $response = static::createClient()->request('GET', '/api/categories');
        
        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/api/contexts/Category',
            '@id' => '/api/categories',
            '@type' => 'Collection',
            'totalItems' => 100,
            'view' => [
                '@id' => '/api/categories?page=1',
                '@type' => 'PartialCollectionView',
                'first' => '/api/categories?page=1',
                'last' => '/api/categories?page=4',
                'next' => '/api/categories?page=2',
            ],
        ]);

        // Because test fixtures are automatically loaded between each test, you can assert on them
        $this->assertCount(30, $response->toArray()['member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        // This generated JSON Schema is also used in the OpenAPI spec!
        $this->assertMatchesResourceCollectionJsonSchema(Category::class);
    }

    public function testCreateCategory(): void
    {
        self::$alwaysBootKernel = false;

        $response = static::createClient()->request('POST', '/api/categories',
            [
                'headers' => ['Content-Type' => 'application/ld+json'],
                'json' => [
                    'label' => 'Housework',
                    'color' => '#eeeeee',
                ],
            ],
        );

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/Category',
            '@type' => 'Category',
            'label' => 'Housework',
            'color' => '#eeeeee',
        ]);
        $this->assertMatchesRegularExpression('~^/api/categories/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(Category::class);
    }

    public function testCreateInvalidCategory(): void
    {
        self::$alwaysBootKernel = false;

        $response = static::createClient()->request('POST', '/api/categories',
            [
                'headers' => ['Content-Type' => 'application/ld+json'],
                'json' => [
                    'label' => 10,
                    'color' => 10.1,
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
            'detail' => 'The type of the "label" attribute must be "string", "integer" given.',
            'status' => 400,
            'type' => '/errors/400',
            'description' => 'The type of the "label" attribute must be "string", "integer" given.',
        ]);
    }

    public function testUpdateCategory(): void
    {
        // Only create the category we need with a given label
        CategoryFactory::createOne(['label' => 'Cooking']);

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $iri = $this->findIriBy(Category::class, ['label' => 'Cooking']);

        // Use the PATCH method here to do a partial update
        $client->request('PATCH', $iri, [
            'json' => [
                'color' => '#ff2525',
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'label' => 'Cooking',
            'color' => '#ff2525',
        ]);
    }

    public function testDeleteCategory(): void
    {
        // Only create the category we need with a given label
        CategoryFactory::createOne(['label' => 'Shopping']);

        $client = static::createClient();
        $iri = $this->findIriBy(Category::class, ['label' => 'Shopping']);

        $client->request('DELETE', $iri);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(Category::class)->findOneBy(['label' => 'Shopping'])
        );
    }
}
