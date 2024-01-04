import ApiService from '../services/apiService';

export function receivablesInvoiceApi(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/dashboard', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				console.log('unpaidInvoiceApi', e);
				reject(e);
			});
	});
}

export function unpaidBillsApi() {
	return new Promise((resolve, reject) => {
		// Simulate an asynchronous API call with setTimeout
		setTimeout(() => {
			// Resolve the promise with the dummy data as an object
			resolve({
				totalUnpaidInvoices: '$6523.89',
				currentAmount: '$29,54.00',
				overdueAmount: '$66,420.00',
				progress_value: '50',
				newInvoice: 'New Invoice',
				newRecurring: 'New Recurring Invoice',
				newCustomer: 'New Customer Payment',
			});
		}, 1000); // Simulating a delay of 1 second (adjust as needed)
	});
}
