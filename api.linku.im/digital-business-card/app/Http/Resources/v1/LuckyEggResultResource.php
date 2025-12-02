<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LuckyEggResultResource extends JsonResource
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
            'phone' => $this->phone,
            'result' => $this->result,
            'lottery_code' => $this->lottery_code,
            'ip_address' => $this->ip_address,
            'country' => $this->country,
            'card_link_id' => $this->card_link_id,
            'lucky_egg_id' => $this->lucky_egg_id,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'read_at' => $this->read_at?->format('Y-m-d H:i:s'),
        ];
    }
}
