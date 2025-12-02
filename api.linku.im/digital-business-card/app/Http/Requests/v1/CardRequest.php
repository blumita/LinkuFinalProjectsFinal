<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class CardRequest extends BaseFormRequest
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
            'cardName' => ['required', 'string'],
            'layout'=>['nullable', 'string'],
            //'profileImage' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048', // حداکثر 2MB
            //'coverImage' => 'required|image|mimes:jpeg,png,jpg,webp|max:4096',  // 4MB
            //'logoImage'   => 'required|image|mimes:jpeg,png,jpg,webp|max:1024', // 1MB
            'name' => ['required', 'string'],
            'location' => ['nullable', 'string'],
            'job' => ['nullable', 'string'],
            'company' => ['nullable', 'string'],
            'bio' => ['nullable', 'string'],
            'saveContact'=>['nullable', 'string'],
            'iconColor' => ['nullable', 'string'],                           // Theme primary color
            'themeColor' => ['nullable', 'string'],
            'matchThemeColor'=>['nullable','boolean']
        ];
    }
}
