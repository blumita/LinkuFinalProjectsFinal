<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class VerifyEmailOtpCodeRequest extends BaseFormRequest
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
            'email' => 'required|email|max:255',
            'code' => 'required|string|size:4',
            'type' => 'nullable|string|in:authenticate,admin_authenticate',
            // Optional profile fields for first-time email users
            'name' => 'nullable|string|max:100',
            'family' => 'nullable|string|max:100',
            // Phone: allow international formats but disallow Israeli country code (+972 or 972)
            'phone' => ['nullable','string','max:20','not_regex:/^(?:\\+?972|972)/'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'email.required' => 'ایمیل الزامی است.',
            'email.email' => 'فرمت ایمیل نامعتبر است.',
            'code.required' => 'کد تایید الزامی است.',
            'code.size' => 'کد تایید باید ۴ رقم باشد.',
            'phone.not_regex' => 'شماره تلفن وارد شده مجاز نیست.',
        ];
    }
}
