<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    //
    protected $fillable = [
        'reporter_name', 'reporter_email', 'reporter_id',
        'target_type', 'target_id', 'target_url', 'target_name',
        'type', 'description', 'status', 'admin_notes'
    ];
}
