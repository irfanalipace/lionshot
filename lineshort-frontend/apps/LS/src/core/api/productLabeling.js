import ApiService from '../services/apiService';

export function getAllProductLabelsAPI(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/get-product-labels', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function printLabelAPI(params) {
	return new Promise((resolve, reject) => {
		ApiService.post(`/print-single-label`, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// *********** download All Labels *************
export function bulkLabelsPrintAPI(param) {
	console.log(param);
	return new Promise((resolve, reject) => {
		ApiService.post(`/print-labels`, param)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
