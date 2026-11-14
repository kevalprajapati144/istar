<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Drink extends Model
{
    protected $fillable = ['name', 'category', 'price', 'description', 'available'];

    protected $casts = [
        'price' => 'decimal:2',
        'available' => 'boolean',
    ];
}
