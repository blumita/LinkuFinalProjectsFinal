<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SecurityReportResource extends JsonResource
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
            'reporterId' => $this->reporter_id,
            'targetUserId' => $this->target_user_id,
            'reporterName' => $this->reporter_name,
            'reporterEmail' => $this->reporter_email,
            'type' => $this->type,
            'status' => $this->status,
            'priority' => $this->priority,
            'targetType' => $this->target_type,
            'targetName' => $this->target_name,
            'targetUrl' => $this->target_url,
            'description' => $this->description,
            'evidence' => $this->evidence ?? [],
            'adminNotes' => $this->admin_notes,
            'resolvedAt' => optional($this->resolved_at)->format('Y-m-d'),
            'createdAt' => $this->created_at->format('Y-m-d'),
            'updatedAt' => $this->updated_at->format('Y-m-d'),
        ];
    }
}
