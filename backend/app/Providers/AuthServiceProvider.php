<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];


    /**
     * !We need to over-ride default api routes
     * since laravel by-default send reset links for the web.
     *
     * !We will create API routes to received the reset tokens when user
     * ! clicks on the reset link
     *
     * @param  string  $token
     *
     * Register any authentication / authorization services.
    */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (User $user, string $token) {
            return env('APP_URL').'/api/reset-password?token='.$token;
        });
    }
}
