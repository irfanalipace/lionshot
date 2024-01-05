import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import authReducer from './auth/authSlice';
import customerReducer from './auth/customerPortalSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer

    // Add additional reducers for other features here
  },
  middleware: [thunkMiddleware]
});

export default store;
