<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\v1\Controller;
use App\Models\Tutorial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class TutorialController extends Controller
{
    /**
     * Public endpoint - List all active tutorials
     */
    public function index(Request $request): JsonResponse
    {
        $query = Tutorial::active()->ordered();

        // Filter by category if provided
        if ($category = $request->get('category')) {
            $query->byCategory($category);
        }

        $tutorials = $query->get();

        return response()->json($tutorials);
    }

    /**
     * Admin endpoint - List all tutorials with pagination
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Tutorial::query()->orderBy('order');

        if ($search = $request->get('search')) {
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        if ($category = $request->get('category')) {
            $query->where('category', $category);
        }

        $tutorials = $query->paginate($request->get('per_page', 10));

        return response()->json($tutorials);
    }

    /**
     * Get single tutorial by ID or slug
     */
    public function show($idOrSlug): JsonResponse
    {
        $tutorial = is_numeric($idOrSlug) 
            ? Tutorial::find($idOrSlug)
            : Tutorial::where('slug', $idOrSlug)->first();

        if (!$tutorial) {
            return response()->json(['message' => 'ویدیو آموزشی یافت نشد.'], 404);
        }

        return response()->json($tutorial);
    }

    /**
     * Create a new tutorial
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:tutorials,slug',
            'description' => 'nullable|string|max:2000',
            'video_url' => 'required|string|max:500',
            'thumbnail' => 'nullable|string|max:500',
            'duration' => 'nullable|integer|min:0',
            'category' => 'nullable|string|max:100',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Set default order if not provided
        if (!isset($validated['order'])) {
            $validated['order'] = Tutorial::max('order') + 1;
        }

        $tutorial = Tutorial::create($validated);

        $this->clearCache();

        return response()->json([
            'message' => 'ویدیو آموزشی با موفقیت ایجاد شد.',
            'tutorial' => $tutorial
        ], 201);
    }

    /**
     * Update an existing tutorial
     */
    public function update(Request $request, $id): JsonResponse
    {
        $tutorial = Tutorial::find($id);

        if (!$tutorial) {
            return response()->json(['message' => 'ویدیو آموزشی یافت نشد.'], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:tutorials,slug,' . $id,
            'description' => 'nullable|string|max:2000',
            'video_url' => 'required|string|max:500',
            'thumbnail' => 'nullable|string|max:500',
            'duration' => 'nullable|integer|min:0',
            'category' => 'nullable|string|max:100',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        // Auto-generate slug if empty
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $tutorial->update($validated);

        $this->clearCache();

        return response()->json([
            'message' => 'ویدیو آموزشی با موفقیت بروزرسانی شد.',
            'tutorial' => $tutorial
        ]);
    }

    /**
     * Toggle tutorial active status
     */
    public function toggleStatus($id): JsonResponse
    {
        $tutorial = Tutorial::find($id);

        if (!$tutorial) {
            return response()->json(['message' => 'ویدیو آموزشی یافت نشد.'], 404);
        }

        $tutorial->update(['is_active' => !$tutorial->is_active]);

        $this->clearCache();

        return response()->json([
            'message' => 'وضعیت ویدیو آموزشی تغییر کرد.',
            'tutorial' => $tutorial
        ]);
    }

    /**
     * Delete a tutorial
     */
    public function destroy($id): JsonResponse
    {
        $tutorial = Tutorial::find($id);

        if (!$tutorial) {
            return response()->json(['message' => 'ویدیو آموزشی یافت نشد.'], 404);
        }

        $tutorial->delete();

        $this->clearCache();

        return response()->json(['message' => 'ویدیو آموزشی با موفقیت حذف شد.']);
    }

    /**
     * Reorder tutorials
     */
    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:tutorials,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['items'] as $item) {
            Tutorial::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        $this->clearCache();

        return response()->json(['message' => 'ترتیب ویدیوهای آموزشی بروزرسانی شد.']);
    }

    /**
     * Get all categories
     */
    public function categories(): JsonResponse
    {
        $categories = Tutorial::distinct()->pluck('category')->filter()->values();

        return response()->json($categories);
    }

    /**
     * Clear tutorial caches
     */
    private function clearCache(): void
    {
        Cache::forget('tutorials.active');
    }
}
