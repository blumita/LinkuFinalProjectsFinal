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
        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->user_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'subscriptionType' => $this->is_pro ? 'premium' : 'free',
            'profileUrl' => env('CARD_URL') . '/' . $this->user_name,
            'cardCount' => $this->cards_count ?? 0,
            'linkCount' => 0,
            'status' => $this->status,
            'createdAt' => $this->created_at ? $this->created_at->format('Y-m-d') : null,
            'updatedAt' => $this->updated_at ? $this->updated_at->format('Y-m-d') : null,
        ];
    }
}
