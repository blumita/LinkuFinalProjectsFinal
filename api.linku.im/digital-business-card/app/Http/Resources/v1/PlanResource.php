<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'duration' => $this->duration,
            'price' => $this->price,
            'discount' => $this->discount,
            'description' => $this->description,
            'features' => $this->features,
            'active' => $this->active,
            'popularity' => $this->popularity,
        ];
    }
}
