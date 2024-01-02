export const rtiAddDummyData = {
	company_name: 'Cybervision Inc',
	company_address:
		'70 Washington Square South, New York, NY 10012, United States',
	company_phone: '(262) 798-3040',
	sold_to: 'Lexi Renarje 1525 99th LN NE Blaine, MN 23897',
	bol_number: 12234,
	origin: 'rti',
	invoice_date: 'jan 03 2023',
	invoice_number: 22345,
	discount: 1000,
	total: 345,
	tax_amount: 0,
	sub_total: 0,
	customer_email: 'umar.zahir@99technologies.co',
	button_type: 'save_as_draft',
	invoice_items: [
		{
			item_id: null,
			rti_item_id: 1,
			item_name: 'Item1',
			quantity: 1,
			rate: 45,
			total: 345,
			weight: 20,
			tax_id: 4,
		},
	],
};

export enum PaymentTermValueEnum {
	Credit_Card = 'cc',
	Square = 'square',

	Cheque = 'cheque',
	Wire = 'wire',
	ACH = 'ach',
}

export enum PaymentTermLabelEnum {
	Credit_Card = 'Credit Card',
	Square = 'Square',

	Cheque = 'Cheque',
	Wire = 'Wire',
	ACH = 'ACH',
}

export const dayPaymentTerms = [
	{
		value: PaymentTermValueEnum.Credit_Card,
		label: PaymentTermLabelEnum.Credit_Card,
	},
	{ value: PaymentTermValueEnum.Square, label: PaymentTermLabelEnum.Square },
];

export const netPaymentTerms = [
	{ value: PaymentTermValueEnum.Cheque, label: PaymentTermLabelEnum.Cheque },
	{ value: PaymentTermValueEnum.Wire, label: PaymentTermLabelEnum.Wire },
	{ value: PaymentTermValueEnum.ACH, label: PaymentTermLabelEnum.ACH },
];
