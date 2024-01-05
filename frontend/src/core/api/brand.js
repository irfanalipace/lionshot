import ApiService from '../services/apiService';
///All Brand Items
export function getBrandItem(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/brand', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
///Single Brand Delete Items

export function deleteItem(itemId) {
	return new Promise((resolve, reject) => {
		ApiService.delete('/brand', itemId)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

///All Brand Item Delete

export function bulkDeleteItem(itemIds) {
	return new Promise((resolve, reject) => {
		ApiService.post('/bulk-delete-brand', itemIds)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
