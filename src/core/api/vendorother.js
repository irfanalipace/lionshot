
import ApiService from '../services/apiService';


export function vendorSingleApi(id) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/purchases/purchase-order/${id}`, null, null)
			.then(response => {
				resolve(response.data);
			})
			.catch(error => {
				console.log('Error:', error);
				reject(error);
			});
	});
}