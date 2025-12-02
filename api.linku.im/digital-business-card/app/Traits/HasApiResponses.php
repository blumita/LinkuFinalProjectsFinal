<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait HasApiResponses
{
    /**
     * Return a successful JSON response.
     *
     * @param string $message Success message
     * @param mixed|null $data Optional response data
     * @param int $code HTTP status code (default: 200)
     * @return JsonResponse
     */
    public function ok(string $message = 'عملیات موفق بود', mixed $data = null, int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'status'  => 'success',
            'message' => $message,
            'data'    => $data,
        ], $code);
    }

    /**
     * Return a generic failure JSON response.
     *
     * @param string $message Error message
     * @param mixed|null $errors Optional error details
     * @param int $code HTTP status code (default: 400)
     * @param string|null $errorCode Optional error code for frontend handling
     * @return JsonResponse
     */
    public function fail(string $message = 'عملیات ناموفق بود', mixed $errors = null, int $code = 400, ?string $errorCode = null): JsonResponse
    {
        $response = [
            'success' => false,
            'status'  => 'error',
            'message' => $message,
            'errors'  => $errors,
        ];
        
        if ($errorCode) {
            $response['code'] = $errorCode;
        }
        
        return response()->json($response, $code);
    }

    /**
     * Return a validation error response.
     *
     * @param array $errors Validation error details
     * @param string $message Optional message (default: "Validation errors occurred")
     * @return JsonResponse
     */
    public function validationError(array $errors, string $message = 'خطاهای اعتبارسنجی وجود دارد'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'status'  => 'validation_error',
            'message' => $message,
            'errors'  => $errors,
        ], 422);
    }

    /**
     * Return an unauthorized access response.
     *
     * @param string $message Optional message (default: "Unauthorized action")
     * @return JsonResponse
     */
    public function unauthorized(string $message = 'شما اجازه انجام این عملیات را ندارید'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'status'  => 'unauthorized',
            'message' => $message,
        ], 403);
    }

    /**
     * Return a not found response.
     *
     * @param string $message Optional message (default: "Resource not found")
     * @return JsonResponse
     */
    public function notFound(string $message = 'منبع مورد نظر یافت نشد'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'status'  => 'not_found',
            'message' => $message,
        ], 404);
    }
}
