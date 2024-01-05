import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
	customer_id: Yup.string().required('Customer Name is required'),
	payment_amount: Yup.string().required('Payment Amount is required'),
	link_expiration_date: Yup.date()
		.min(
			new Date(new Date().setHours(0, 0, 0, 0)),
			'Date should be today or a future date'
		)
		.required('Expiration date is required'),
	description: Yup.string().required('Description is required'),
});
