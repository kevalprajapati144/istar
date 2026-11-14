@extends('layouts.app')

@section('title', 'All Drinks')

@section('content')
<div class="card shadow-sm border-0">
    <div class="card-body">
        <form method="GET" class="row g-2 mb-3">
            <div class="col-md-5">
                <input type="text" name="search" value="{{ request('search') }}" class="form-control" placeholder="Search drinks...">
            </div>
            <div class="col-md-3">
                <select name="category" class="form-select">
                    <option value="">All categories</option>
                    @foreach ($categories as $category)
                        <option value="{{ $category }}" @selected(request('category') === $category)>{{ $category }}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-2"><button class="btn btn-outline-secondary w-100">Filter</button></div>
            <div class="col-md-2"><a href="{{ route('drinks.create') }}" class="btn btn-primary w-100">Add drink</a></div>
        </form>

        <div class="table-responsive">
            <table class="table align-middle">
                <thead>
                    <tr><th>#</th><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th class="text-end">Actions</th></tr>
                </thead>
                <tbody>
                    @forelse ($drinks as $drink)
                        <tr>
                            <td>{{ $drinks->firstItem() + $loop->index }}</td>
                            <td>
                                <div class="fw-semibold">{{ $drink->name }}</div>
                                <small class="text-muted">{{ $drink->description }}</small>
                            </td>
                            <td>{{ $drink->category }}</td>
                            <td>₹{{ number_format($drink->price, 2) }}</td>
                            <td>
                                <span class="badge {{ $drink->available ? 'text-bg-success' : 'text-bg-secondary' }}">
                                    {{ $drink->available ? 'Available' : 'Unavailable' }}
                                </span>
                            </td>
                            <td class="text-end text-nowrap">
                                <a href="{{ route('drinks.edit', $drink) }}" class="btn btn-sm btn-outline-primary">Edit</a>
                                <form action="{{ route('drinks.destroy', $drink) }}" method="POST" class="d-inline"
                                      onsubmit="return confirm('Delete this drink?')">
                                    @csrf
                                    @method('DELETE')
                                    <button class="btn btn-sm btn-outline-danger">Delete</button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="6" class="text-center text-muted py-4">No drinks found.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        {{ $drinks->links('pagination::bootstrap-5') }}
    </div>
</div>
@endsection
