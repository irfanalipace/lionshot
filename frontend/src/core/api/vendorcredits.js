import ApiService from '../services/apiService';


const vendorData = {
    vendor_credit_number:'VC-MN-939',
    sub_total: 100,
    tax_amount: 0,
    discount: 50,
    shipping_charges: 20,
    adjustment: 30,
    total: 200,
    status: 'draft',
    vendor_credit_items: [
      { item_name: 'something', quantity: '2', uom: 2, rate: 20, total: 40 },
      { item_name: 'something', quantity: '2', uom: 2, rate: 20, total: 40 },
      { item_name: 'something', quantity: '2', uom: 2, rate: 20, total: 40 },
    ],
}
export function getAllVendorCredits(params) {
  return new Promise((resolve, reject) => {
		ApiService.get('/purchases/vendor-credit', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function ViewVendorCredit(id) {
  return new Promise((resolve, reject) => {
    // setTimeout(() => {
    //   resolve({data:{...vendorData, id}});
    // }, 1000);
    ApiService.get(`/purchases/vendor-credit`, id)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}

export function createVendorCredit(creditMemo) {
  return new Promise((resolve, reject) => {
    ApiService.post('/purchases/vendor-credit', creditMemo, null, true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function updateVendorCredit(creditMemo, id) {
  return new Promise((resolve, reject) => {
    ApiService.post(`/purchases/vendor-credit`, creditMemo, id, true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}
export function deleteVendorCredit( id) {
  return new Promise((resolve, reject) => {
    ApiService.delete(`/purchases/vendor-credit`, id)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function bulkDeleteVendorCredits(Ids) {
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

export function downloadVendorCreditApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.get('/purchases/vendor-credit-download-pdf', null, id)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function exportVendorCredits(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/purchases/export-vendor-credit', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function importVendorCredits(body) {
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


export function GetVendorCreditBills(id) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/purchases/vendor-bills/${id}`, null, null)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function deleteVendorCreditApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.delete(`/vendor-credit-file-delete/${id}`)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}