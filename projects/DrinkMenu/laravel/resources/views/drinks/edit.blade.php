@extends('layouts.app')

@section('title', 'Edit Drink')

@section('content')
<div class="card shadow-sm border-0" style="max-width:640px">
    <div class="card-body">
        <h4 class="mb-3">Edit drink</h4>
        <form action="{{ route('drinks.update', $drink) }}" method="POST">
            @method('PUT')
            @include('drinks._form')
        </form>
    </div>
</div>
@endsection
