import ApiService from '../services/apiService';

export function getAllCompanies(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/companies', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
