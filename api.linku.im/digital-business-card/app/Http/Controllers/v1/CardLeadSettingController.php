<?php

namespace App\Http\Controllers\v1;

use App\Http\Requests\v1\CardLeadSettingRequest;
use App\Http\Requests\v1\CardLeadSettingUpdateRequest;
use App\Models\CardLeadSetting;
use App\Services\CardLeadSettingService;
use App\Traits\HasApiResponses;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CardLeadSettingController extends Controller
{
    use AuthorizesRequests, HasApiResponses;

    public CardLeadSettingService $service;

    public function __construct(CardLeadSettingService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     * @throws AuthorizationException
     */
    public function store(CardLeadSettingRequest $request, $card): JsonResponse
    {
        $this->authorize('update', $card);
        //
        $leadSetting = $this->service
            ->storeLeadSettingsForCard($request->validated(), $card);

        return $this->ok(__('messages.lead_setting_updated'),
            $leadSetting, 200);
    }

    /**
     * Store a newly created resource in storage.
     * @throws AuthorizationException
     * @throws Exception
     */
    public function update(CardLeadSettingUpdateRequest $request, $card): JsonResponse
    {
        $this->authorize('update', $card);
        //
        $leadSetting = $this->service
            ->updateLeadSettingsForCard($request->validated(), $card);

        return $this->ok(__('messages.lead_setting_updated'),
            $leadSetting, 200);
    }
}
