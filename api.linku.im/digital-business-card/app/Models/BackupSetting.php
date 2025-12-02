<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BackupSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'auto_backup_enabled',
        'backup_frequency',
        'backup_time',
        'backup_day',
        'backup_destinations',
        'github_repo',
        'github_token',
        'github_branch',
        'github_is_private',
        'sftp_enabled',
        'sftp_host',
        'sftp_username',
        'sftp_password',
        'sftp_path',
        'retention_days',
    ];

    protected $casts = [
        'auto_backup_enabled' => 'boolean',
        'backup_destinations' => 'array',
        'github_is_private' => 'boolean',
        'sftp_enabled' => 'boolean',
        'retention_days' => 'integer',
        'backup_day' => 'integer',
    ];

    // توکن‌ها را مخفی نمی‌کنیم چون برای نمایش در ادمین لازم است
    // protected $hidden = [
    //     'github_token',
    //     'sftp_password',
    // ];
}
