<?php

namespace App\Http\Controllers\v1;

use App\Http\Resources\v1\LuckyWheelResource;
use App\Http\Resources\v1\LuckyWheelResultResource;
use App\Models\LuckyWheelResult;
use App\Models\LuckyWheelReward;
use App\Traits\HasApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LuckyWheelController
{
    use HasApiResponses;

    public function resultCount($card): JsonResponse
    {
        $luckyWheelLinks = $card->links->filter(function ($link) {
            return $link->luckyWheel()->exists();
        });

        $luckyWheels = $luckyWheelLinks->map(function ($link) {
            return $link->luckyWheel;
        })->filter();

        // نتایج خوانده‌نشده
        $unreadWheelResults = $luckyWheels->flatMap(function ($wheel) {
            return $wheel->results()->whereNull('read_at')->get();
        });

        // پر کردن read_at
        $now = now();
        $unreadWheelResults->each(function ($result) use ($now) {
            $result->update(['read_at' => $now]);
        });

        $unreadCount = $unreadWheelResults->count();

        // مجموع کل نتایج
        $totalCount = $luckyWheels->flatMap(function ($wheel) {
            return $wheel->results()->get();
        })->count();

        return $this->ok("تعداد کل شرکت‌کننده‌ها: {$totalCount} | خوانده‌نشده: {$unreadCount}", [
            'unreadCount' => $unreadCount,
            'totalCount' => $totalCount
        ], 200);
    }

    public function allResults($card): JsonResponse
    {
        $luckyWheelLinks = $card->links->filter(function ($link) {
            return $link->luckyWheel()->exists();
        });

        $luckyWheels = $luckyWheelLinks->map(function ($link) {
            return $link->luckyWheel;
        })->filter();

        $allResults = $luckyWheels->flatMap(function ($wheel) {
            return $wheel->results()->get();
        });

        return $this->ok("لیست کامل نتایج چرخ شانس", LuckyWheelResultResource::collection($allResults), 200);
    }
    public function readAll($card): JsonResponse
    {
        $luckyWheelLinks = $card->links->filter(function ($link) {
            return $link->luckyWheel()->exists();
        });

        $luckyWheels = $luckyWheelLinks->map(function ($link) {
            return $link->luckyWheel;
        })->filter();

        $now = now();

        $luckyWheels->each(function ($wheel) use ($now) {
            $wheel->results()->whereNull('read_at')->update(['read_at' => $now]);
        });

        return $this->ok('همه نتایج خوانده‌نشده به‌روزرسانی شدند.');
    }
    public function check(Request $request, $link): JsonResponse
    {

        $userId = auth()->id();
        $ip = $request->ip();

        $luckyWheel = $link->luckyWheel()->latest()->first();

        if (!$luckyWheel) {
            return $this->fail('بازی گردونه شانس برای این لینک تعریف نشده است', [], 404);
        }
        $alreadyLuckyWheelResult = LuckyWheelResult::where('lucky_wheel_id', $luckyWheel->id)
            ->where(function ($query) use ($userId, $ip) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('ip_address', $ip);
                }
            })->exists();

        if ($alreadyLuckyWheelResult) {
            return $this->fail('شما قبلاً بازی کرده‌اید',null,403);
        }

        return $this->ok('شما مجاز به شرکت در بازی هستید',null, 200);

    }
    public function result(Request $request, $link): JsonResponse
    {
        $request->validate([
            'phone' => 'nullable|string|max:20',
            'result' => 'required|string',
        ]);

        $ip = $request->ip();
        $country = geoip($ip)->country ?? '';

        $luckyWheel = $link->luckyWheel()->latest()->first();

        if (!$luckyWheel) {
            return $this->fail('بازی چرخ شانس برای این لینک تعریف نشده است', [], 404);
        }

        $prizeText = 'متاسفانه اینبار برنده نشدی!';
        if ($request['result']!=='پوچ') {
            $prize = $luckyWheel->prizes()->inRandomOrder()->first();
            if ($prize) {
                $prizeText = $prize->text;

                // ذخیره جایزه در جدول rewards
                LuckyWheelReward::create([
                    'lucky_wheel_id' => $luckyWheel->id,
                    'phone' => $request->phone,
                    'reward_type' => 'text',
                    'reward_value' => $prizeText,
                ]);
            }
        }

        $wheelResult = $luckyWheel->results()->create([
            'card_link_id' => $link->id,
            'phone' => $request->phone,
            'result' => $prizeText,
            'ip_address' => $ip,
            'country' => $country,
        ]);

        return $this->ok('نتیجه ذخیره شد', [
            'result' => new LuckyWheelResultResource($wheelResult),
            'reward' => $request['result'] ? [
                'type' => 'text',
                'value' => $prizeText,
            ] : null,
        ]);
    }

}
