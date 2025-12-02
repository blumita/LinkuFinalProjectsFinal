<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LicenseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isActive = $this->expires_at && now()->lessThan($this->expires_at);

        return [
            'id' => $this->card->id,
            'license' => $this->code,
            'expires_at' => $this->expires_at,
            'updated_at' => $this->updated_at,
            'card_id' => $this->card_id,
            'mobile' => optional($this->card->creator)->phone,
            'device' => $this->device,
            'ownerName' => optional($this->card->user)->name,
            'description' => optional($this->card)->description,
            'image' => media_path(optional($this->card->avatar)->path ?? ''),
            'qrLink' => url($this->code .'/'. $this->device['id']),
            'status' => $isActive ? 'active' : 'inactive',
        ];
    }
}
