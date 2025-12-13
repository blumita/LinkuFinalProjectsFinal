<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class CardUpdateRequest extends BaseFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            //
            'cardName' => ['sometimes', 'string'],
            'slug' => ['sometimes', 'string', 'min:3', 'max:7', 'regex:/^[a-zA-Z0-9]+$/', 'unique:cards,slug,' . $this->route('card')?->id],
            'layout'=>['nullable', 'string'],
            //'profileImage' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048', // حداکثر 2MB
            //'coverImage' => 'required|image|mimes:jpeg,png,jpg,webp|max:4096',  // 4MB
            //'logoImage'   => 'required|image|mimes:jpeg,png,jpg,webp|max:1024', // 1MB
            'name' => ['sometimes', 'string'],
            'location' => ['nullable', 'string'],
            'job' => ['nullable', 'string'],
            'company' => ['nullable', 'string'],
            'bio' => ['nullable', 'string'],
            'saveContact'=>['nullable', 'string'],
            'iconColor' => ['nullable', 'string'],                           // Theme primary color
            'themeColor' => ['nullable', 'string'],
            'matchThemeColor'=>['nullable','boolean'],
            // QR Code settings
            'qrColor' => ['nullable', 'string'],
            'qrBgColor' => ['nullable', 'string'],
            'qrLogo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            // Lead Capture - accepts '1', '0', true, false, 1, 0
            'leadCaptureMode' => ['nullable'],
        ];
    }
}
