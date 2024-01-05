import ApiService from '../services/apiService';

// *********** Get Payment Terms *************
export function getPeymentTermsApi() {
  return new Promise((resolve, reject) => {
    ApiService.get(`/get-terms`)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        // console.log('Console Log: : error getPeymentTermsApi', e);
        reject(e);
      });
  });
}

// *********** Stor Payment Terms *************
export function storePeymentTermsApi(body) {
  return new Promise((resolve, reject) => {
    ApiService.post(`/terms`, body)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        // console.log('Console Log: : error getPeymentTermsApi', e);
        reject(e);
      });
  });
}
// *********** Get Taxes *************
export function getTaxesApi() {
  return new Promise((resolve, reject) => {
    ApiService.get(`/get-taxes`)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        // console.log('Console Log: : error getPeymentTermsApi', e);
        reject(e);
      });
  });
}

// *********** Delete Taxes *************
export function deleteTermsApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.delete(`/terms`, id)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        console.log('Console Log: : error deleteTermsApi', e);
        reject(e);
      });
  });
}

// *********** Mark Term as Default *************
export function markTermAsDefaultApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post(`/mark-default-payment-terms`, data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        console.log('Console Log: : error markTermAsDefaultApi', e);
        reject(e);
      });
  });
}
