<?php

namespace App\Http\Controllers;

use App\Http\Controllers\v1\Controller;
use App\Http\Requests\v1\DiscountRequest;
use App\Http\Resources\v1\DiscountResource;
use App\Models\Discount;
use App\Traits\HasApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DiscountController extends Controller
{
    use HasApiResponses;

    public function index(): JsonResponse
    {
        $discounts = Discount::all();
        return $this->ok('',DiscountResource::collection($discounts));
    }

    public function store(DiscountRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $discount = Discount::create([
            'code'        => $validated['code'],
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'type'        => $validated['type'],
            'value'       => $validated['value'],
            'max_usage'    => $validated['maxUsage'] ?? null,
            'used_count'   => $validated['usedCount'] ?? 0,
            'expiry_date'  => $validated['expiryDate'] ?? null,
            'is_active'      => $validated['active'] ?? true,
        ]);

        return response()->json([
            'message' => 'تخفیف با موفقیت ایجاد شد.',
            'data'    => $discount
        ], 201);
    }
    public function show(Discount $discount): JsonResponse
    {
        return response()->json($discount);
    }

    public function update(DiscountRequest $request, $id): JsonResponse
    {
        $validated = $request->validated();

        $discount=Discount::find($id);

        $discount->update([
            'code'        => $validated['code'],
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'type'        => $validated['type'],
            'value'       => $validated['value'],
            'max_usage'   => $validated['maxUsage'] ?? null,
            'used_count'  => $validated['usedCount'] ?? 0,
            'expiry_date' => $validated['expiryDate'] ?? null,
            'is_active'   => $validated['active'] ?? true,
        ]);

        return response()->json([
            'message' => 'تخفیف با موفقیت بروزرسانی شد.',
            'data' => $discount
        ]);
    }

    public function destroy($id): Response
    {
        $discount=Discount::find($id);
        $discount->delete();
        return response()->noContent();
    }


    public function apply(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $code = $request->input('code');
        $discount = Discount::where('code', $code)->first();

        if (!$discount || !$discount->isValid()) {
            return response()->json(['error' => 'کد تخفیف نامعتبر یا منقضی است.'], 422);
        }

        //$discount->increment('used_count');
        $data=[
            'value' => $discount->value,
            'type' => $discount->type,
            'code'=>$discount->code
        ];

        return $this->ok('',$data,200);
    }

    public function validateCode(Request $request): JsonResponse
    {
        $request->validate(['code' => 'required|string']);

        $discount = Discount::where('code', $request->code)->first();

        if(!$discount || !$discount->isValid()) {
            return $this->fail('',false,200);
        }
        $data=[
            'value' => $discount->value,
            'type' => $discount->type,
            'code'=>$discount->code
        ];

        return $this->ok('',$data,200);
    }

    public function preview(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
            'amount' => 'required|numeric|min:0',
        ]);

        $discount = Discount::where('code', $request->code)->first();

        if (!$discount || !$discount->isValid()) {
            return response()->json(['error' => 'کد تخفیف نامعتبر یا منقضی است.'], 422);
        }

        $amount = $request->amount;
        $discounted = $discount->type === 'percentage'
            ? $amount * (1 - $discount->value / 100)
            : max(0, $amount - $discount->value);

        return response()->json([
            'original_amount' => $amount,
            'discounted_amount' => round($discounted, 2),
        ]);
    }

    public function assignToUser(Request $request): JsonResponse
    {
        $request->validate([
            'id' => 'required|integer|exists:discounts,id',
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $discount = Discount::findOrFail($request->id);
        $discount->user_id = $request->user_id;
        $discount->save();

        return response()->json([
            'message' => 'کد تخفیف به کاربر اختصاص داده شد.',
            'discount' => $discount
        ]);
    }

    public function toggleStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'active' => 'required|boolean',
        ]);

        $discount = Discount::findOrFail($id);
        $discount->is_active = $request->active;
        $discount->save();

        return response()->json([
            'message' => 'وضعیت تخفیف با موفقیت تغییر کرد.',
            'data' => $discount
        ]);
    }

}
