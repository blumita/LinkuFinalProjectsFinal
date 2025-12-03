<?php

namespace App\Http\Controllers\v1;

use App\Http\Resources\v1\CardProductResource;
use App\Http\Resources\v1\LicenseResource;
use App\Models\Card;
use App\Models\CardProduct;
use App\Models\License;
use App\Models\ProductUnit;
use App\Services\CardVisitService;
use Carbon\Carbon;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Controller responsible for managing license operations,
 * including activation, generation, and device tracking.
 */
class LicenseController extends Controller
{
    use AuthorizesRequests;

    protected CardVisitService $visitService;

    public function __construct(CardVisitService $visitService)
    {

        $this->visitService = $visitService;
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'کاربر احراز هویت نشده است'
            ], 401);
        }
        
        $userId = $user->id;

        $licenses = License::with(['card.creator'])
            ->whereNotNull('card_id')
            ->whereHas('card', fn($q) => $q->where('user_id', $userId))
            ->get();

        return response()->json([
            'success' => true,
            'message' => __('license.devices_list_retrieved'),
            'data' => LicenseResource::collection($licenses)
        ]);
    }

    public function generateLicense(Request $request, CardProduct $cardProduct): JsonResponse
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'کاربر احراز هویت نشده است'
            ], 401);
        }

        try {
            $quantity = $request->input('count');

            $count = $quantity ? intval($quantity) : 1;

            $licenses = [];

            for ($i = 1; $i <= $count; $i++) {

                $raw = $cardProduct->id . '-' . now()->timestamp . '-' . $i;

                $hashedSerial = strtoupper(substr(base_convert(md5($raw),
                    16, 36), 0, 8));

                $serial = strtoupper($cardProduct->identifier) // TIT
                    . '-' . $hashedSerial                     // 6 کاراکتر هش
                    . '-' . now()->format('Ymd')              // تاریخ
                    . '-' . strtoupper(Str::random(4));


                $unit = ProductUnit::create([
                    'card_product_id' => $cardProduct->id,
                    'serial_number' => $serial,
                ]);


                $license = $this->createLicense($cardProduct->identifier, $i, $unit->id);
                $licenses[] = $license;

                // ایجاد کارت برای تک کارت و bulk
                $data = [
                    'cardType' => $cardProduct->id,
                    'mobile' => '',
                    'ownerName' => $serial, // استفاده از serial_number واقعی
                    'qrLink' => env('CARD_URL') . '/profile/'. $license->license_code . '/' . $cardProduct->identifier,
                    'status' => $request['status'] ?? 'active',
                    'product_unit_id'=>$unit->id
                ];

                $this->visitService->saveCardVisit($data);
            }

            return response()->json([
                'success' => true,
                'message' => __('license.created'),
                'license' => $count === 1 ? $licenses[0] : $licenses
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => __('errors.unexpected_error'),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function createLicense(string $cardType, int $serialNumber, int $unitId)
    {
        do {
            $raw = $cardType . '-' . $serialNumber . '-' . now()->timestamp;

            $hash = md5($raw);
            $base36 = strtolower(substr(base_convert(
                $hash,
                16,
                36),
                0,
                8));

            $code = preg_replace('/[^a-z0-9]/', '', $base36);

        } while (License::where('license_code', $code)->exists());

        return License::create([
            'product_unit_id' => $unitId,
            'license_code' => $code,
            'status' => 'active',
            'expires_at' => null
        ]);
    }

    public function activateDevice(Request $request, Card $card): JsonResponse
    {
        $data = $request->validate([
            'code' => 'required|string',
        ]);

        try {
            // Validate license code
            $license = License::where('license_code', $data['code'])
                ->where('status', 'active')
                ->first();


            if (!$license) {
                return response()->json([
                    'success' => false,
                    'message' => __('license.invalid_or_expired'),
                ], 422);
            }

            if ($license->card_id) {
                return response()->json([
                    'success' => false,
                    'message' => __('license.already_used'),
                ], 409);
            }

            // Activate license
            $license->update([
                'card_id' => $card->id,
                'status' => 'active',
            ]);

            return response()->json([
                'success' => true,
                'message' => __('license.activated'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => __('errors.unexpected_error'),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @throws AuthorizationException
     */
    public function deactivateDevice(Card $card): JsonResponse
    {
        $this->authorize('update', $card);

        try {
            $license = License::where('card_id', $card->id)->first();

            if (!$license) {
                return response()->json([
                    'success' => false,
                    'message' => __('license.invalid_or_expired'),
                ], 422);
            }

            // DeActivate card
            $license->update([
                'card_id' =>null,
            ]);

            return response()->json([
                'success' => true,
                'message' => __('license.deactivated'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => __('errors.unexpected_error'),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function activeDevices(Request $request): JsonResponse
    {
        $user = $request->user();
        $cards = $user->cards()->with(['licenses.unit.product.files'])->get();
        $results = [];

        foreach ($cards as $card) {
            foreach ($card->licenses as $license) {
                $product = $license->unit->product ?? null;
                if ($product) {

                    if (!collect($results)->pluck('product.id')->contains($product->id)) {
                        $results[] = [
                            'card_id'=>$card->id,
                            'license' => $license->license_code,
                            'updated_at'=>$license->updated_at,
                            'device' => [
                                'name' => $product->name,
                                'image' => media_path($product->files->path)?? '/devices/default.png'
                            ]
                        ];
                    }
                }
            }
        }
        return response()->json([
            'success' => true,
            'data' => $results
        ]);

    }
}
