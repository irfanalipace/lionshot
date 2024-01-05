import ApiService from '../services/apiService';

export function getAllMarketPlace(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/marketplace', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
