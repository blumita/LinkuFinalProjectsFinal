<?php

namespace App\Http\Middleware;

use App\Models\SecurityReport;
use Closure;
use Illuminate\Http\Request;

class LogUserActivity
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $user = $request->user();
        if (!$user) return $response;

        $type = null;
        $priority = 'medium';
        $description = null;
        $targetName='';
        foreach ($request->all() as $key => $value) {
            if (!is_string($value)) continue;

            if ($this->isSpam($value)) {
                $type = 'spam';
                $targetName='پروفایل مشکوک';
                $priority = 'high';
                $description = "محتوای اسپم در فیلد '{$key}'";
                break;
            }

            if ($this->isHarassment($value)) {
                $type = 'harassment';
                $targetName='پروفایل جعلی مشکوک';
                $priority = 'high';
                $description = "رفتار آزاردهنده در فیلد '{$key}'";
                break;
            }

            if ($this->isInappropriate($value)) {
                $type = 'inappropriate';
                $targetName='محتوای نامناسب';
                $priority = 'urgent';
                $description = "محتوای نامناسب در فیلد '{$key}'";
                break;
            }
        }


       /* $name = $request->input('name');
        $email = $request->input('email');
        $phone = $request->input('phone');

        if (!$type && $this->isFakeProfile($name, $email, $phone)) {
            $type = 'fake';
            $priority = 'medium';
            $description = 'شک به پروفایل جعلی';
        }*/

        // ثبت گزارش در صورت وجود نوع تخلف
        if ($type) {
            SecurityReport::create([
                'reporter_id' => $user->id,
                'reporter_name' => $user->name,
                'reporter_email' => $user->email,
                'target_user_id' => $user->id,
                'type' => $type,
                'priority' => $priority,
                'target_type' => 'profile',
                'target_name' => $targetName,
                'target_url' => url("/profile/" . $user->id),
                'description' => $description,
                'status' => 'open'
            ]);
        }

        return $response;
    }

    private function isSpam(string $text): bool
    {
        return str_contains($text, 'http') && strlen($text) < 10;
    }

    private function isHarassment(string $text): bool
    {
        $words = ['فحش', 'لعنت', 'مزاحم', 'تهدید'];
        return $this->contains($text, $words);
    }

    private function isInappropriate(string $text): bool
    {
        $words = ['پورن', 'سکس', 'برهنه', 'ناهنجار'];
        return $this->contains($text, $words);
    }

    private function isFakeProfile(?string $name, ?string $email, ?string $phone): bool
    {
        return !filter_var($email, FILTER_VALIDATE_EMAIL)
            || !preg_match('/^\d{10,15}$/', $phone ?? '')
            || preg_match('/[^آ-یA-Za-z\s]/u', $name ?? '');
    }

    private function contains(string $text, array $words): bool
    {
        foreach ($words as $word) {
            if (str_contains($text, $word)) return true;
        }
        return false;
    }
}
