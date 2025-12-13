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
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

    /**
     * Check if a slug is available
     */
    public function checkSlug(Request $request): JsonResponse
    {
        $slug = $request->query('slug');
        
        if (!$slug) {
            return $this->ok('', ['available' => false]);
        }
        
        // چک کنیم که slug قبلاً استفاده نشده
        $exists = Card::where('slug', $slug)->exists();
        
        // همچنین چک می‌کنیم که با license_code یا user_name تداخل نداشته باشه
        if (!$exists) {
            $exists = License::where('license_code', $slug)->exists();
        }
        if (!$exists) {
            $exists = User::where('user_name', $slug)->exists();
        }
        
        return $this->ok('', ['available' => !$exists]);
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
     * Set a card as the active profile for the user
     */
    public function setActiveProfile(Request $request, Card $card): JsonResponse
    {
        $user = $request->user();
        
        // Check if the card belongs to the user
        if ($card->user_id !== $user->id) {
            return $this->fail('این کارت متعلق به شما نیست.', 403);
        }
        
        // Set all user's cards to not default
        $user->cards()->update(['is_default' => false]);
        
        // Set selected card as default
        $card->update(['is_default' => true]);
        
        return $this->ok('پروفایل فعال با موفقیت تغییر کرد.', [
            'activeCardId' => $card->id
        ]);
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
        // اول چک می‌کنیم آیا این یک لایسنس غیرفعال است (کارت‌های جدید)
        $license = License::where('license_code', $slug)->first();
        if ($license) {
            // اگر لایسنس card_id داره، یعنی فعال شده
            if ($license->card_id && $license->card) {
                $card = $license->card;
                $card->load(['user', 'links', 'leads', 'leadSetting', 'qr']);
                return $this->ok('کارت یافت شد', new CardResource($card), 200);
            }
            // لایسنس پیدا شد ولی card_id نداره = غیرفعال
            return $this->ok('کارت یافت شد', [
                'isActivated' => false,
                'licenseCode' => $slug,
                'status' => $license->status ?? 'pending',
                'message' => 'این کارت هنوز فعال‌سازی نشده است'
            ], 200);
        }

        // چک Card با slug
        $card = Card::where('slug', $slug)->first();

        // اگر با slug پیدا نشد، با CardVisit چک کنیم
        if (!$card) {
            // جستجو در CardVisit بر اساس قسمتی از qr_link
            // فرمت معمول: https://linku.im/profile/SLUG/MODEL
            $cardVisit = \App\Models\CardVisit::where('qr_link', 'LIKE', '%/profile/' . $slug . '/%')
                ->orWhere('qr_link', 'LIKE', '%/profile/' . $slug)
                ->orWhere('qr_link', 'LIKE', '%/' . $slug . '/%')
                ->orWhere('qr_link', 'LIKE', '%/' . $slug)
                ->first();

            if ($cardVisit) {
                // چک کنیم آیا این CardVisit به یک License فعال وصله
                if ($cardVisit->unit?->license?->card) {
                    $card = $cardVisit->unit->license->card;
                } else {
                    // کارت هنوز فعال نشده - اطلاعات CardVisit رو برگردون
                    return $this->ok('کارت یافت شد', [
                        'isActivated' => false,
                        'cardVisitId' => $cardVisit->id,
                        'ownerName' => $cardVisit->owner_name,
                        'cardType' => $cardVisit->card_type,
                        'qrLink' => $cardVisit->qr_link,
                        'status' => $cardVisit->status ?? 'pending',
                        'message' => 'این کارت هنوز فعال‌سازی نشده است'
                    ], 200);
                }
            }
        }

        // چک با username
        if (!$card) {
            $user = User::where('user_name', $slug)->first();
            if ($user && $user->cards()->exists()) {
                $card = $user->cards()->where('is_default', true)->first();
            }
        }

        if (!$card) {
            return $this->fail('کارت یافت نشد.', 404);
        }

        // اگر کارت پیدا شد ولی پروفایل خالی است (کارت فیزیکی جدید)
        $hasProfile = $card->user_name || $card->bio || $card->job || $card->company;
        if (!$hasProfile && $card->user_id === 1) {
            return $this->ok('کارت یافت شد', [
                'isActivated' => false,
                'cardId' => $card->id,
                'slug' => $card->slug,
                'cardName' => $card->card_name,
                'status' => 'pending',
                'message' => 'این کارت هنوز توسط صاحب آن فعال‌سازی نشده است'
            ], 200);
        }

        return $this->ok('کارت یافت شد', new CardResource($card), 200);
    }

    /**
     * ایجاد کارت خودکار با slug تصادفی (فقط ادمین)
     */
    public function createAuto(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_unit_id' => 'required|integer',
        ], [
            'product_unit_id.required' => 'محصول الزامی است',
        ]);

        try {
            // گرفتن اطلاعات محصول
            $cardProduct = \App\Models\CardProduct::find($validated['product_unit_id']);
            if (!$cardProduct) {
                return response()->json([
                    'success' => false,
                    'message' => 'محصول یافت نشد'
                ], 404);
            }

            // استفاده از identifier (مثل MD, SD) - اگر code خالی بود از identifier استفاده کن
            $productCode = $cardProduct->identifier ?? $cardProduct->code ?? 'CARD';
            $productName = $cardProduct->name;

            // تولید slug تصادفی یکتا - چک در Card و License
            do {
                $slug = strtolower(\Illuminate\Support\Str::random(8));
            } while (Card::where('slug', $slug)->exists() || \App\Models\License::where('license_code', $slug)->exists());

            // ایجاد ProductUnit جدید
            $productUnit = \App\Models\ProductUnit::create([
                'serial_number' => 'AUTO-' . $slug,
                'card_product_id' => $cardProduct->id,
            ]);

            // ایجاد License برای این ProductUnit (مهم برای سیستم فعال‌سازی)
            // card_id خالی می‌مونه تا کاربر خودش فعال کنه
            $license = \App\Models\License::create([
                'product_unit_id' => $productUnit->id,
                'license_code' => $slug,
                'status' => 'active',
                'card_id' => null, // کاربر باید فعال کنه
                'expires_at' => null,
            ]);

            // ایجاد CardVisit
            $cardUrl = 'https://linku.im/profile/' . $slug . '/' . $productCode;
            $cardVisit = \App\Models\CardVisit::create([
                'qr_link' => $cardUrl,
                'owner_name' => $productName,
                'status' => 'active',
                'mobile' => '',
                'card_type' => $cardProduct->id,
                'product_unit_id' => $productUnit->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'لایسنس با موفقیت ایجاد شد.',
                'data' => [
                    'license_code' => $license->license_code,
                    'qr_link' => $cardUrl,
                    'product' => $productName,
                    'cardVisitId' => $cardVisit->id,
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Auto card creation error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'خطا در ایجاد کارت: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ایجاد کارت دستی برای لایسنس‌های چاپ شده (فقط ادمین)
     */
    public function createManual(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z0-9-_]+$/'],
            'product_unit_id' => 'required|integer',
        ], [
            'slug.required' => 'شناسه لایسنس الزامی است',
            'slug.regex' => 'شناسه فقط باید شامل حروف انگلیسی، اعداد، خط تیره و آندرلاین باشد',
            'product_unit_id.required' => 'محصول الزامی است',
        ]);

        // چک تکراری نبودن در Card و License
        $existsInCard = Card::where('slug', $validated['slug'])->exists();
        $existsInLicense = \App\Models\License::where('license_code', $validated['slug'])->exists();
        if ($existsInCard || $existsInLicense) {
            return response()->json([
                'success' => false,
                'message' => 'این لایسنس قبلاً ثبت شده است'
            ], 422);
        }

        try {
            // گرفتن اطلاعات محصول - از CardProduct استفاده می‌کنیم چون ادمین داشبورد CardProduct انتخاب می‌کنه
            $cardProduct = \App\Models\CardProduct::find($validated['product_unit_id']);
            if (!$cardProduct) {
                return response()->json([
                    'success' => false,
                    'message' => 'محصول یافت نشد'
                ], 404);
            }

            // استفاده از identifier (مثل MD, SD) - اگر code خالی بود از identifier استفاده کن
            $productCode = $cardProduct->identifier ?? $cardProduct->code ?? 'CARD';
            $productName = $cardProduct->name; // نام محصول برای card_name

            // ایجاد یک ProductUnit جدید برای این کارت دستی
            $productUnit = \App\Models\ProductUnit::create([
                'serial_number' => 'MANUAL-' . $validated['slug'],
                'card_product_id' => $cardProduct->id,
            ]);

            // ایجاد License برای این ProductUnit (مهم برای سیستم فعال‌سازی)
            // card_id خالی می‌مونه تا کاربر خودش فعال کنه
            $license = \App\Models\License::create([
                'product_unit_id' => $productUnit->id,
                'license_code' => $validated['slug'], // از slug به عنوان کد لایسنس استفاده می‌کنیم
                'status' => 'active',
                'card_id' => null, // کاربر باید فعال کنه
                'expires_at' => null,
            ]);

            // ایجاد CardVisit برای نمایش در لیست ادمین با فرمت صحیح
            $cardUrl = 'https://linku.im/profile/' . $validated['slug'] . '/' . $productCode;
            $cardVisit = \App\Models\CardVisit::create([
                'qr_link' => $cardUrl,
                'owner_name' => $productName, // نام محصول
                'status' => 'active',
                'mobile' => '',
                'card_type' => $cardProduct->id,
                'product_unit_id' => $productUnit->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'لایسنس با موفقیت ایجاد شد.',
                'data' => [
                    'license_code' => $license->license_code,
                    'qr_link' => $cardUrl,
                    'product' => $productName,
                    'cardVisitId' => $cardVisit->id,
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Manual card creation error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'خطا در ایجاد لایسنس: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * بررسی وجود لایسنس (برای چک تکراری نبودن)
     */
    public function checkLicenseExists(string $slug): JsonResponse
    {
        // بررسی فرمت slug
        if (!preg_match('/^[a-zA-Z0-9-_]+$/', $slug)) {
            return response()->json([
                'success' => false,
                'exists' => false,
                'message' => 'فرمت لایسنس نامعتبر است'
            ], 400);
        }

        // چک کردن در Card و License
        $existsInCard = Card::where('slug', $slug)->exists();
        $existsInLicense = \App\Models\License::where('license_code', $slug)->exists();
        $exists = $existsInCard || $existsInLicense;

        return response()->json([
            'success' => true,
            'exists' => $exists,
            'message' => $exists ? 'این لایسنس قبلاً ثبت شده است' : 'این لایسنس قابل استفاده است'
        ]);
    }
}
