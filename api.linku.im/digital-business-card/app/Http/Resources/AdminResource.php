<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminResource extends JsonResource
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
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'fullName' => $this->name,
            'username' => $this->user_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'countryCode' => $this->country_code,
            'status' => $this->status,
            'roleId' => $this->role_id,
            'role' => 'admin', // برای frontend که چک می‌کند role === 'admin'
            'roleDetails' => $this->role ? [
                'id' => $this->role->id,
                'name' => $this->role->name,
                'displayName' => $this->role->display_name,
            ] : null,
            'createdAt' => $this->created_at->format('Y-m-d H:i:s'),
            'updatedAt' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
