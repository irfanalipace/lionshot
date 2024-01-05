import ApiService from '../services/apiService';

// Define your initial dummy array data
export function getAllStocksApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/workorder', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function StockSingleApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/workorder/${id}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.log('Error:', error);
        reject(error);
      });
  });
}

export function createWorkOrderApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post(`/create-workorder-items`, data)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.log('Error:', error);
        reject(error);
      });
  });
}
