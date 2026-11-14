@csrf

<div class="mb-3">
    <label class="form-label" for="name">Name</label>
    <input type="text" id="name" name="name" class="form-control @error('name') is-invalid @enderror"
           value="{{ old('name', $drink->name ?? '') }}" required>
    @error('name') <div class="invalid-feedback">{{ $message }}</div> @enderror
</div>

<div class="row">
    <div class="col-md-6 mb-3">
        <label class="form-label" for="category">Category</label>
        <select id="category" name="category" class="form-select @error('category') is-invalid @enderror" required>
            @foreach ($categories as $category)
                <option value="{{ $category }}" @selected(old('category', $drink->category ?? '') === $category)>{{ $category }}</option>
            @endforeach
        </select>
        @error('category') <div class="invalid-feedback">{{ $message }}</div> @enderror
    </div>
    <div class="col-md-6 mb-3">
        <label class="form-label" for="price">Price (₹)</label>
        <input type="number" step="0.01" min="0" id="price" name="price" class="form-control @error('price') is-invalid @enderror"
               value="{{ old('price', $drink->price ?? '') }}" required>
        @error('price') <div class="invalid-feedback">{{ $message }}</div> @enderror
    </div>
</div>

<div class="mb-3">
    <label class="form-label" for="description">Description</label>
    <textarea id="description" name="description" rows="3" class="form-control @error('description') is-invalid @enderror">{{ old('description', $drink->description ?? '') }}</textarea>
    @error('description') <div class="invalid-feedback">{{ $message }}</div> @enderror
</div>

<div class="form-check form-switch mb-4">
    <input class="form-check-input" type="checkbox" id="available" name="available" value="1"
           @checked(old('available', $drink->available ?? true))>
    <label class="form-check-label" for="available">Available</label>
</div>

<button class="btn btn-primary">Save</button>
<a href="{{ route('drinks.index') }}" class="btn btn-light">Cancel</a>
