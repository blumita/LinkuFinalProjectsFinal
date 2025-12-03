<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class CustomException extends Exception
{
    //
    public function render($request): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
        ], $this->getCode() ?: 422);
    }
}
