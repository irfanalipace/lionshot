import ApiService from '../services/apiService';

export function getAllCustomers(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/customer', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
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

// *********** Get Currencies *************
export function getCurrenciesApi() {
	return new Promise((resolve, reject) => {
		ApiService.get(`/get-currency`, null, null)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				// console.log('Console Log: : error getCurrenciesApi', e);
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
// *********** Get Payment Terms *************
export function getTaxesApi() {
	return new Promise((resolve, reject) => {
		ApiService.get(`/get-taxes`, null, null)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				// console.log('Console Log: : error getPeymentTermsApi', e);
				reject(e);
			});
	});
}
// *********** store customer *********
export function createCustomer(customerData) {
	return new Promise((resolve, reject) => {
		ApiService.post('/customer', customerData, '', true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
// *********** update customer *********
export function UpdateCustomerApi(customerData) {
	return new Promise((resolve, reject) => {
		// ApiService.post('/customer', { ...customerData, _method: PUT }, id, true)
		ApiService.post(`/customer/${customerData.id}`, customerData, '', true)
			// ApiService.put('/customer', id, customerData)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
// *********** update customer Model *********
export function UpdateCustomerSpecificApi(id, customerData) {
	return new Promise((resolve, reject) => {
		ApiService.post('/update-customer-specific-details', id, customerData)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function updateCustomers(customerData, customerId) {
	return new Promise((resolve, reject) => {
		ApiService.put('/customer', customerData, customerId)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function deleteCustomer(customerId) {
	return new Promise((resolve, reject) => {
		ApiService.delete('/customer', customerId)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function bulkDeleteCustomer(customerIds) {
	return new Promise((resolve, reject) => {
		ApiService.post('/bulk-delete-customers', customerIds)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function exportCustomers(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/export-customers', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function importCustomers(body) {
	return new Promise((resolve, reject) => {
		ApiService.post('/import-customers', body, null, true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// Get invoices of customer
export function getCustomerInvoices(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/get-customer-invoices', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
// Get Transaction data of customer
export function getCustomerTransactions(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/get-transaction', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// delete customer files
export function deleteCustomerFilesApi(body) {
	return new Promise((resolve, reject) => {
		ApiService.post(`/delete-customer-file`, body)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
// *********** Get Statement Data *************
export function statementDataAPI(params) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/get-customer-statement`, null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				// console.log('Console Log: : error getCurrenciesApi', e);
				reject(e);
			});
	});
}
