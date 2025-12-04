<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Resources\Json\JsonResource;

class DiscountResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'title' => $this->title,
            'description' => $this->description,
            'banner' => $this->banner ? asset('storage/' . $this->banner) : null,
            'icon' => $this->icon ? asset('storage/' . $this->icon) : null,
            'type' => $this->type,
            'value' => $this->value,
            'maxUsage' => $this->max_usage,
            'usedCount' => $this->used_count,
            'expiryDate' => optional($this->expiry_date)?->format('Y-m-d'),
            'active' => $this->is_active,
            'createdAt' =>  $this->created_at->format('Y-m-d'),
            'updatedAt'=>$this->updated_at->format('Y-m-d'),
        ];
    }
}
