import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customer: {},
  isLoading: false,
  isUpdatingProfile: false,
  isUpdatingAvatar: false,
  profilePic: '',
};

const customerPortalSlice = createSlice({
  name: 'customerPortal',
  initialState,
  reducers: {
    LOADING: state => {
      state.isLoading = true;
      state.isUpdatingProfile = false;
      state.isUpdatingAvatar = false;
    },
    CLEAR_LOADING: state => {
      state.isLoading = false;
    },
    SET_CUSTOMER_DETAILS: (state, action) => {
        state.customer = action.payload.customerDetails
        state.isLoading = false;
      state.isUpdatingProfile = false;
      state.isUpdatingAvatar = false;
    },

    SET_CUSTOMER_Avatar: (state , action) => {
      state.profilePic = action.payload?.profileData?.avator
    },
    SET_PROFILE_LOADING: (state) => {
        state.isUpdatingProfile = true;
    },
    SET_AVATAR_LOADING: (state) => {
        state.isUpdatingAvatar = true;
    },
    API_ERROR: (state, action) => {
      return {
        ...state,
        apiError: action.payload,
        isLoading: false
        // isDeletingPic = false;
      };
    },
    CLEAR_API_ERRORS: state => {
      state.apiError = null;
    }
  }
});
export const {
    LOADING,
    CLEAR_LOADING,
    SET_CUSTOMER_DETAILS,
    SET_PROFILE_LOADING,
    API_ERROR,
    SET_AVATAR_LOADING,
    CLEAR_API_ERRORS,
    SET_CUSTOMER_Avatar

} = customerPortalSlice.actions;
export default customerPortalSlice.reducer;
