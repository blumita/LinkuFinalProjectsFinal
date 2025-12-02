<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class DiscountRequest extends BaseFormRequest
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
     * @return array
     */
    public function rules(): array
    {
        $discountId = $this->route('id');

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('discounts', 'code')->ignore($discountId),
            ],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],

            'type' => ['required', Rule::in(['percentage', 'fixed'])],
            'value' => ['required', 'numeric', 'min:0'],

            'maxUsage' => ['nullable', 'integer', 'min:1'],
            'usedCount' => ['nullable', 'integer', 'min:0'],

            'expiryDate' => ['nullable', 'date', 'after_or_equal:today'],
            'active' => ['boolean'],
        ];
    }

    /**
     * Custom attribute names (optional)
     */
    public function attributes(): array
    {
        return [
            'code' => 'کد تخفیف',
            'title' => 'عنوان',
            'type' => 'نوع تخفیف',
            'value' => 'مقدار تخفیف',
            'expiry_date' => 'تاریخ انقضا',
        ];
    }
}
