<?php

namespace App\Tests;

use Zenstruck\Foundry\Test\ResetDatabase;

class MetricsTest extends ApiTest
{
    use ResetDatabase;

    public function testMetricsPrometheusAccessDenied(): void
    {
        self::$alwaysBootKernel = false;

        $client = $this->getAuthenticatedClient();
        $response = $client->request('GET', '/metrics/prometheus');

        $this->assertResponseStatusCodeSame(403);
    }
}
