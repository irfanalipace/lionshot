export interface InitialValues {
	customer_id: string;
	// payment_method: string;
	mode_of_payment: string;
	cheque_image: any;
	cheque_number: string;
	term_id: number | string;
	due_date: Date | string;
	order_number: string;
	sales_person_id: string;
	invoice_number: string;
	reference_number: string;
	invoice_date: string; // You might want to use a specific date type if available
	expiry_date: string | null; // Change to a specific date type if available
	subject: string;
	customer_note: string;
	terms_and_condition: string;
	invoice_files: File[]; // Assuming invoiceFiles is an array of file paths
	email_to: string[]; // Assuming customerEmailsList is an array of email addresses
	sub_total: number;
	discount: number;
	tax_amount: number;
	discount_type: string;
	shipping_charges: number;
	adjustment: number;
	items_rates_are: string;
	total: number;
	invoice_items: {
		item_name_object: object | string;
		item_id: string;
		item_name: string;
		quantity: number;
		item_rate: number;
		rate: number;
		tax_amount: number;
		amount: number;
		tax_id: number | string;
		tax: object | string;
		total: number;
	}[];
}
