<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ResetPasswordRequest;
use Auth;
use App\Models\User;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends BaseController
{
    /**
    * Create user
    *
    * @param  [string] name
    * @param  [string] email
    * @param  [string] password
    * @param  [string] password_confirmation
    * @return [string] message
    */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $user = new User([
                'name'  => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
            ]);

            if($user->save()){
                // We should use SALT
                $tokenResult = $user->createToken('Personal Access Token');
                $token = $tokenResult->accessToken;

                // Invoke register user event, it will email the
                // newly registered user for verification
                event(new Registered($user));

                return $this->sendResponse(['accessToken'=> $token], 'Successfully created user!');
            }

            return $this->sendError('Provide proper details');
        } catch (\Throwable $th) {
            return $this->sendError([
                'trace' =>'User Registration Failed! in AuthController',
                'stack-trace' => $th->getMessage()
            ]);
        }
    }

    /**
     * Login user and create token
    *
    * @param  [string] email
    * @param  [string] password
    * @param  [boolean] remember_me
    */

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $credentials = request(['email','password']);

            if(!Auth::attempt($credentials))
            {
                return response()->json([
                    'message' => 'Unauthorized'
                ],401);
            }

            // increase attempts;
            // Throttle wagera;
            $user = $request->user();
            $tokenResult = $user->createToken('Personal Access Token');
            $token = $tokenResult->accessToken;

            $accessToken = [
                'accessToken' =>$token,
                'token_type' => 'Bearer',
            ];

            return $this->sendResponse($accessToken, 'User logged in successfully');
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }

    }

    /**
     * Get the authenticated User
    *
    * @return [json] user object
    */
    public function getUser(Request $request): JsonResponse
    {
        try {
            return $this->sendResponse($request->user(), 'User fetched successfully');
        } catch (\Throwable $th) {
            $errorMessage = 'Unable to find user or the user isnt logged in';

            return $this->sendError($errorMessage);
        }
    }

    /**
     * Logout user (Revoke the token)
    *
    * @return [string] message
    */
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->tokens()->delete();

            return $this->sendResponse(null, 'Successfully logged out');
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }

    }

    /**
     * Forgot password
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        try {
            $input = $request->all();
            $rules = [
                'email' => "required|email",
            ];

            $validator = Validator::make($input, $rules);

            if ($validator->fails()) {
                throw new \Exception($validator->errors()->first());
            } else {
                $status = Password::sendResetLink(
                    $request->only('email')
                );

                if ($status === Password::RESET_LINK_SENT) {
                    return $this->sendResponse(null, 'Reset password link sent successfully');
                } else if (Password::INVALID_USER) {
                    return $this->sendError('User not found', [], 400);
                }
            }


            return $this->sendResponse(null, 'Something went wrong, please try again');
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }

    /**
     * Reset Password
     *
     * @param ResetPasswordRequest $request
     * @return JsonResponse
     */
    function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $callback = function (User $user, string $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->setRememberToken(Str::random(60));

            $user->save();

            event(new PasswordReset($user));
        };

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            $callback
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->sendResponse(null, 'Password has been updated successfully');
        }

        return $this->sendError('Password reset unsuccessful, please try again');
    }

    function VerificationVerify (EmailVerificationRequest $request): bool {
        try {
            $request->fulfill();

            return true;
        } catch (\Throwable $th) {
            // Not throwing error here for now
            return false;
        }
    }

    function VerificationNotice () {
        return view('auth.verify-email');
    }

    /**
     * Sends a verification link to the user;
     *
     * @param
     *
     * @return
     *  bool
     */
    function VerificationLink (Request $request) {
       try {
        $request->user()->sendEmailVerificationNotification();

        return  true;
       } catch (\Throwable $th) {
        return false;
       }
    }
}
