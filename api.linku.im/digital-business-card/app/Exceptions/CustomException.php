<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class CustomException extends Exception
{
    protected array $additionalData = [];

    public function __construct($message = "", $code = 0, array $additionalData = [])
    {
        parent::__construct($message, $code);
        $this->additionalData = $additionalData;
    }

    public function render($request): JsonResponse
    {
        $response = [
            'message' => $this->getMessage(),
        ];

        // اضافه کردن داده‌های اضافی (مثل code و remaining_seconds)
        if (!empty($this->additionalData)) {
            $response = array_merge($response, $this->additionalData);
        }

        return response()->json($response, $this->getCode() ?: 422);
    }
}
