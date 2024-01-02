export const PaymentTermValue = {
	Credit_Card: 'cc',
	Square: 'square',
	Cheque: 'cheque',
	Wire: 'wire',
	ACH: 'ach',
};

export const PaymentTermLabel = {
	Credit_Card: 'Credit Card',
	Square: 'Square',
	Cheque: 'Cheque',
	Wire: 'Wire',
	ACH: 'ACH',
};

export const dayPaymentTerms = [
	{
		value: PaymentTermValue.Credit_Card,
		label: PaymentTermLabel.Credit_Card,
	},
	{ value: PaymentTermValue.Square, label: PaymentTermLabel.Square },
];

export const netPaymentTerms = [
	{ value: PaymentTermValue.Cheque, label: PaymentTermLabel.Cheque },
	{ value: PaymentTermValue.Wire, label: PaymentTermLabel.Wire },
	{ value: PaymentTermValue.ACH, label: PaymentTermLabel.ACH },
];
