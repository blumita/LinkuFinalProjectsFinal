<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'message',
        'type',
        'action_link',
        'recipient_ids',
        'sent_count',
        'delivered_count',
        'clicked_count',
        'scheduled_for',
        'is_sent',
    ];

    protected $casts = [
        'recipient_ids' => 'array',
        'scheduled_for' => 'datetime',
        'is_sent' => 'boolean',
    ];

    public function scopePending($query)
    {
        return $query->where('is_sent', false)
            ->whereNotNull('scheduled_for')
            ->where('scheduled_for', '<=', now());
    }

    public function scopeSent($query)
    {
        return $query->where('is_sent', true);
    }

    public function scopeScheduled($query)
    {
        return $query->where('is_sent', false)
            ->whereNotNull('scheduled_for')
            ->where('scheduled_for', '>', now());
    }
}
