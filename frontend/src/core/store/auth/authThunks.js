// import { toast } from 'react-toastify';
import notyf from "../../../views/Components/NotificationMessage/notyfInstance"; // Import the Notyf instance
import notifyWarning from "../../../views/Components/NotificationMessage/notifyWarning";
import { useNavigate } from "react-router-dom";
import {
  LOGIN,
  LOGOUT,
  REGISTER,
  LOADING,
  CLEAR_LOADING,
  VERIFY_EMAIL,
  VERIFY_OTP,
  UPDATE_PROFILE,
  API_ERROR,
  DELETING_PROFILE_PIC,
  CLEAR_API_ERRORS,
} from "./authSlice";
import {
  loginApi,
  logoutApi,
  registerApi,
  verifyOtpApi,
  resetPasswordApi,
  forgetPasswordApi,
  //  verifyEmailApi,
  updateProfileApi,
  updatePasswordApi,
  deleteProfilePicApi,
} from "../../api/auth";
import {
  saveToken,
  destroyToken,
  saveUserEmail,
  saveUserName,
  saveUserImage,
  saveUserState,
  saveUserPassword,
  saveUser,
  saveTempToken,
  getTempToken,
  getUser,
  destroyTempKeys,
  saveUserID,
  saveOtp,
  saveEmail,
} from "../../services/authService";

import ApiService from "../../services/apiService";
import { handleErrors } from "../../utils/helpers";

export const  login = (credentials) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: {} });
      const response = await loginApi(credentials);

      const token = response?.data?.accessToken;
      saveToken(token);
      saveUser(response?.data);
      ApiService.setAuthToken(token);
      const user = response?.data;
      dispatch({
        type: LOGIN,
        payload: { ...user, name: user.name || user.user },
      });
      // toastr.success(response?.message);
      notyf.success("Login successful ");

      dispatch({ type: CLEAR_API_ERRORS, payload: {} });

      // return response;
    } catch (error) {
      // alert("Invalid Cridential");
      dispatch({ type: API_ERROR, payload: error });
      if (!error?.data?.message?.credentials)
        notyf.error(error?.data?.message || "Something went wrong");
    }
  };
};

export const register = (credentials, cb) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: {} });
      const resp = await registerApi(credentials);
      // toastr.success(resp?.message)
      notyf.success(`${resp?.message}! `);

      dispatch({ type: REGISTER, payload: resp });
      if (typeof cb === "function") {
        cb();
      }
    } catch (error) {
      console.error("Error in register action:", error); // Add this line for debugging
      dispatch({ type: API_ERROR, payload: error?.data?.errors });
      if (typeof cb === "function") {
        cb("catch");
      }
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: {} });
      const resp = await logoutApi();
      notyf.success(`${resp?.message}! `);
      dispatch({ type: LOGOUT });
      destroyToken();
      // toast.success('Logged out');
    } catch (error) {
      dispatch({ type: API_ERROR, payload: error?.data?.errors });
    }
  };
};

// export const verifyEmail = (email, cb) => {
//   return async dispatch => {
//     try {
//       dispatch({ type: LOADING, payload: {} });
//       await verifyEmailApi(email);
//       saveUserEmail(email);
//       dispatch({ type: VERIFY_EMAIL, payload: email });
//       if (typeof cb === 'function') cb();
//     } catch (error) {
//       // console.print('Something went wrong in login', error);
//       dispatch({ type: API_ERROR, payload: error?.data?.errors });
//     }
//   };
// };

// export const verifyOtp = (credentials) => {
//  // console.log('credentials', credentials);
//   return async (dispatch) => {
//     try {
//       dispatch({ type: LOADING, payload: {} });
//       const resp = await verifyOtpApi({ ...credentials, otp: Number(credentials?.otp) });
//       console.log('reppp', resp); // Move this line inside the try block
//       // alert('hh')

//       notyf.success('Otp Verified');
//       if(resp?.success){
//         saveOtp(credentials?.otp)
//         saveEmail(credentials?.email)
//       //  alert("save email", credentials?.email)

//       }

//       dispatch({ type: VERIFY_OTP, payload: { ...credentials } });

//     } catch (error) {
//       console.error('Error in verifyOtp:', error);
//       dispatch({ type: API_ERROR, payload: error?.data?.errors });
//      // alert('Error in verifyOtp: ' + error.message);
//     }
//   };
// };
// export const verifyOtp = (credentials, navigateCallback) => {
//   return async (dispatch) => {
//     try {
//       dispatch({ type: LOADING, payload: {} });
//       const resp = await verifyOtpApi({ ...credentials, otp: Number(credentials?.otp) });
//    //   alert(typeof navigateCallback, resp?.data?.success);
//       notyf.success('Otp Verified');
// console.log(resp?.data?.success,"otp response")
//       if (resp?.data?.success) {
//         saveOtp(credentials?.otp);
//         saveEmail(credentials?.email);
//         // Call the callback with success as true
//         alert(callback,'callback')
//         navigateCallback()
//       } else {
//         // Call the callback with success as false and the error message
//        // callback(false, resp?.message);
//       }

//       dispatch({ type: VERIFY_OTP, payload: { ...credentials } });
//     } catch (error) {
//       console.error('Error in verifyOtp:', error);
//       dispatch({ type: API_ERROR, payload: error?.data?.errors });
//       // Call the callback with success as false and the error message
//       callback(false, 'Error in verifyOtp: ' + error.message);
//     }
//   };
// };

export const verifyOtp = (credentials, navigateCallback) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: {} });

      const resp = await verifyOtpApi({
        ...credentials,
        otp: Number(credentials?.otp),
      });
      notyf.success("Otp Verified");
      // alert("LL")
      // console.log('resp?.data?.success', resp.data);

      if (resp?.data) {
        // console.log(typeof navigateCallback, 'rrrr');
        saveOtp(credentials?.otp);
        saveEmail(credentials?.email);
        // Call the navigate callback
        navigateCallback();
      } else {
        //  alert("ss")
        // Handle the case where OTP verification fails
        console.log("Error in OTP verification:", resp?.message);
        // You may want to display an error message to the user
        // or take appropriate action based on the backend message
      }

      //  dispatch({ type: VERIFY_OTP, payload: { ...credentials } });
    } catch (error) {
      //  alert("ss")
      //  console.error("Error in verifyOtp:", error);
      notifyWarning.success("Something Invalid");
    }
  };
};

// export const verifyOtp = credentials => {
//   return async dispatch => {
//     try {
//       dispatch({ type: LOADING, payload: {} });
//       const resp = await verifyOtpApi({...credentials , otp: Number(credentials?.otp)});
//       console.log(resp,'ressp')
//       if (resp.status) {
//         // If verification is successful (status is true)
//         notyf.success('Otp Verified');

//         // Save OTP to local storage
//         localStorage.setItem('resetPasswordOTP', credentials.otp);

//         // Perform other actions if needed
//         let tempToken = getTempToken();
//         let user = getUser();
//         dispatch({ type: VERIFY_OTP, payload: { ...user } });
//         destroyTempKeys(); // Destroy user password and temporary token after login success
//         saveToken(tempToken); // Store temporary token in the right key to be used later for calling protected APIs

//         // Navigate to reset_password route
//         // You can use your navigation library or window.location.href for redirection
//         // Example using react-router-dom:
//         // import { useHistory } from 'react-router-dom';
//         // const history = useHistory();
//         // history.push('/reset_password');
//       } else {
//         // Handle the case where verification fails
//         console.log('Verification failed');
//         // You can dispatch an action or handle it in any other way
//       }
//     } catch (error) {
//       console.log('Error in verifyOtp:', error);
//       dispatch({ type: API_ERROR, payload: error?.data?.errors });
//     }
//   };
// };

export const resetPassword = (credentials, cb) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: {} });
      await resetPasswordApi(credentials);
      notyf.success("Password Updated");

      dispatch({ type: CLEAR_LOADING, payload: {} });
      // toast.success('Password Changed Successfully');
      if (typeof cb === "function") cb();
    } catch (error) {
      notifyWarning.success("Something Invalid");

      dispatch({ type: API_ERROR, payload: error?.data?.errors });
      //  notyf.success(`${resp?.message}! `);
    }
  };
};  

export const forgetPassword = (credentials, cb) => {
  // alert('1')
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: {} });
      const resp = await forgetPasswordApi(credentials);
      console.log("resppposs", resp?.data);
      notyf.success(`${resp?.message}! `);
      dispatch({ type: CLEAR_LOADING, payload: {} });
      if (typeof cb === "function") cb();
    } catch (error) {
      //  alert("error")
      // alert('')
      handleErrors(error?.data?.message);
      dispatch({ type: API_ERROR, payload: error?.data?.errors });
    }
  };
};

export const updateProfile = (formData) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: {} });
      let response = await updateProfileApi(formData);
      dispatch({ type: UPDATE_PROFILE, payload: response });
      saveUser(response);
      // toast.success('Profile Updated Successfully');
    } catch (error) {
      // console.print('Something went wrong in updateProfile', error);
      dispatch({ type: API_ERROR, payload: error?.data?.errors });
    }
  };
};

export const updatePassword = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING, payload: {} });
      await updatePasswordApi(data);
      // toast.success('Password Updated Successfully');

      dispatch({ type: CLEAR_LOADING, payload: {} });
      dispatch({ type: CLEAR_API_ERRORS, payload: {} });
    } catch (error) {
      // console.print('Something went wrong in updatePassword', error);
      dispatch({ type: API_ERROR, payload: error?.data?.errors });
    }
  };
};

export const deleteProfilePic = (data, cb) => {
  return async (dispatch) => {
    try {
      dispatch({ type: DELETING_PROFILE_PIC, payload: {} });
      let response = await deleteProfilePicApi(data);
      dispatch({ type: UPDATE_PROFILE, payload: response });
      saveUser(response);
      if (typeof cb === "function") cb();
      // toast.success('Profile Picture removed');
    } catch (error) {
      // console.print('Something went wrong in updateProfile', error);
      dispatch({ type: API_ERROR, payload: error?.data?.errors });
    }
  };
};
