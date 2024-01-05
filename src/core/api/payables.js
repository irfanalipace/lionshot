import ApiService from '../services/apiService';

// *********** Create Payabled *********
// create estimates
export function createPayableApi(data) {
	return new Promise((resolve, reject) => {
		ApiService.post('/purchases/account-payable', data, '', true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
// *********** update Payabled *********
export function updatePayableApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post(`/purchases/account-payable`, data, data.id, true)
      .then(response => {
        resolve(response);    // ApiService.put('/payment-received', id, data)

      })
      .catch(e => {
        reject(e);
      });

  });
}
// *********** get all Payables *********
export function getAllPayables(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/purchases/account-payable', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// *********** Get single Payabled *************
export function SinglePayableApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/purchases/account-payable`, id)
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

// *********** Delete single Payabled *************
export function deletePayableApi(id) {
	return new Promise((resolve, reject) => {
		ApiService.delete(`/purchases/account-payable`, id)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				console.log('Error occurred:', error);
				reject(error);
			});
	});
}
// *********** Delete single Payabled *************
export function deletePayableFilesApi(id) {
	return new Promise((resolve, reject) => {
		ApiService.delete(`/purchases/account-payable-file-delete`, id)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
// *********** download pdf Payabled *************
export function downloadPDFPayableApi(param) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/purchases/account-payable-download-pdf`, null, param)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}
// *********** download pdf Payabled *************
export function exportPayable(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/purchases/export-account-payable', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// *********** download pdf Payabled *************
export function getAmountPayed(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/export-payment-received', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
