<?php

namespace App\Http\Controllers\v1;

use App\Http\Requests\v1\CardLeadRequest;
use App\Http\Resources\v1\CardLeadResource;
use App\Models\CardLead;
use App\Services\CardLeadService;
use App\Traits\HasApiResponses;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CardLeadController extends Controller
{
    use AuthorizesRequests, HasApiResponses;

    protected CardLeadService $service;

    public function __construct(CardLeadService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $card): AnonymousResourceCollection
    {
        //
        [$leads,$count] = $this->service->getLeadsOfCard($card);

        return CardLeadResource::collection($leads)
            ->additional([
                'message' => __('messages.lead_retrieved'),
                'unreadCount' => $count
            ]);

    }

    /**
     * @throws AuthorizationException
     */
    public function leadsCount(Request $request, $card): JsonResponse
    {
        $this->authorize('update', $card);

        $unreadCount = $card->leads()->whereNull('read_at')->count();
        $totalCount = $card->leads()->count();

        return $this->ok("تعداد کل لیدها: {$totalCount} | خوانده‌نشده: {$unreadCount}", [
            'unreadCount' => $unreadCount,
            'totalCount' => $totalCount
        ], 200);
    }

    public function readAll($card): JsonResponse
    {

       $this->service->readAll($card);

        return $this->ok();
    }

    /**
     * Store a newly created resource in storage.
     * @throws AuthorizationException
     */
    public function storeLeadDefault(CardLeadRequest $request, $card): JsonResponse
    {
        //
        $this->authorize('update', $card);

        //$fieldLabels = json_decode($request->input('field_labels', '{}'), true);

        $fieldLabels = $request['fieldLabels'] ?? [];

        $lead = $this->service->addLeadToCard(
            $request->all(),
            $card,
            $fieldLabels);

        return $this->ok(__("messages.lead_created"), new CardLeadResource($lead), 200);
    }

    public function storeLead(CardLeadRequest $request, $card): JsonResponse
    {

        $fieldLabels = $request['fieldLabels'] ?? [];

        $lead = $this->service->addLeadToCard(
            $request->all(),
            $card,
            $fieldLabels);

        return $this->ok(__("messages.lead_created"), new CardLeadResource($lead), 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CardLead $cardLead)
    {
        //

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CardLead $cardLead)
    {
        //
    }
}
