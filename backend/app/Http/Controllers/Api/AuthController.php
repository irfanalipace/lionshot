<?php

namespace App\Http\Controllers\Api;

use Auth;
use App\Models\User;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;

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
    public function register(RegisterRequest $request)
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
    
                return response()->json([
                'message' => 'Successfully created user!',
                'accessToken'=> $token,
                ],201);
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

    public function login(LoginRequest $request)
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
    public function getUser(Request $request)
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
    public function logout(Request $request)
    {
        try {
            $request->user()->tokens()->delete();

            return $this->sendError('Successfully logged out');
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }

    }
}