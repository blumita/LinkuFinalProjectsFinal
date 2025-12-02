<?php

namespace App\Http\Controllers\v1;

use App\Http\Requests\v1\CardQrRequest;
use App\Http\Resources\v1\CardQrResource;
use App\Models\CardQr;
use App\Services\CardQrService;
use App\Traits\HasApiResponses;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CardQrController extends Controller
{
    use HasApiResponses, AuthorizesRequests;

    protected CardQrService $service;

    public function __construct(CardQrService $service)
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
    public function store(CardQrRequest $request, $card): JsonResponse
    {
        $this->authorize('update', $card);

        //
        $qr = $this->service->storeOrUpdateQrForCard($request->validated(), $card);

        return $this->ok(__('messages.qr_updated'),
            new CardQrResource($qr), 200);
    }

    /**
     * Update the specified resource in storage.
     * @throws AuthorizationException
     */
    public function update(CardQrRequest $request, $card, CardQr $cardQr): JsonResponse
    {
        //
        $this->authorize('update', $card);

        //
        $qr = $this->service->storeOrUpdateQrForCard($request->validated(), $card);

        return $this->ok(__('messages.qr_updated'),
            new CardQrResource($qr), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CardQr $cardQr)
    {
        //
    }
}
