<?php

namespace App\Domain\Helpers;

use Illuminate\Http\JsonResponse;

/**
 * Base API Response Trait
 * Provides standardized JSON response format for all Domain controllers
 * 
 * Usage in Controller:
 * use BaseApiResponse;
 * return $this->successResponse($data, 'Success message');
 * return $this->errorResponse('Error message', 404);
 */
trait BaseApiResponse
{
    /**
     * Success response
     * 
     * @param mixed $data
     * @param string $message
     * @param int $httpCode
     * @return JsonResponse
     */
    protected function successResponse($data = null, string $message = 'Success', int $httpCode = 200): JsonResponse
    {
        $response = [
            'status' => 'success',
            'httpCode' => $httpCode,
            'message' => $message,
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        return response()->json($response, $httpCode);
    }

    /**
     * Error response
     * 
     * @param string $message
     * @param int $httpCode
     * @param mixed $errors
     * @return JsonResponse
     */
    protected function errorResponse(string $message = 'Error', int $httpCode = 400, $errors = null): JsonResponse
    {
        $response = [
            'status' => 'error',
            'httpCode' => $httpCode,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $httpCode);
    }

    /**
     * Created response (for store operations)
     * 
     * @param mixed $data
     * @param string $message
     * @return JsonResponse
     */
    protected function createdResponse($data = null, string $message = 'Created successfully'): JsonResponse
    {
        return $this->successResponse($data, $message, 201);
    }

    /**
     * No content response (for delete operations)
     * 
     * @param string $message
     * @return JsonResponse
     */
    protected function deletedResponse(string $message = 'Deleted successfully'): JsonResponse
    {
        return $this->successResponse(null, $message, 200);
    }

    /**
     * Not found response
     * 
     * @param string $message
     * @return JsonResponse
     */
    protected function notFoundResponse(string $message = 'Resource not found'): JsonResponse
    {
        return $this->errorResponse($message, 404);
    }

    /**
     * Validation error response
     * 
     * @param mixed $errors
     * @param string $message
     * @return JsonResponse
     */
    protected function validationErrorResponse($errors, string $message = 'Validation failed'): JsonResponse
    {
        return $this->errorResponse($message, 422, $errors);
    }

    /**
     * Unauthorized response
     * 
     * @param string $message
     * @return JsonResponse
     */
    protected function unauthorizedResponse(string $message = 'Unauthorized'): JsonResponse
    {
        return $this->errorResponse($message, 401);
    }

    /**
     * Forbidden response
     * 
     * @param string $message
     * @return JsonResponse
     */
    protected function forbiddenResponse(string $message = 'Forbidden'): JsonResponse
    {
        return $this->errorResponse($message, 403);
    }

    /**
     * Server error response
     * 
     * @param string $message
     * @param mixed $errors
     * @return JsonResponse
     */
    protected function serverErrorResponse(string $message = 'Internal server error', $errors = null): JsonResponse
    {
        return $this->errorResponse($message, 500, $errors);
    }

    /**
     * Paginated response
     * 
     * @param mixed $paginatedData Laravel paginator instance or array from cache
     * @param string $message
     * @return JsonResponse
     */
    protected function paginatedResponse($paginatedData, string $message = 'Success'): JsonResponse
    {
        // If it's an array (from cache), return it directly
        if (is_array($paginatedData)) {
            return $this->successResponse($paginatedData, $message);
        }

        // If it's a Paginator instance
        return $this->successResponse([
            'items' => $paginatedData->items(),
            'pagination' => [
                'total' => $paginatedData->total(),
                'per_page' => $paginatedData->perPage(),
                'current_page' => $paginatedData->currentPage(),
                'last_page' => $paginatedData->lastPage(),
                'from' => $paginatedData->firstItem(),
                'to' => $paginatedData->lastItem(),
            ]
        ], $message);
    }
}
