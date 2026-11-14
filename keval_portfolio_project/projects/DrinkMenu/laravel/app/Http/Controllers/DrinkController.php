<?php

namespace App\Http\Controllers;

use App\Models\Drink;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DrinkController extends Controller
{
    public const CATEGORIES = ['Hot', 'Cold', 'Juice', 'Shake', 'Mocktail'];

    // READ: list drinks with optional search and category filter
    public function index(Request $request): View
    {
        $drinks = Drink::query()
            ->when($request->filled('search'), fn ($q) => $q->where('name', 'like', '%' . $request->search . '%'))
            ->when($request->filled('category'), fn ($q) => $q->where('category', $request->category))
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return view('drinks.index', ['drinks' => $drinks, 'categories' => self::CATEGORIES]);
    }

    // CREATE: show the form
    public function create(): View
    {
        return view('drinks.create', ['categories' => self::CATEGORIES]);
    }

    // CREATE: save a new drink
    public function store(Request $request): RedirectResponse
    {
        Drink::create($this->validated($request));

        return redirect()->route('drinks.index')->with('success', 'Drink added successfully.');
    }

    // UPDATE: show the edit form
    public function edit(Drink $drink): View
    {
        return view('drinks.edit', ['drink' => $drink, 'categories' => self::CATEGORIES]);
    }

    // UPDATE: save changes
    public function update(Request $request, Drink $drink): RedirectResponse
    {
        $drink->update($this->validated($request));

        return redirect()->route('drinks.index')->with('success', 'Drink updated successfully.');
    }

    // DELETE: remove a drink
    public function destroy(Drink $drink): RedirectResponse
    {
        $drink->delete();

        return redirect()->route('drinks.index')->with('success', 'Drink deleted successfully.');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'category' => ['required', 'in:' . implode(',', self::CATEGORIES)],
            'price' => ['required', 'numeric', 'min:0', 'max:99999'],
            'description' => ['nullable', 'string', 'max:250'],
        ]);

        $data['available'] = $request->boolean('available');

        return $data;
    }
}
