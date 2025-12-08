<?php

namespace App\Http\Controllers\v1;

use App\Http\Requests\v1\CardRequest;
use App\Http\Requests\v1\CardUpdateRequest;
use App\Http\Requests\v1\ViewRequest;
use App\Http\Resources\v1\CardResource;
use App\Http\Resources\v1\ViewCardResource;
use App\Models\Card;
use App\Models\License;
use App\Models\User;
use App\Services\CardService;
use App\Services\UserService;
use App\Traits\HasApiResponses;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CardController extends Controller
{
    use HasApiResponses, AuthorizesRequests;

    protected CardService $cardService;
    protected UserService $userService;

    public function __construct(CardService $cardService, UserService $userService)
    {
        $this->cardService = $cardService;
        $this->userService = $userService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'کاربر احراز هویت نشده است'
            ], 401);
        }
        
        if ($user->role === 'admin') {
            // Admin can see all business cards
            $cards = Card::all();
        } else {
            // Regular users can only see their own cards
            $cards = $user->cards;
        }

        $cards->load([
            'user',
            'links',
            'leads',
            'leadSetting',
            'qr',
        ]);

        $data = CardResource::collection($cards);

        return $this->ok(__('messages.cards_fetched'), $data, 200);
    }

    public function show(Card $card): JsonResponse
    {

        $card->load([
            'user',
            'links',
            'leads',
            'leadSetting',
            'qr',
        ]);

        $data = new CardResource($card);

        return $this->ok(__('messages.card_fetched'), $data, 200);
    }

    public function hasBlueTick($slug): JsonResponse
    {
        $card = Card::where('slug', $slug)->first();


        if (!$card) {
            $license = License::where('license_code', $slug)->first();
            if ($license && $license->card) {
                $card = $license->card;
            }
        }


        if (!$card) {
            $user = User::where('user_name', $slug)->first();
            if ($user && $user->cards()->exists()) {
                $card = $user->cards()->where('is_default', true)->first();
            }
        }

        if (!$card) {
            return $this->fail('کارت یافت نشد.', 404);
        }

        return $this->ok('', $card->is_default && optional($card->creator)->is_pro);

    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(CardRequest $request): JsonResponse
    {
        $user = $request->user();

        // Count how many cards the user already has
        $cardCount = $user->cards()->count();

        // Check card creation limits based on user type
        if ($user->is_pro) {
            // Pro users can create up to 5 cards
            if ($cardCount >= 5) {
                return $this->fail(__('messages.not-allowed_pro'), 403);
            }
        } else {
            // Free users can only create 1 card
            if ($cardCount > 0) {
                return $this->fail(__('messages.not-allowed_free'), 403);
            }
        }

        // Create the card using the service layer
        $card = $this->cardService->createCardForUser($request->validated(), $user);

        // Return success response
        return $this->ok(
            __('messages.card_created'),
            new CardResource($card), 200);
    }

    /**
     * @throws ValidationException
     */
    public function createDefaultCard(Request $request): JsonResponse
    {

        $user = $request->user();

        $card = $this->userService->createDefaultProfile($user);

        return $this->ok('__.messages.create_default_card', new CardResource($card), 200);


    }

    /**
     * Update the specified resource in storage.
     * @throws AuthorizationException
     */
    public function update(CardUpdateRequest $request, Card $card): JsonResponse
    {
        //
        $this->authorize('update', $card);

        $syncedCard = $this->cardService
            ->syncCardData($request->validated(), $card);

        return $this->ok(__('messages.card_updated'),
            new CardResource($syncedCard), 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Card $card)
    {
        //
    }

    /**
     * Toggle card active status
     */
    public function toggleActive(Request $request, Card $card): JsonResponse
    {
        $this->authorize('update', $card);
        
        $card->is_active = !$card->is_active;
        $card->save();
        
        $message = $card->is_active 
            ? __('messages.card_activated') 
            : __('messages.card_deactivated');
        
        return $this->ok($message, new CardResource($card), 200);
    }

    //---------------------------------- CardViews -----------------------------
    //--------------------------------------------------------------------------
    public function recordView(Request $request, $slug): JsonResponse
    {
        $card = Card::where('slug', $slug)->first();


        if (!$card) {
            $license = License::where('license_code', $slug)->first();
            if ($license && $license->card) {
                $card = $license->card;
            }
        }


        if (!$card) {
            $user = User::where('user_name', $slug)->first();
            if ($user && $user->cards()->exists()) {
                $card = $user->cards()->where('is_default', true)->first();
            }
        }

        if (!$card) {
            return $this->fail('کارت یافت نشد.', 404);
        }

        $this->cardService->incrementViews($card);

        $latestView = $card->views()->latest()->first();

        return $this->ok(__('messages.cards_increase_views'),
            $latestView?->views_count ?? 0, 200);

    }

    /**
     * @throws AuthorizationException
     */
    public function getViews(ViewRequest $request, $card): JsonResponse
    {
        $this->authorize('update', $card);

        $result = $this->cardService->getCardViewStats($request->validated(), $card);

        return $this->ok(__('messages.cards_views'), [
            'card' => new ViewCardResource($card),
            'views_by_date' => $result['views_by_date'],
            'clicks_by_date' => $result['clicks_by_date'],
        ], 200);


    }

    public function preview(Request $request, $slug): JsonResponse
    {


        $card = Card::where('slug', $slug)->first();
        $license = null;
        $cardVisit = null;

        if (!$card) {
            $license = License::where('license_code', $slug)->first();
            if ($license && $license->card) {
                $card = $license->card;
            }
        }
        
        // اگر با لایسنس پیدا نشد، با CardVisit چک کنیم
        if (!$card) {
            // جستجو در CardVisit بر اساس قسمتی از qr_link
            $cardVisit = \App\Models\CardVisit::where('qr_link', 'LIKE', '%/' . $slug . '/%')->first();
            
            // اگر CardVisit پیدا شد ولی card_id ندارد یا کارت متصل نیست
            if ($cardVisit && !$cardVisit->unit?->license?->card) {
                // کارت هنوز فعال نشده
                return $this->ok('کارت یافت شد', [
                    'isActivated' => false,
                    'cardVisitId' => $cardVisit->id,
                    'ownerName' => $cardVisit->owner_name,
                    'cardType' => $cardVisit->card_type,
                    'status' => $cardVisit->status,
                ], 200);
            }
        }


        if (!$card) {
            $user = User::where('user_name', $slug)->first();
            if ($user && $user->cards()->exists()) {
                $card = $user->cards()->where('is_default', true)->first();
            }
        }

        if (!$card) {
            // بررسی نهایی اگر این یک لایسنس غیرفعال است
            $inactiveLicense = License::where('license_code', $slug)->first();
            if ($inactiveLicense && !$inactiveLicense->card_id) {
                return $this->ok('کارت یافت شد', [
                    'isActivated' => false,
                    'licenseCode' => $slug,
                    'status' => $inactiveLicense->status ?? 'inactive',
                ], 200);
            }
            
            return $this->fail('کارت یافت نشد.', 404);
        }

        return $this->ok('کارت یافت شد', new CardResource($card), 200);
    }
}
