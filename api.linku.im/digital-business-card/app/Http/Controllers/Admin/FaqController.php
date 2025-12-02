<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\v1\Controller;
use App\Http\Requests\v1\FaqRequest;
use App\Http\Resources\v1\FaqResource;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FaqController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Faq::query()->orderBy('order');

        if ($search = $request->get('search')) {
            $query->where('question', 'like', "%{$search}%");
        }

        $faqs = $query->paginate(10);

        return FaqResource::collection($faqs);
    }
    public function adminIndex(Request $request): AnonymousResourceCollection
    {
        $query = Faq::query()->orderBy('order');

        if ($search = $request->get('search')) {
            $query->where('question', 'like', "%{$search}%");
        }

        $faqs = $query->paginate(10);

        return FaqResource::collection($faqs);
    }

    public function store(FaqRequest $request): FaqResource
    {
        $faq = Faq::create($request->validated());
        return new FaqResource($faq);
    }

    public function show(Faq $faq): FaqResource
    {
        return new FaqResource($faq);
    }

    public function update(FaqRequest $request, $id): FaqResource
    {
        $faq=Faq::find($id);
        $faq->update($request->validated());

        return new FaqResource($faq);
    }

    public function destroy($id): JsonResponse
    {
        $faq=Faq::find($id);
        $faq->delete();
        return response()->json(['message' => 'FAQ deleted successfully']);
    }
}
