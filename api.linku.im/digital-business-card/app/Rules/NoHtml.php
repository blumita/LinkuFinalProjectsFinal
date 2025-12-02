<?php
// app/Rules/NoHtml.php
namespace App\Rules;

use Illuminate\Contracts\Validation\ValidationRule;
use Closure;

class NoHtml implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value !== strip_tags($value)) {
            $fail("استفاده از کد HTML در فیلد {$attribute} مجاز نیست.");
        }
    }
}
