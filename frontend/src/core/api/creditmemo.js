import ApiService from '../services/apiService';

export function getAllCreditMemo(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/credit-memo', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function ViewCreditMemo(id) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/credit-memo/${id}`, null, null)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function createCreditMemo(creditMemo) {
	return new Promise((resolve, reject) => {
		ApiService.post('/credit-memo', creditMemo, null, true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function updateCreditMemo(creditMemo, id) {
	return new Promise((resolve, reject) => {
		ApiService.post(`/credit-memo`, creditMemo, id, true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function bulkDeleteCreditMemo(Ids) {
	return new Promise((resolve, reject) => {
		ApiService.post('/bulk-delete-credit-memo', Ids)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
export function deleteCreditMemoAPI(Id) {
	return new Promise((resolve, reject) => {
		ApiService.delete(`/credit-memo/${Id}`)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function downloadCreditMemoApi(id) {
	return new Promise((resolve, reject) => {
		ApiService.get('/credit-memo-download-pdf', null, id)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function getRefundHistory(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/get-refund-histroy', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function exportCreditMemo(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/export-credit-memo', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function importCreditMemo(body) {
	return new Promise((resolve, reject) => {
		ApiService.post('/import-credit-memo', body, null, true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function CreditMemoApproved(id) {
	return new Promise((resolve, reject) => {
		ApiService.post('/approved-credit-memo', id, null)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function CreditMemoRejected(id) {
	return new Promise((resolve, reject) => {
		ApiService.post('/rejected-credit-memo', id, null)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
