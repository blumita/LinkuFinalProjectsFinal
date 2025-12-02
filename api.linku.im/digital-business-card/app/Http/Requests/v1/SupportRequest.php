<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\BaseFormRequest;

class SupportRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'socialMediaLink' => ['nullable', 'string', 'max:255'],
            'crispCode' => ['nullable', 'string', 'max:65535'],
            'active' => ['nullable', 'boolean'],
        ];
    }
}
