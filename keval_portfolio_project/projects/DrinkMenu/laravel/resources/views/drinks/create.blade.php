@extends('layouts.app')

@section('title', 'Add Drink')

@section('content')
<div class="card shadow-sm border-0" style="max-width:640px">
    <div class="card-body">
        <h4 class="mb-3">Add drink</h4>
        <form action="{{ route('drinks.store') }}" method="POST">
            @include('drinks._form')
        </form>
    </div>
</div>
@endsection
