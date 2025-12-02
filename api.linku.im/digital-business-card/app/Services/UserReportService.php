<?php
namespace App\Services;

use App\Models\SecurityReport;

class UserReportService
{
    public static function report($reporterId, $reportedUserId, $action, $data = [], $risk = 'low')
    {
        return SecurityReport::create([
            'user_id' => $reportedUserId,
            'reporter_id' => $reporterId,
            'action' => $action,
            'data' => is_array($data) ? $data : [],
            'risk_level' => $risk,
            'status' => 'pending',
            'ip' => request()?->ip() ?? 'unknown',
        ]);
    }
}
