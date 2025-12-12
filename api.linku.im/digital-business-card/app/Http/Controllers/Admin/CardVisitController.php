<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\v1\Controller;
use App\Http\Requests\v1\CardVisitUpdateRequest;
use App\Http\Resources\v1\CardVisitResource;
use App\Models\CardVisit;
use App\Services\CardVisitService;
use App\Traits\HasApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CardVisitController extends Controller
{
    use HasApiResponses;

    protected CardVisitService $service;

    public function __construct(CardVisitService $service)
    {
        $this->service = $service;
    }

    public function index(): JsonResponse
    {
        $visits = CardVisit::latest()->get();

        return $this->ok('لیست کارت ویزیت با موفقیت دریافت شد.',
            CardVisitResource::collection($visits),
            200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cardType' => 'required|integer',
            'mobile' => 'required|string|max:15',
            'ownerName' => 'required|string|max:255',
            'qrLink' => 'required|string',
            'status' => 'nullable|string',
            'licenseId'=>'nullable|string'
        ]);

        $visit = $this->service->saveCardVisit($validated);


        return $this->ok('بازدید کارت با موفقیت ثبت شد.'
            , new CardVisitResource($visit)
            , 200);

    }

    public function update(CardVisitUpdateRequest $request, $id): void
    {

        $card = CardVisit::find($id);

        $card->update($request->validated());

    }

    public function destroy(Request $request, $id): void
    {

        $card = CardVisit::find($id);

        $card->delete();

    }
    public function destroyCustom(Request $request): void
    {
        $ids = $request->ids;
        CardVisit::whereIn('id', $ids)->delete();
    }

    /**
     * ایجاد کارت دستی برای لایسنس‌های چاپ شده
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function createManual(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|max:50|unique:cards,slug',
            'card_name' => 'required|string|max:255',
        ], [
            'slug.required' => 'شناسه لایسنس الزامی است',
            'slug.unique' => 'این لایسنس قبلا ثبت شده است',
            'card_name.required' => 'نام کارت الزامی است',
        ]);

        try {
            // ایجاد کارت با اطلاعات مینیمال
            $maxCardNumber = \App\Models\Card::max('card_number');
            $nextCardNumber = $maxCardNumber ? $maxCardNumber + 1 : 1;
            
            $card = \App\Models\Card::create([
                'slug' => $validated['slug'],
                'card_name' => $validated['card_name'],
                'card_number' => $nextCardNumber,
                'theme_color' => '#ffffff',
                'icon_color' => '#000000',
                'is_active' => true,
                'creator_id' => auth()->id() ?? 1,
            ]);

            return $this->ok(
                'لایسنس با موفقیت ایجاد شد.',
                [
                    'card' => $card,
                    'url' => 'https://linku.im/' . $card->slug . '/model-1'
                ],
                201
            );
        } catch (\Exception $e) {
            \Log::error('Manual card creation error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->error('خطا در ایجاد لایسنس: ' . $e->getMessage(), [], 500);
        }
    }
}
