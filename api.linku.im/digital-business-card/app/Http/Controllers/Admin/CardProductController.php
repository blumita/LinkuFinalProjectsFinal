<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\v1\CardProductRequest;
use App\Http\Resources\v1\CardProductResource;
use App\Models\CardProduct;
use App\Services\CardProductService;
use App\Traits\HasApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CardProductController
{
    use HasApiResponses;

    protected CardProductService $service;

    public function __construct(CardProductService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        //
        $products = CardProduct::all();


        return $this->ok('محصولات با موفقیت بازیابی شد.',
            CardProductResource::collection($products), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CardProductRequest $request): JsonResponse
    {
        //
        $data = $request->validated();

        $cardProduct = $this->service->saveCardProduct($data);

        return $this->ok('',new CardProductResource($cardProduct));


    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        //
        $card = CardProduct::findOrFail($id);
        $data = $request->only(['name','description','status']);
        $this->service->updateCardProduct($data, $card);

        return $this->ok();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): void
    {
        //
        $product = CardProduct::find($id);

        $product->delete();
    }

    public function toggleStatus(Request $request,$id): JsonResponse
    {

        $product = CardProduct::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'محصول یافت نشد.'
            ], 404);
        }

        $product->status =$request->input('status');
        $product->save();

        return response()->json([
            'message' => 'وضعیت محصول با موفقیت بازنشانی شد.',
            'product' => $product
        ]);
    }
}
