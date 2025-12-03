<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $fullName = trim(($this->first_name ?? '') . ' ' . ($this->last_name ?? ''));
        if (empty($fullName)) {
            $fullName = $this->name;
        }
        
        return [
            'id' => $this->id,
            'name' => $this->name,
            'fullName' => $fullName,
            'firstName'=>$this->first_name,
            'lastName'=>$this->last_name,
            'status'=>$this->status,
            'username' => $this->user_name,
            'isPro' => (bool) $this->is_pro,
            'email' => $this->email,
            'phone'=>$this->phone,
            'countryCode'=>$this->country_code,
            'emailVerified' => (bool) $this->email_verified,
            'role' => $this->role,
            'roleId' => $this->role_id,
            'referralCode' => $this->referral_code,
            'removeBranding' => $this->remove_branding,
            'referredBy' => $this->referred_by,
            'location' => $this->location,
            'avatar' => media_path(optional($this->avatar)->path),
            'cardsDataList' => CardResource::collection($this->cards),
            'createdAt' => $this->created_at->format('Y-m-d'),
            'updatedAt' => $this->updated_at,
        ];
    }
}
