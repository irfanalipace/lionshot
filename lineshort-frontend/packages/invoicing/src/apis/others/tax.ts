import ApiService from '@/utils/apiService';

// *********** Store Tax *********

export function createTax(TaxData: {
	name: string;
	rate: number;
	authority: string;
}) {
	return new Promise((resolve, reject) => {
		ApiService.post('/taxes', TaxData)
			.then((response) => {
				resolve(response);
			})
			.catch((e) => {
				reject(e);
			});
	});
}
