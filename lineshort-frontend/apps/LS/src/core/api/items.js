import ApiService from '../services/apiService';

export function getAllItems(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/items', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// *********** Search items *************
export function searchItems(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/search-items', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}
// *********** Get single item *************
export function itemsSingleApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/items/${id}`, null, null)
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

// *********** store item *********
export function createItem(itemData) {
  return new Promise((resolve, reject) => {
    ApiService.post('/items', itemData, '', true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}
// *********** update item *********
export function updateItems(itemData, itemId) {
  return new Promise((resolve, reject) => {
    ApiService.post('/items', itemData, itemId, true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function deleteItem(itemId) {
  return new Promise((resolve, reject) => {
    ApiService.delete('/items', itemId)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function bulkDeleteItem(itemIds) {
  return new Promise((resolve, reject) => {
    ApiService.post('/bulk-delete-items', itemIds)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function exportItems(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/export-items', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function importItems(body) {
  return new Promise((resolve, reject) => {
    console.log('sdsa');
    ApiService.post('/import-items', body, null, true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

////pricelist items

export function getAllItemPriceList(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/price-list', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

///price-List New Form

export function createPriceList(data) {
  // Accept 'data' as a parameter
  return new Promise((resolve, reject) => {
    ApiService.post('/price-list', data) // Pass 'data' as the second argument
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

//get currency
export function getCurrenciesApi() {
  return new Promise((resolve, reject) => {
    ApiService.get(`/get-currency`, null, null)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        // console.log('Console Log: : error getCurrenciesApi', e);
        reject(e);
      });
  });
}

export function getRoundofApi() {
  return new Promise((resolve, reject) => {
    ApiService.get(`/get-round-off-values`, null, null)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        // console.log('Console Log: : error getCurrenciesApi', e);
        reject(e);
      });
  });
}

////delete items
export function deletePriceItem(itemId) {
  return new Promise((resolve, reject) => {
    ApiService.delete('/price-list', itemId)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function bulkdeletePriceListApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post('/bulk-delete-price-list', data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function ShowPriceListApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/price-list/${id}`)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function updatePriceList(data) {
  return new Promise((resolve, reject) => {
    ApiService.put(`/price-list/${data.id}`, '', data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

////delete item file
export function deleteItemFile(id) {
  return new Promise((resolve, reject) => {
    ApiService.post('/delete-item-file', { id })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

////inventory summary
export function inventorySummaryApi() {
  return new Promise((resolve, reject) => {
    ApiService.get('/get-summary')
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}
