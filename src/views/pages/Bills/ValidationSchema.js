import * as Yup from 'yup';

export const billValidationSchema = Yup.object().shape({
	vendor_id: Yup.string().required('Vendor name is required'),
	bill_number: Yup.string().required('Bill number  is required'),
	bill_date: Yup.string().required('Bill Date is required'),
	mode_of_payment: Yup.string().required('Mode of payment is required'),
	term_id: Yup.string().required('Term is required'),
	discount: Yup.number().min(0, 'Discount must be greater then 0 '),
	adjustment: Yup.string().min(0, 'Adjustment must be greater then 0 '),
	shipping_charges: Yup.string().min(
		0,
		'Shipping charges must be greater then 0 '
	),
	bill_item: Yup.array(
		Yup.object({
			item_name: Yup.string().required('Item name is required'),
			quantity: Yup.number()
				.required('Quantity is required')
				.min(1, 'Quantity must be greater than 0'),
			rate: Yup.number()
				.required('Rate is a required field')
				.min(1, 'Must be greater than 0'),
			tax: Yup.object().required('Tax is required'),
		})
	),
});
