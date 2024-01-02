import ApiService from '../services/apiService';

export function getAllBrandsApi() {
	return new Promise((resolve, reject) => {
		ApiService.get(`/brand`, null, null)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
