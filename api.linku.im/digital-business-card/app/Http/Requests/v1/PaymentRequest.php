<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class PaymentRequest extends BaseFormRequest
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
            'planId' => 'required|numeric|exists:plans,id',
            'amount' => 'required|numeric|min:1000',
            'gateway' => 'nullable|string',
            'callback_url' => 'nullable|url',
            'metadata' => 'nullable|array',
        ];
    }
}
