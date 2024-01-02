import ApiService from '@/utils/apiService';
interface ApiResponse {
	// Define your response structure here
	// Example: data: any;
}

// delete estimates fiels
export function deleteInvoiceFielsApi(id) {
	return new Promise((resolve, reject) => {
		ApiService.delete(`/invoice-file-delete/${id}`)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function addInvoiceFileApi(data) {
	const formData = new FormData();

	for (const key in data) {
		if (Array.isArray(data[key])) {
			data[key].forEach((item, index) => {
				formData.append(`${key}[${index}]`, item);
			});
		} else {
			formData.append(key, data[key]);
		}
	}

	return new Promise((resolve, reject) => {
		ApiService.post('/add-invoice-files', formData, '', true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// create invoice
export function createInvoiceApi(data: any) {
	return new Promise((resolve, reject) => {
		ApiService.post('/invoice', data, '', true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// import invoice
export function importInvoiceApi(data: any) {
	return new Promise((resolve, reject) => {
		ApiService.post('/import-invoices', data, '', true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// add customer conatct
export function addCustomerContactApi(data) {
	return new Promise((resolve, reject) => {
		ApiService.post('/add-customer-contact', data)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// update invoice
export function updateInvoiceApi(data: { id: any }) {
	return new Promise((resolve, reject) => {
		ApiService.post(`/invoice/${data.id}`, data, '', true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// add customer conatct
export function generateNumberApi(type: { type: string }) {
	return new Promise((resolve, reject) => {
		ApiService.post('/generate-number', type)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// get all invoice list
export function getAllInvoicesListApi(params: any): Promise<ApiResponse> {
	return new Promise((resolve, reject) => {
		ApiService.get('/invoice', null, params)
			.then((response: ApiResponse) => {
				resolve(response);
			})
			.catch((e: any) => {
				console.log('getAllInvoicesListApi', e);
				reject(e);
			});
	});
}

// get all invoice list
export function getInvoiceSummaryApi(params: any): Promise<ApiResponse> {
	return new Promise((resolve, reject) => {
		ApiService.get('/get-invoice-dashboard', null, params)
			.then((response: ApiResponse) => {
				resolve(response);
			})
			.catch((e: any) => {
				console.log('getAllInvoicesListApi', e);
				reject(e);
			});
	});
}

// Invoice Export
export function getAllInvoicesExportApi(params: any): Promise<ApiResponse> {
	return new Promise((resolve, reject) => {
		ApiService.get('/export-invoice', null, params)
			.then((response: ApiResponse) => {
				resolve(response);
			})
			.catch((e: any) => {
				console.log('getAllInvoicesExportApi', e);
				reject(e);
			});
	});
}

// get invoice details
export function getInvoiceDetailsApi(id: any): Promise<ApiResponse> {
	return new Promise((resolve, reject) => {
		ApiService.get(`/invoice/${id}`)
			.then((response: ApiResponse) => {
				resolve(response);
			})
			.catch((e: any) => {
				console.log('getInvoiceDetailsApi', e);
				reject(e);
			});
	});
}

// bulk delete invoices
export function deleteInvoicesApi(data: number[]): Promise<ApiResponse> {
	return new Promise((resolve, reject) => {
		ApiService.post('/bulk-delete-invoice', { ids: data })
			.then((response: ApiResponse) => {
				resolve(response);
			})
			.catch((e: any) => {
				reject(e);
			});
	});
}

// delete single invoice
export function deleteInvoiceApi(id: number): Promise<ApiResponse> {
	return new Promise((resolve, reject) => {
		ApiService.delete(`/invoice/${id}`)
			.then((response: ApiResponse) => {
				resolve(response);
			})
			.catch((error: any) => {
				// console.log('Error occurred:', error);
				reject(error);
			});
	});
}

// bulk delete estimates
export function bulkDeleteInvoicesApi(ids: { ids: any }) {
	return new Promise((resolve, reject) => {
		ApiService.post('/bulk-delete-invoice', ids)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// download pdf estimate
export function downloadInvoiceApi(id: { id: any }) {
	// console.log('iddddd' ,  id)
	return new Promise((resolve, reject) => {
		ApiService.get(`/invoice-download-pdf`, null, id)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// get customers

export function getCustomersApi(params: {}) {
	return new Promise((resolve, reject) => {
		ApiService.get('/get-customers', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// get persons
export function getSalesPersonApi(params: {}) {
	return new Promise((resolve, reject) => {
		ApiService.get('/get-sales-persons', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// *********** Get Payment Terms *************
export function getPeymentTermsApi() {
	return new Promise((resolve, reject) => {
		ApiService.get(`/get-terms`, null, null)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				// console.log('Console Log: : error getPeymentTermsApi', e);
				reject(e);
			});
	});
}

// *********** Get single customer *************
export function customersSingleApi(id: string) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/customer/${id}`, null, null)
			.then(response => {
				// console.log('Response:', response);
				resolve(response.data);
			})
			.catch(error => {
				console.log('Error:', error);
				reject(error);
			});
	});
}

export function markAddressDefaultApi(data: {
	id: any;
	customer_id: string;
	type: any;
}) {
	return new Promise((resolve, reject) => {
		ApiService.post('/mark-address-as-default', data)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// email list in estimate
export function getEmailList(params: {
	key: string | undefined;
	id: string | undefined;
}) {
	return new Promise((resolve, reject) => {
		ApiService.get('/get-email-list', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function sendInvoiceEmailApi(data: { [x: string]: any | Blob }) {
	const formData = new FormData();

	for (const key in data) {
		if (Array.isArray(data[key])) {
			data[key].forEach((item: string | Blob, index: any) => {
				formData.append(`${key}[${index}]`, item);
			});
		} else {
			formData.append(key, data[key]);
		}
	}
	// Assuming you have a FormData dataect named 'formData'
	formData.forEach((value, key) => {
		console.log('form@@@@', key, value);
	});

	return new Promise((resolve, reject) => {
		ApiService.post(`/send-mail`, formData, '', true)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				console.log('Error occurred:', error);
				reject(error);
			});
	});
}

// create customer address
export function createCustomerAddress(data) {
	console.log('dataes', data);
	return new Promise((resolve, reject) => {
		ApiService.post('/add-customer-address', { ...data })
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// update customer address
export function updateCustomerAddressApi(data, id) {
	console.log('dataes', data);
	return new Promise((resolve, reject) => {
		ApiService.put('/update-customer-address', id, data)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
