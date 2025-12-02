<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class QuestionBox extends Model
{
    //
    protected $fillable = ['card_id','question','description','read_at'];

    public function link(): HasMany
    {
        return $this->hasMany(QuestionBox::class);
    }
}
