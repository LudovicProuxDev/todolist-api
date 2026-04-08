<?php

namespace App\Tests\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

final class LogoutControllerTest extends WebTestCase
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        $container = self::getContainer();

        $user = new User();
        $user->setUsername('jane.doe');
        $user->setLastname('DOE');
        $user->setFirstname('Jane');
        $user->setRoles(['ROLE_USER']);
        $user->setEmail('jane.doe@gmail.com');
        $user->setPassword(
            $container->get('test.user_password_hasher')->hashPassword($user, '$3CR3T')
        );

        $manager = $container->get('doctrine')->getManager();
        $manager->persist($user);
        $manager->flush();
    }

    public function testIndex(): void
    {
        $client = static::createClient();

        // --- Step 1 : LOGIN ---
        $client->request(
            'POST',
            '/api/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'username' => 'jane.doe',
                'password' => '$3CR3T',
            ])
        );

        $this->assertResponseIsSuccessful();
        $this->assertResponseHasCookie('BEARER');

        // --- Step 2 : LOGOUT ---
        $client->request('POST', '/api/logout');

        self::assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);

        $content = json_decode($client->getResponse()->getContent(), true);
        self::assertEquals('Logout successed', $content['message']);

        // --- Step 3 : Check the deletion of the cookie ---
        $response = $client->getResponse();
        $foundDeletedCookie = false;

        foreach ($response->headers->getCookies() as $cookie) {
            if ($cookie->getName() === 'BEARER') {
                // A "deleted" cookie has an expiration date in the past (often = 1)
                $this->assertLessThan(time(), $cookie->getExpiresTime());
                $foundDeletedCookie = true;
            }
        }

        $this->assertTrue($foundDeletedCookie, "The Set-Cookie header did not return the deletion instruction.");
    }
}
