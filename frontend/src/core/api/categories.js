import ApiService from '../services/apiService';

// export function getAllCategoriesApi() {
// 	return new Promise((resolve, reject) => {
// 		ApiService.get(`/category`, null, null)
// 			.then(response => {
// 				resolve(response);
// 			})
// 			.catch(e => {
// 				reject(e);
// 			});
// 	});
// }

///////
export function getAllCategoriesApi(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/category', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function deleteCategoriesApi(id) {
	return new Promise((resolve, reject) => {
		ApiService.delete(`/category/${id}`)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function bulkDeleteCategoriesApi(ids) {
	return new Promise((resolve, reject) => {
		ApiService.post(`/bulk-delete-category`, ids)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function changeStatusCategoriesApi(data) {
	return new Promise((resolve, reject) => {
		ApiService.post(`/bulk-action-category`, data)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
