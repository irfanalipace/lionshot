import ApiService from '@/utils/apiService';

export function getAllItems(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/items', null, params)
			.then((response) => {
				resolve(response);
			})
			.catch((e) => {
				reject(e);
			});
	});
}
// *********** Get single item *************
export function itemsSingleApi(id) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/items/${id}`, null, null)
			.then((response) => {
				// console.log('Response:', response);
				resolve(response.data);
			})
			.catch((error) => {
				console.log('Error:', error);
				reject(error);
			});
	});
}

// *********** store item *********
export function createItem(itemData) {
	return new Promise((resolve, reject) => {
		ApiService.post('/items', itemData)
			.then((response) => {
				resolve(response);
			})
			.catch((e) => {
				reject(e);
			});
	});
}
// *********** update item *********
export function updateItems(itemData, itemId) {
	return new Promise((resolve, reject) => {
		ApiService.put('/items', itemData, itemId)
			.then((response) => {
				resolve(response);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export function deleteItem(itemId) {
	return new Promise((resolve, reject) => {
		ApiService.delete('/items', itemId)
			.then((response) => {
				resolve(response);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export function bulkDeleteItem(itemIds) {
	return new Promise((resolve, reject) => {
		ApiService.post('/bulk-delete-items', itemIds)
			.then((response) => {
				resolve(response);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export function exportItems(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/export-items', null, params)
			.then((response) => {
				resolve(response);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export function importItems(body) {
	return new Promise((resolve, reject) => {
		console.log('sdsa');
		ApiService.post('/import-items', body, null, true)
			.then((response) => {
				resolve(response);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export function getAllItemPriceList() {
	return new Promise((resolve, reject) => {
		const resp = {
			data: {
				data: [
					{
						name: 'Customer 1',
						currency: 'USD',
						details: '40% Markup',
						rounding: 'Never mined',
						description: 'Handmade',
					},
					{
						name: 'Customer 2',
						currency: 'USD',
						details: '92% Markdown',
						rounding: 'Never mined',
						description: 'synthesize seamless back up',
					},
					{
						name: 'Customer 3',
						currency: 'USD',
						details: '40% Markup',
						rounding: 'Never mined',
						description: 'Borders Sudanese Pound',
					},
					{
						name: 'Customer 3',
						currency: 'USD',
						details: '92% Markdown',
						rounding: 'Never mined',
						description: 'synthesize seamless back up',
					},
					{
						name: 'Customer 4',
						currency: 'USD',
						details: '40% Markup',
						rounding: 'Never mined',
						description: 'Investment Account Awesome Towels navigating',
					},
					{
						name: 'Customer 5',
						currency: 'USD',
						details: '92% Markdown',
						rounding: 'Never mined',
						description: 'Investment Account Awesome Towels navigating',
					},
				],
			},
		};
		setTimeout(() => {
			resolve(resp);
		}, 1000);
	});
}
