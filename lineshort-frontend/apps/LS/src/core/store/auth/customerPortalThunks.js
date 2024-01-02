import {
	LOADING,
	CLEAR_LOADING,
	SET_CUSTOMER_DETAILS,
	SET_PROFILE_LOADING,
	API_ERROR,
	SET_AVATAR_LOADING,
	CLEAR_API_ERRORS,
	SET_CUSTOMER_Avatar,
} from './customerPortalSlice';
import {
	getCustomerDetailsApi,
	updateCustomerDetailsApi,
	updateCustomerProfileApi,
} from '../../api/customerportal';
import notyf from '../../../views/Components/NotificationMessage/notyfInstance';

export const getCustomerDetails = params => {
	return async dispatch => {
		try {
			dispatch({ type: LOADING, payload: {} });
			const response = await getCustomerDetailsApi(params);

			const customerDetails = response?.data;
			dispatch({
				type: SET_CUSTOMER_DETAILS,
				payload: { customerDetails },
			});
		} catch (error) {
			dispatch({ type: API_ERROR, payload: error });
		}
	};
};

export const updateCustomerDetails = (body, cb) => {
	return async dispatch => {
		try {
			dispatch({ type: LOADING, payload: {} });
			const response = await updateCustomerDetailsApi(body);

			const customerDetails = response?.data;
			if (typeof cb === 'function') cb();
			notyf.success('Customer Profile updated successfully');
			dispatch({
				type: SET_CUSTOMER_DETAILS,
				payload: { customerDetails },
			});
		} catch (error) {
			dispatch({ type: API_ERROR, payload: error });
		} finally {
			dispatch({ type: CLEAR_LOADING, payload: false });
		}
	};
};

export const updateCustomerProfile = (body, cb, validDp) => {
	return async dispatch => {
		try {
			dispatch({ type: LOADING, payload: true });
			const response = await updateCustomerProfileApi(body);

			const profileData = response?.data;
			console.log('profileData', profileData);
			if (typeof cb === 'function') cb('success', validDp);
			notyf.success('Customer Profile updated successfully');
			dispatch({
				type: SET_CUSTOMER_Avatar,
				payload: { profileData },
			});
		} catch (error) {
			if (typeof cb === 'function') cb('catch', '');
			dispatch({ type: API_ERROR, payload: error });
		} finally {
			dispatch({ type: CLEAR_LOADING, payload: false });
		}
	};
};
