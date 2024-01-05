import ApiService from '../services/apiService';

// Define your initial dummy array data
export function getAllBillsApi(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/purchases/bills', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function updateBillApi(data) {
	return new Promise((resolve, reject) => {
		// ApiService.post('/customer', { ...customerData, _method: PUT }, id, true)
		ApiService.post(`/purchases/bills/${data.id}`, data, '', true)
			// ApiService.put('/customer', id, customerData)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function billSingleApi(id) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/purchases/bills/${id}`)
			.then(response => {
				resolve(response.data);
			})
			.catch(error => {
				console.log('Error:', error);
				reject(error);
			});
	});
}

// create Bill
export function createBillApi(data) {
	return new Promise((resolve, reject) => {
		ApiService.post('/purchases/bills', data, '', true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function bulkDeleteBill(itemIds) {
	return new Promise((resolve, reject) => {
		ApiService.post('/purchases/bulk-delete-bills', itemIds)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function exportBills(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/purchases/export-bill', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// delete bill files
export function deleteBillFielsApi(id) {
	return new Promise((resolve, reject) => {
		ApiService.delete(`/purchases/bill-file-delete/${id}`)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function downloadBillPdfApi(id) {
	// console.log('iddddd' ,  id)
	return new Promise((resolve, reject) => {
		ApiService.get(`/purchases/bill-download-pdf`, null, id)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
