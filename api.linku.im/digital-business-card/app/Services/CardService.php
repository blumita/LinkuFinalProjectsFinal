<?php

namespace App\Services;

use App\Enums\UserActivityNotificationType;
use App\Models\Card;
use App\Notifications\UserActivityNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CardService
{
    protected CardQrService $cardQrService;

    public function __construct(CardQrService $cardQrService)
    {
        $this->cardQrService = $cardQrService;
    }

    public function createCardForUser($data, $user): Card
    {
        $isDefault = !$user->cards()->exists();

        return DB::transaction(function () use ($data, $user, $isDefault) {

            $cardData = [
                'card_name' => $data['cardName'],
                'layout_mode' => $data['layout'] ?? 'right',
                'save_contact' => $data['saveContact'] ?? null,
                'is_default' => $isDefault,
            ];

            if (!empty($data['themeColor'])) {
                $cardData['theme_color'] = $data['themeColor'];
            }

            if (!empty($data['iconColor'])) {
                $cardData['icon_color'] = $data['iconColor'];
            }

            if (!empty($data['matchThemeColor'])) {
                $cardData['match_theme_color'] = $data['matchThemeColor'];
            }

            $card = $user->cards()->create($cardData);

            $this->addCardUser($card, $data);

            $userInfo=['user'=>$card->user];

            $user->notify(new UserActivityNotification(UserActivityNotificationType::PROFILE,$userInfo));


            return $card;
        });

    }

    public function addCardUser($card, $data): void
    {

        $card->user()->create([
            'name' => $data['name'] ?? null,
            'location' => $data['location'] ?? null,
            'job' => $data['job'] ?? null,
            'company' => $data['company'] ?? null,
            'bio' => $data['bio'] ?? null
        ]);
    }

    public function incrementViews($card): void
    {
        $today = now()->toDateString();

        $view = $card->views()->firstOrCreate(
            ['view_date' => $today],
            ['views_count' => 0]
        );

        $view->increment('views_count');
    }

    public function getCardViewStats(array $data, Card $card): array
    {
        $card->load('links');

        $dailyCardViews = $this->aggregateViewsByDate(
            $card->views()
                ->whereBetween('view_date', [$data['from'], $data['to']])
                ->orderBy('view_date')
                ->get(['view_date', 'views_count'])
        );

        $dailyLinkClicks = collect();

        $card->links->each(function ($link) use ($data, &$dailyLinkClicks) {
            $views = $link->views()
                ->whereBetween('view_date', [$data['from'], $data['to']])
                ->get(['view_date', 'views_count']);

            $link->update(['clicks' => $views->sum('views_count')]);

            $dailyLinkClicks = $dailyLinkClicks->merge(
                $this->aggregateViewsByDate($views)
            );
        });

        return [
            'views_by_date' => $dailyCardViews->sortKeys(),
            'clicks_by_date' => $dailyLinkClicks->sortKeys(),
        ];
    }

    protected function aggregateViewsByDate(Collection $views): Collection
    {
        return $views->reduce(function ($carry, $view) {
            $date = $view->view_date;
            $carry[$date] = ($carry[$date] ?? 0) + $view->views_count;
            return $carry;
        }, collect());
    }

    public function syncCardData($data, $card): Card
    {

        return DB::transaction(function () use ($data, $card) {

            $card->update([
                'card_name' => $data['cardName'] ?? $card->card_name,
                'slug' => $data['slug'] ?? $card->slug,
                'layout_mode' => $data['layout'] ?? $card->layout_mode,
                'save_contact' => $data['saveContact'] ?? $card->save_contact,
                'theme_color' => $data['themeColor'] ?? $card->theme_color,
                'icon_color' => $data['iconColor'] ?? $card->icon_color,
                'match_theme_color' => $data['matchThemeColor'] ?? $card->match_theme_color,
                'lead_capture_mode' => isset($data['leadCaptureMode']) ? (bool)$data['leadCaptureMode'] : $card->lead_capture_mode,
                'custom_footer_text' => $data['customFooterText'] ?? $card->custom_footer_text,
                'custom_footer_url' => $data['customFooterUrl'] ?? $card->custom_footer_url,
                'show_save_contact' => isset($data['showSaveContact']) ? (bool)$data['showSaveContact'] : ($card->show_save_contact ?? true),
            ]);

            if ($card->user) {
                $card->user->update([
                    'name' => $data['name'] ?? $card->user->name,
                    'location' => $data['location'] ?? $card->user->location,
                    'job' => $data['job'] ?? $card->user->job,
                    'company' => $data['company'] ?? $card->user->company,
                    'bio' => $data['bio'] ?? $card->user->bio,
                ]);
                // بعد از آپدیت، relation رو دوباره load کن تا اطلاعات جدید رو بگیره
                $card->load('user');
            }

            // Handle QR Code settings
            if (isset($data['qrColor']) || isset($data['qrBgColor'])) {
                $qrData = [
                    'color' => $data['qrColor'] ?? $card->qr?->qr_color ?? '#000000',
                    'bgColor' => $data['qrBgColor'] ?? $card->qr?->qr_bg_color ?? '#ffffff',
                    'logoSize' => $card->qr?->qr_logo_size ?? 25,
                    'logoRadius' => $card->qr?->qr_logo_radius ?? 50,
                ];
                $this->cardQrService->storeOrUpdateQrForCard($qrData, $card);
            }

            return $card->fresh(['user', 'qr']);
        });
    }

}
