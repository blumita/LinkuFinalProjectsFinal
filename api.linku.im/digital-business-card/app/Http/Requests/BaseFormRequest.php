<?php

namespace App\Http\Requests;

use App\Traits\HasApiResponses;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class BaseFormRequest extends FormRequest
{
    use HasApiResponses;
    protected function failedValidation(Validator $validator)
    {

        // Return custom JSON response when validation fails
        throw new HttpResponseException($this->fail(__('errors.validation_failed')
            ,$validator->errors(),422));
    }

}
