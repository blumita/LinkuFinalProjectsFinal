<?php

namespace App\Services;

use App\Services\UserReportService;
use Illuminate\Support\Facades\Cache;

class UserActivityMonitorService
{
    /**
     * @param int $userId
     * @param string $action
     * @param array $payload
     * @return void
     */
    public static function monitor(int $userId, string $action, array $payload = []): void
    {
        $risk = 'low';
        $isReportable = false;

        $cacheKey = "user:{$userId}:{$action}";
        $count = Cache::get($cacheKey, 0);
        $count++;
        Cache::put($cacheKey, $count, 30);
        if ($count > 5) {
            $isReportable = true;
            $risk = 'high';
            $action = 'spam';
        }

        if (isset($payload['content'])) {
            $badWords = ['کلمه_بد1', 'کلمه_بد2', 'spam'];
            foreach ($badWords as $word) {
                if (str_contains(strtolower($payload['content']), $word)) {
                    $isReportable = true;
                    $risk = 'medium';
                    $action = 'inappropriate';
                    break;
                }
            }
        }

        if (isset($payload['content'])) {
            $harassmentWords = ['آزار', 'تهدید', 'فحاشی', 'مزاحمت'];
            foreach ($harassmentWords as $word) {
                if (str_contains(strtolower($payload['content']), $word)) {
                    $isReportable = true;
                    $risk = 'high';
                    $action = 'harassment';
                    break;
                }
            }
        }

        if (isset($payload['name'], $payload['email'], $payload['phone'])) {

            $isFake = false;

            if (!filter_var($payload['email'], FILTER_VALIDATE_EMAIL)) {
                $isFake = true;
            }

            if (!preg_match('/^\d{10,15}$/', $payload['phone'])) {
                $isFake = true;
            }

            if (preg_match('/[^آ-یa-zA-Z0-9\s]/u', $payload['name'])) {
                $isFake = true;
            }

            if ($isFake) {
                $isReportable = true;
                $risk = 'medium';
                $action = 'fake';
            }
        }


        if ($isReportable) {
            UserReportService::report(
                $userId, // reporter
                $userId, // target
                $action,
                $payload,
                $risk
            );
        }
    }
}
