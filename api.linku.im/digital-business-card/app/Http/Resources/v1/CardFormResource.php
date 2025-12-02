<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class CardFormResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // تبدیل رشته JSON به آرایه
        $data = json_decode($this->data, true) ?? [];

        // افزودن فایل‌ها با کلیدهای file_1, file_2, ...
        foreach ($this->files as $index => $file) {
            $key = 'فایل_' . ($index + 1);
            $data[$key] = media_path($file->path); // مسیر فایل قابل استفاده در فرانت
        }

        // افزودن کد پیگیری
        $data['کد پیگیری'] = $this->hash;

        return [
            'id' => $this->id,
            'data' => $data,
            'readAt' => $this->read_at,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at
        ];
    }
    function fileKeyToPersian(string $key): string
    {
        if (Str::startsWith($key, 'file_')) {
            $number = (int) Str::after($key, 'file_');
            return 'فایل ' . $this->toPersianNumber($number);
        }

        return $key;
    }
    function toPersianNumber($number): string
    {
        $persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
        return str_replace(range(0, 9), $persianDigits, strval($number));
    }

}
