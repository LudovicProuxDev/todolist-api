<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\Response;

final class AuthenticationSuccessListener
{
    #[AsEventListener(event: 'lexik_jwt_authentication.on_authentication_success')]
    public function onSecurityAuthenticationSuccess(AuthenticationSuccessEvent $event): void
    {
        $response = $event->getResponse();

        // Change status 200 to 204
        $response->setStatusCode(Response::HTTP_NO_CONTENT);

        // Optional: We clear the response body in case there is any remaining data
        $response->setContent(null);
    }
}
