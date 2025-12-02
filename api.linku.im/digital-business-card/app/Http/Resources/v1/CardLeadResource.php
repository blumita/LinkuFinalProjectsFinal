<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class CardLeadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //Decoded json data
        $data = $this->data ?? [];

        foreach ($this->files as $file) {
            if ($file->field) {
                $persianKey = $this->fileKeyToPersian($file->field);
                $data[$persianKey] = media_path($file->path);
            }
        }

        $fileKeys = collect($data)
            ->filter(fn ($value, $key) => is_string($value) && (
                    Str::startsWith($key, 'file_') ||
                    in_array($key, ['logo', 'تصویر', 'فایل'])
                ))
            ->keys();

        foreach ($fileKeys as $key) {
            $data[$key] = media_path($data[$key]);
        }

        $data['کد پیگیری'] = $this->hash;


        return [
            'id'=>$this->id,
            'modelType'=>'cardlead',
            'cardId'=>$this->card_id,
            'isDefault'=>$this->is_default,
            'hash'=>$this->hash,
            'data' => $data,
            'readAt'=>$this->read_at,
            'createdAt'=>$this->created_at,
            'updatedAt'=>$this->updated_at
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
