<?php

namespace App\Http\Controllers;

use App\Http\Resources\v1\CardFormResource;
use App\Models\Form;
use App\Services\CardFormService;
use App\Traits\HasApiResponses;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FormController
{

    use AuthorizesRequests, HasApiResponses;

    protected CardFormService $service;

    public function __construct(CardFormService $service)
    {
        $this->service = $service;
    }
    //
    public function index(Request $request, $card): AnonymousResourceCollection
    {
        //
        [$forms,$count] = $this->service->getFormsOfCard($card);

        return CardFormResource::collection($forms)
            ->additional([
                'message' => __('messages.form_retrieved'),
                'unreadCount' => $count
            ]);

    }

    /**
     * @throws AuthorizationException
     */
    public function formsCount(Request $request, $card): JsonResponse
    {
        $this->authorize('update', $card);

        $unreadCount = 0;
        $totalCount = 0;

        if ($card->links && $card->links->isNotEmpty()) {
            foreach ($card->links as $link) {
                $unreadCount += $link->forms()->whereNull('read_at')->count();
                $totalCount += $link->forms()->count();
            }
        }

        return $this->ok("تعداد کل فرم‌ها: {$totalCount} | خوانده‌نشده: {$unreadCount}", [
            'unreadCount' => $unreadCount,
            'totalCount' => $totalCount
        ], 200);
    }

    public function readAll($card): JsonResponse
    {

        $this->service->readAll($card);

        return $this->ok();
    }
}
