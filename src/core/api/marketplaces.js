import ApiService from '../services/apiService';

// *********** Get All Marketplace *************
// export function getAllMarketplacesApi() {
// 	return new Promise((resolve, reject) => {
// 		ApiService.get(`/marketplace`)
// 			.then(response => {
// 				console.log('Response:', response);
// 				resolve(response);
// 			})
// 			.catch(error => {
// 				console.log('Error:', error);
// 				reject(error);
// 			});
// 	});
// }

export function getAllMarketplacesApi(params) {
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

// *********** Create Marketplace *********
export function CreateMarketplace(marketplaceData) {
	return new Promise((resolve, reject) => {
		ApiService.post('/marketplace', marketplaceData, '', true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// *********** Update Marketplace *********
export function UpdateMarketplace(marketplaceData) {
	return new Promise((resolve, reject) => {
		console.log('UpdateMarketplace id', marketplaceData?.id);
		ApiService.post(
			`/marketplace/${marketplaceData?.id}`,
			marketplaceData,
			'',
			true
		)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// *********** Show Marketplace Detail *********
export function GetMarketplacesDetail(id) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/marketplace/${id}`, null, null)
			.then(response => {
				// console.log('Response:', response);
				resolve(response.data);
			})
			.catch(error => {
				console.log('Error:', error);
				reject(error);
			});
	});
}

// *********** Delete Marketplace *********

export function deleteMarketplace(Id) {
	return new Promise((resolve, reject) => {
		ApiService.delete('/marketplace', Id)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// Bulk Delete Marketplace
export function bulkDeleteMarketplace(ids) {
	return new Promise((resolve, reject) => {
		ApiService.post('/bulk-delete-marketplace', ids)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// Bulk Update Status
export function BulkUpdateStatusMarketplace(ids) {
	return new Promise((resolve, reject) => {
		ApiService.post('/bulk-actions-marketplace', ids)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
