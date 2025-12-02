<?php

namespace App\Http\Controllers\v1;


use App\Http\Requests\v1\PlanRequest;
use App\Http\Resources\v1\PlanResource;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class PlanController
{

    public function index(): AnonymousResourceCollection
    {
        $plans = Cache::remember('plans.active', now()->addMinutes(10), function () {
            return Plan::where('active', 'active')->get();
        });

        return PlanResource::collection($plans);
    }

    public function adminIndex(): AnonymousResourceCollection
    {
        $plans = Cache::remember('plans.all', now()->addMinutes(10), function () {
            return Plan::all();
        });
        return PlanResource::collection($plans);
    }


    public function store(PlanRequest $request): JsonResponse
    {
        $plan = Plan::create($request->validated());

        Cache::forget('plans.active');
        Cache::forget('plans.all');

        return response()->json(['message' => 'Plan created successfully.',
            'plan' => new PlanResource($plan)], 201);
    }


    public function show(int|string $id): JsonResponse
    {
        $plan = Plan::find($id);
        if (!$plan) {
            return response()->json(['message' => 'Plan not found.'], 404);
        }

        return response()->json(['plan' => $plan], 200);
    }


    public function update(PlanRequest $request, $id): JsonResponse
    {
        $plan = Plan::find($id);
        if (!$plan) {
            return response()->json(['message' => 'Plan not found.'], 404);
        }

        $plan->update($request->validated());

        Cache::forget('plans.active');
        Cache::forget('plans.all');

        return response()->json(['message' => 'Plan updated successfully.', 'plan' => $plan], 200);
    }

    public function destroy($id): JsonResponse
    {
        $plan = Plan::find($id);
        if (!$plan) {
            return response()->json(['message' => 'Plan not found.'], 404);
        }

        $plan->delete();

        Cache::forget('plans.active');
        Cache::forget('plans.all');

        return response()->json(['message' => 'Plan deleted successfully.'], 200);
    }
}
