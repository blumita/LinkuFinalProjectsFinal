<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CardUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'name'=>$this->name,
            'location'=>$this->job,
            'company'=>$this->company,
            'bio'=>$this->bio,
            'creatorId'=>$this->creator_id,
            'avatar'=>media_path(Optional($this->avatar->path)),
            'createdAt'=>$this->created_at,
            'updatedAt'=>$this->updated_at

        ];
    }
}
