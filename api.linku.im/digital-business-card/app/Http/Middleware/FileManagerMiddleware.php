<?php

namespace App\Http\Middleware;

use App\Models\Card;
use App\Models\User;
use Closure;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FileManagerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure(Request): (Response) $next
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userId = $request->user()->id;

        $type = $request->input('modelType');

        $id = $request->route('id');

        $map = config('file-manager.model_map');

        $modelClass = $map[$type];

        if (!$modelClass || !class_exists($modelClass)) {
            throw new ModelNotFoundException("Model type '{$type}' is invalid.");
        }

        $model = $modelClass::findOrFail($id);


        if ($model instanceof User) {
            if ($model->id !== $userId) {
                return $this->unauthorized($model->id);
            }
        } elseif ($model instanceof Card) {
            if ($model->user_id !== $userId) {
                return $this->unauthorized($model->id);
            }
        } else {

            if (method_exists($model, 'card') &&
                $model->card &&
                $model->card->user_id !== $userId
            ) {
                return $this->unauthorized($model->id);
            }
        }

        return $next($request);
    }

    protected function unauthorized(string $param): Response
    {
        return response()->json([
            'message' => "Mistake this id ({$param})."
        ], 403);
    }
}
