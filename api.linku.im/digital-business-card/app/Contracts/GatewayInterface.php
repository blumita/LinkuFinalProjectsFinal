<?php

namespace App\Contracts;

interface GatewayInterface
{
    public const GATEWAY_NAME='';

    public function pay(float $amount, string $callbackUrl, array $meta = []): mixed;

    public function verify(array $requestData): array;

}
