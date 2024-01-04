@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">{{ __('Reset Password') }}</div>

                    <div class="card-body">
                        <h3>Dear Mr/Ms. {{ $fullName  }}</h3>

                        <p><strong>Here is the OTP for resetting the password</strong></p>

                        <div class="col-12"><h2>{{ $otp  }}</h2></div>

                        <div class="col-12">OTP will expire in 5 mins</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
