<?php

namespace Database\Seeders;

use App\Models\Drink;
use Illuminate\Database\Seeder;

class DrinkSeeder extends Seeder
{
    public function run(): void
    {
        $drinks = [
            ['Masala Chai', 'Hot', 30, 'Spiced Indian tea with milk.', true],
            ['Cold Coffee', 'Cold', 90, 'Chilled coffee blended with ice cream.', true],
            ['Mango Shake', 'Shake', 80, 'Thick shake made from fresh mangoes.', true],
            ['Fresh Lime Soda', 'Cold', 50, 'Sweet or salted, served with soda.', true],
            ['Orange Juice', 'Juice', 70, '100% fresh squeezed.', false],
            ['Virgin Mojito', 'Mocktail', 120, 'Mint, lime and soda over ice.', true],
        ];

        foreach ($drinks as [$name, $category, $price, $description, $available]) {
            Drink::create(compact('name', 'category', 'price', 'description', 'available'));
        }
    }
}
