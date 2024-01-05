import * as Yup from 'yup';
import { phoneRegExp } from '../../../../core/utils/helpers';

export const validationSchema = Yup.object().shape({
	first_name: Yup.string().required('Name is required'),
	last_name: Yup.string().required('Last Name is required'),
	display_name: Yup.string().required('Display Name is required'),
	email: Yup.string().email('Invalid email').required('Email is required'),
	work_phone: Yup.string()
		.matches(phoneRegExp, 'Invalid phone number')
		.nullable(),
	phone: Yup.string().matches(phoneRegExp, 'Invalid phone number').nullable(),

	vendor_billing_address: Yup.object().shape({
		attention: Yup.string().required('Name is required'),
		address: Yup.string().required('Street 1 is required'),
		// address2: Yup.string().required('Street 2 is required'),
		country_id: Yup.string().required('Country is required'),
		state_id: Yup.string().required('State is required'),
		city: Yup.string().required('City is required'),
		zipcode: Yup.string().required('ZipCode is required'),
		phone: Yup.string()
			.matches(phoneRegExp, 'Invalid phone number')
			.nullable('Phone is required'),
		// fax: Yup.string().required('Fax is required'),
	}),
	vendor_shipping_address: Yup.object().shape({
		attention: Yup.string().required('Name is required'),
		address: Yup.string().required('Street 1 is required'),
		// address2: Yup.string().required('Street 2 is required'),
		country_id: Yup.string().required('Country is required'),
		state_id: Yup.string().required('State is required'),
		city: Yup.string().required('City is required'),
		zipcode: Yup.string().required('ZipCode is required'),
		phone: Yup.string()
			.matches(phoneRegExp, 'Invalid phone number')
			.nullable('Phone is required'),
		// fax: Yup.string().required('Fax is required'),
	}),
	vendor_contacts: Yup.array().of(
		Yup.object().shape({
			work_phone: Yup.string()
				.matches(phoneRegExp, 'Invalid phone number')
				.nullable(),
			mobile: Yup.string()
				.matches(phoneRegExp, 'Invalid phone number')
				.nullable(),
		})
	),
});
