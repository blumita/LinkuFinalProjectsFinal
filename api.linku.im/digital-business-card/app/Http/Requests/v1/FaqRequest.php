<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\BaseFormRequest;

class FaqRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true; // اگر احراز هویت خاصی نداری
    }

    public function rules(): array
    {
        return [
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'active' => ['nullable', 'boolean'],
            'order' => 'integer|min:0',
        ];
    }
}
