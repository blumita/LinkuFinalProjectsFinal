<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SecurityReport extends Model
{
    protected $fillable = [
        'reporter_id','target_user_id','reporter_name','reporter_email',
        'type','status','priority','target_type','target_name','target_url',
        'description','evidence','admin_notes','resolved_at'
    ];

    protected $casts = [
        'evidence' => 'array'
    ];
}
