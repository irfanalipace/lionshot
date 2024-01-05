export const salutations = [
	{
		value: 'Mr.',
		text: 'Mr.',
	},
	{
		value: 'Mrs.',
		text: 'Mrs.',
	},
	{
		value: 'Ms.',
		text: 'Ms.',
	},
	{
		value: 'Miss.',
		text: 'Miss.',
	},
	{
		value: 'Dr.',
		text: 'Dr.',
	},
];

export const cities = [
	{
		value: '1',
		text: 'New York',
	},
];

export const states = [
	{
		value: '1',
		text: 'California',
	},
];

export const countries = [
	{
		value: '231',
		text: 'US',
	},
];

export const Terms = [
	// {
	//   label: 'Due end of the month',
	//   value: 'EOM'
	// },
	// {
	//   label: 'Due end of next month',
	//   value: 'EONM'
	// },
	{
		label: 'Custom',
		value: 'CUSTOM',
	},
];

export const portalLanguageOptions = [
	{ value: 'English', label: 'English' },
	{ value: 'French', label: 'French' },
	{ value: 'Spanish', label: 'Spanish' },
	// Add more language options as needed
];
export const FileTypeEnum = {
	CSV: {
		key: 'csv',
		label: 'CSV (Comma Separated File)',
	},
	XLS: {
		key: 'xls',
		label: 'XLS (Microsoft Excel 1997-2004 Compatible)',
	},
	XLSX: {
		key: 'xlsx',
		label: 'XLSX (Microsoft Excel)',
	},
};

export const TaxTypeEnum = {
	taxable: {
		key: 'taxable',
		label: 'Taxable',
	},
	taxExempt: {
		key: 'tax_exempt',
		label: 'Tax Exempt',
	},
};

export const FILE_TYPES = {
	pdf: {
		label: 'PDF',
		contentType: 'application/pdf',
	},
	xls: { label: 'XLS', contentType: 'application/vnd.ms-excel' },
	xlsx: {
		label: 'XLSX',
		contentType:
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	},
	doc: { label: 'DOC', contentType: 'application/msword' },
	docx: { label: 'DOCX', contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
	csv: {
		label: 'CSV',
		contentType: 'text/csv',
	},
	png: {
		label: 'PNG',
		contentType: 'image/png',
	},
	jpeg: {
		label: 'JPEG',
		contentType: 'image/jpeg',
	},
	jpg: {
		label: 'JPG',
		contentType: 'image/jpeg',
	},
	gif: {
		label: 'GIF',
		contentType: 'image/gif',
	},
	svg: {
		label: 'SVG',
		contentType: 'image/svg+xml',
	},
	webp: {
		label: 'WebP',
		contentType: 'image/webp',
	},
};

export const MODULE_SLUG = {
	items: 'Items',
	'price-lists': 'Price List',
	customer: 'Customers',
	'sale-orders': 'Sales Order',
	invoices: 'Invoice',
	'price-quote': 'Price Quote',
	'credit-memo': 'Credit Memo',
};

export const TABLE_NAME_FROM_ROUTE = {
	'/items': 'items',
	'/price-lists': 'price_lists',
	'/customer': 'customers',
	'/sale-orders': 'sale_orders',
	'/invoices': 'invoices',
	'/price-quote': 'estimates',
	'/credit-memo': 'credit_memos',
};

export const TABLE_NAME_FROM_MODULE = {
	[MODULE_SLUG['items']]: 'items',
	[MODULE_SLUG['price-lists']]: 'price_lists',
	[MODULE_SLUG['customer']]: 'customers',
	[MODULE_SLUG['sale-orders']]: 'sale_orders',
	[MODULE_SLUG['invoices']]: 'invoices',
	[MODULE_SLUG['price-quote']]: 'estimates',
	[MODULE_SLUG['credit-memo']]: 'credit_memos',
};

export const PAYMENT_METHODS = [
	{ value: 'cc', text: 'Credit Card' },
	{ value: 'paypal', text: 'PayPal' },
	{ value: 'cheque', text: 'Cheque' },
	{ value: 'wire', text: 'Wire' },
	{ value: 'ach', text: 'ACH' },
	{ value: 'square', text: 'Square' },
];

export const organizationDetails = {
	address:{
		address: '1275 Corporate Center Drive',
		city:'Eagan',
		state:'Minnesota',
		stateAbbr:'MN',
		postalCode:'55121',
		country:'United States',
	},
	email:'sales@minnesotacomputers.us',
	website:'www.minnesotacomputers.us'
	
}

export const terms_and_conditions = `All items will come with a Standard 30-Days Warranty unless specified in the applicable invoice. All items sold on this invoice are considered Pre-Owned (Used) unless
otherwise noted in the sales agreement. Any DOA or damaged claim must be noted to the company in writing with 10 days upon delivery to the vendor. the company will not
be responsible for any damage in the shipping unless mentioned in the sales agreement.`