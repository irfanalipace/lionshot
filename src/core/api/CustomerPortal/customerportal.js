import ApiService from '../../services/apiService';

export function getAllInvoicesDashboardListApi(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/get-invoice', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				console.log('getAllInvoicesListApi', e);
				reject(e);
			});
	});
}
//inovicing view details

export function getInvoiceDashboardDetailsApi(data) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/view-invoice`, null, data)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function downloadInvoiceDashboradApi(data) {
	return new Promise((resolve, reject) => {
		ApiService.get('/download-invoice-pdf', null, data)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function getInvoiceDetailsApi(id) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/invoice/${id}`)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				console.log('getInvoiceDetailsApi', e);
				reject(e);
			});
	});
}

export function downloadInvoiceApi(id) {
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
