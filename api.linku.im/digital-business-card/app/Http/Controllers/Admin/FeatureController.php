<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\v1\Controller;
use App\Models\Feature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class FeatureController extends Controller
{
    /**
     * Public endpoint - List all active features
     */
    public function index(Request $request): JsonResponse
    {
        $features = Cache::remember('features.active', now()->addMinutes(10), function () {
            return Feature::active()->ordered()->get();
        });

        return response()->json($features);
    }

    /**
     * Admin endpoint - List all features with pagination
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Feature::query()->orderBy('order');

        if ($search = $request->get('search')) {
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        $features = $query->paginate($request->get('per_page', 10));

        return response()->json($features);
    }

    /**
     * Get single feature by ID or slug
     */
    public function show($idOrSlug): JsonResponse
    {
        $feature = is_numeric($idOrSlug) 
            ? Feature::find($idOrSlug)
            : Feature::where('slug', $idOrSlug)->first();

        if (!$feature) {
            return response()->json(['message' => 'ویژگی یافت نشد.'], 404);
        }

        return response()->json($feature);
    }

    /**
     * Create a new feature
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:features,slug',
            'icon' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'content' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Set default order if not provided
        if (!isset($validated['order'])) {
            $validated['order'] = Feature::max('order') + 1;
        }

        $feature = Feature::create($validated);

        $this->clearCache();

        return response()->json([
            'message' => 'ویژگی با موفقیت ایجاد شد.',
            'feature' => $feature
        ], 201);
    }

    /**
     * Update an existing feature
     */
    public function update(Request $request, $id): JsonResponse
    {
        $feature = Feature::find($id);

        if (!$feature) {
            return response()->json(['message' => 'ویژگی یافت نشد.'], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:features,slug,' . $id,
            'icon' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'content' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        // Auto-generate slug if empty
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $feature->update($validated);

        $this->clearCache();

        return response()->json([
            'message' => 'ویژگی با موفقیت بروزرسانی شد.',
            'feature' => $feature
        ]);
    }

    /**
     * Toggle feature active status
     */
    public function toggleStatus($id): JsonResponse
    {
        $feature = Feature::find($id);

        if (!$feature) {
            return response()->json(['message' => 'ویژگی یافت نشد.'], 404);
        }

        $feature->update(['is_active' => !$feature->is_active]);

        $this->clearCache();

        return response()->json([
            'message' => 'وضعیت ویژگی تغییر کرد.',
            'feature' => $feature
        ]);
    }

    /**
     * Delete a feature
     */
    public function destroy($id): JsonResponse
    {
        $feature = Feature::find($id);

        if (!$feature) {
            return response()->json(['message' => 'ویژگی یافت نشد.'], 404);
        }

        $feature->delete();

        $this->clearCache();

        return response()->json(['message' => 'ویژگی با موفقیت حذف شد.']);
    }

    /**
     * Reorder features
     */
    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:features,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['items'] as $item) {
            Feature::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        $this->clearCache();

        return response()->json(['message' => 'ترتیب ویژگی‌ها بروزرسانی شد.']);
    }

    /**
     * Clear feature caches
     */
    private function clearCache(): void
    {
        Cache::forget('features.active');
    }
}
