<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Forget Password OTP</title>
</head>
<body>
    <main>
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
    </main>
</body>
</html>

