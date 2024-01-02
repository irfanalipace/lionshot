// get all purchase 
import ApiService from '../services/apiService';
export function getAllPurchaseordersApi() {
	return new Promise((resolve, reject) => {
		ApiService.get(`/purchases/purchase-order`, null, null)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}



export function createPurchaseOrdersApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post('/purchases/purchase-order', data, '', true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  })
}


export function updatePurchaseOrdersApi(data) {
  console.log('data' , data)
  return new Promise((resolve, reject) => {
    ApiService.post(`/purchases/purchase-order/${data.id}`, data, '', true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  })
}


export function purchaseOrdersSingleApi(id) {
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

export function bulkDeletePurchaseOrdersApi(ids) {
    return new Promise((resolve, reject) => {
      ApiService.post('/purchases/bulk-delete-purchase-orders', ids)
        .then(response => {
          resolve(response);
        })
        .catch(e => {
          reject(e);
        });
  
    });
  }

  
export function singleDeletePurchaseOrdersApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.delete(`/purchases/purchase-order/${id}`)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}

export function exportPurchaseOrdersApi(){
  return new Promise((resolve, reject) => {
    ApiService.get(`/purchases/export-purchase-order`)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}
  





export function convertToBillPurcahseOrderApi(id) {
    return new Promise((resolve, reject) => {
      ApiService.post('/purchases/convert-to-bill', {id})
        .then(response => {
          resolve(response);
        })
        .catch(e => {
          reject(e);
        });
    });
  }


  export function vendorOptionApi() {
	return new Promise((resolve, reject) => {
		ApiService.get(`/purchases/get-vendors-data`, null, null)
			.then(response => {
				resolve(response.data);
			})
			.catch(error => {
				console.log('Error:', error);
				reject(error);
			});
	});
}

export function purchaseOrdersPdfUrl(id) {
    return new Promise((resolve, reject) => {
      ApiService.get("/purchases/purchase-order-download-pdf", null , id)
        .then((response) => {
          resolve(response);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }



  export function addPurchaseOrdersFileApi(data) {
    return new Promise((resolve, reject) => {
      ApiService.post('/purchases/add-purchase-order-files', data, '', true)
        .then(response => {
          resolve(response);
        })
        .catch(e => {
          reject(e);
        });
    });
  }


  export function deletePurchaseOrdersFielsApi(id) {
    return new Promise((resolve, reject) => {
      ApiService.delete(`/purchases/purchase-order-file-delete/${id}`)
        .then(response => {
          resolve(response);
        })
        .catch(e => {
          reject(e);
        });
  
    });
  }
