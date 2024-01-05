<?php

namespace App\Http\Controllers\Api;

use Auth;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use App\Http\Requests\ResetPasswordRequest;
use App\Jobs\ForgotPassword;
use App\Jobs\SendVerificationRequest;
use Closure;

class AuthController extends BaseController
{
    /**
    * Create user
    *
    * @param  [string] full_name
    * @param  [string last_name
    * @param  [string] email
    * @param  [string] password
    * @param  [string] password_confirmation
    * @return [string] message
    */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $user = new User([
                'first_name'  => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
            ]);

            if($user->save()){
                // We should use SALT
                $tokenResult = $user->createToken('Personal Access Token');
                $token = $tokenResult->accessToken;

                SendVerificationRequest::dispatch($user);

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
                //TODO
                /**
                 * 1. Generate random OTP;
                 * 2. Send the user, an email containing OTP
                 * 3. User will add the OTP on the F.E
                 * 4. Verify that OTP with on submit through an API call.
                 * 5. Success response
                 */

                $otp = rand(100000,999999);
                $user = User::where('email', $request->email)->first();

                if (!$user) {
                    throw new \Exception('User not found, please try again with a correct email');
                }

                $user->otp = $otp;
                $user->otp_created_at = Carbon::now();
                $user->save();

                //Dispatching an event for the mail
                ForgotPassword::dispatch($user, $otp);

                return $this->sendResponse(null, 'A five digit OTP has been sent to the users email');
            }

        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }

    /**
     * Validated the OTP and calls the callback
     *
     * @param Request $request
     * @param Closure $callback (optional)
     * @return bool
     */
    function validateOTP(Request $request, Closure $callback = null): bool
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return false;
        }

        if (!$user->otp || !$user->otp_created_at) {
            return false;
        }

        if ($user->otp !== $request->otp) {
            return false;
        }

        // Check if the otp has expired;
        $past = Carbon::parse($user->otp_created_at);

        if (Carbon::now()->diffInMinutes($past) >= 5) {
            return false;
        }
        

        if (gettype($callback) === 'object') {
            $callback($user, $request->password);
        }

        return true;
    }

    /**
     * Verify the OTP which was sent to the user through forget-password api
     *
     * @param Request $requet
     *
     * @return JsonResponse
     */
    function verifyOtp(Request $request): JsonResponse
    {
        try {
            $rules = [
                'otp' => "required",
                'email' => 'required|string'
            ];

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                throw new \Exception($validator->errors()->first());
            }

            return $this->sendResponse($this->validateOTP($request), 'OTP verification');
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage(), null);
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

            $user->otp = null;
            $user->otp_created_at = null;

            $user->save();

            event(new PasswordReset($user));
        };

        $status = $this->validateOTP($request, $callback);

        if ($status) {
            return $this->sendResponse(null, 'Password has been updated successfully');
        }

        return $this->sendError('Password reset unsuccessful, please try again');
    }

    public function verificationVerify($user_id, Request $request): JsonResponse
    {
        try {
            $user = User::findOrFail($user_id);

            if (!$request->hasValidSignature()) {
                return $this->sendError(["msg" => ["Invalid/Expired url provided."]], 401);
            }

            if (!$user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
            }

            return $this->sendResponse($user->hasVerifiedEmail(), 'User has been verified successfully');
        } catch (\Throwable $th) {
         return $this->sendError($th->getMessage(), null, 'Please check stacktrace');
        }
    }

    function verificationNotice () {
        return view('auth.verify-email');
    }

    /**
     * Sends a verification link to the user;
     *
     * @param Request $request
     * @return JsonResponse bool
     *  bool
     */
    function verificationLink (Request $request): JsonResponse
    {
       try {
        $request->user()->sendEmailVerificationNotification();

        return $this->sendResponse(null, 'Verification message has been sent to the users email');
       } catch (\Throwable $th) {
        return $this->sendError($th->getMessage(), null, 'Something went wrong.');
       }
    }
}
