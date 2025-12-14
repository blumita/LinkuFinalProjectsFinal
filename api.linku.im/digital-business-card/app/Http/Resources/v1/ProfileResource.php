<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $defaultCard = $this->cards->firstWhere('is_default', true);

        $userLinks = $defaultCard && isset($defaultCard->links)
            ? $defaultCard->links
                ->filter(function ($link) {
                    $data = json_decode($link->data, true);
                    return isset($data['type']) && $data['type'] === 'link';
                })
                ->map(function ($link) {
                    $data = json_decode($link->data, true);
                    return [
                        'id' => $link->id,
                        'title' => $data['title']??'',
                        'url' => $data['value'] ?? null,
                        'isActive' => (bool)$link->enabled,
                        'clicks' => $link->clicks ?? 0,
                        'createdAt' => $link->created_at->format('Y-m-d'),
                    ];
                })
                ->values()
                ->toArray()
            : [];

        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->user_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'subscriptionType' => $this->is_pro ? 'premium' : 'free',
            'profileUrl' => env('CARD_URL') . '/' . $this->user_name,
            'linkCount' => optional($defaultCard?->links)->count() ?? 0,
            'cardLinks' => $userLinks,
            'cards'=>CardResource::collection($this->cards),
            'cardCount' => $this->cards->count(),
            'subscriptionMonths' => null,
            'subscriptionEndDate' => null,
            'status' => $this->status,
            'createdAt' => $this->created_at->format('Y-m-d'),
            //'lastLogin' =>$this->last_login->format('Y-m-d'),
            'updatedAt' => $this->updated_at->format('Y-m-d'),
        ];
    }
}
