import ApiService from 'core/services/apiService';
// const invoice_baseUrl = import.meta.env.VITE_APP_INVOICE_API_BASE_URL;

// delete estimates fiels
export function deleteInvoiceFielsApi(id) {
	return new Promise((resolve, reject) => {
		ApiService.delete(`/delete-invoice-file/${id}`, '', '', '')
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
export function createInvoiceApi(data) {
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
export function importInvoiceApi(data) {
	return new Promise((resolve, reject) => {
		ApiService.post('/import-invoices', data, '', true, false)
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
export function updateInvoiceApi(data) {
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
export function generateNumberApi(type) {
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
export function getAllInvoicesListApi(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/invoice', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				console.log('getAllInvoicesListApi', e);
				reject(e);
			});
	});
}

// get all invoice list
export function getInvoiceSummaryApi(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/get-invoice-dashboard', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				console.log('getAllInvoicesListApi', e);
				reject(e);
			});
	});
}

// Invoice Export
export function getAllInvoicesExportApi(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/export-invoice', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				console.log('getAllInvoicesExportApi', e);
				reject(e);
			});
	});
}

// get invoice details
export function getInvoiceDetailsApi(id) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/invoice/${id}`, '', '')
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				console.log('getInvoiceDetailsApi', e);
				reject(e);
			});
	});
}

// bulk delete invoices
export function deleteInvoicesApi(data) {
	return new Promise((resolve, reject) => {
		ApiService.post('/bulk-delete-invoice', { ids: data })
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// delete single invoice
export function deleteInvoiceApi(id) {
	return new Promise((resolve, reject) => {
		ApiService.delete(`/invoice/${id}`)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				// console.log('Error occurred:', error);
				reject(error);
			});
	});
}

// bulk delete estimates
export function bulkDeleteInvoicesApi(ids) {
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
export function downloadInvoiceApi(id) {
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

export function getCustomersApi(params) {
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
export function getSalesPersonApi(params) {
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
export function customersSingleApi(id) {
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

export function markAddressDefaultApi(data) {
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
export function getEmailList(params) {
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

export function sendInvoiceEmailApi(data) {
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
