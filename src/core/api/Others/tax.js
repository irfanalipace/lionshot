import ApiService from "../../services/apiService";

// *********** Store Tax *********

export function createTax(TaxData) {
    return new Promise((resolve, reject) => {
      ApiService.post('/taxes', TaxData)
        .then(response => {
          resolve(response);
        })
        .catch(e => {
          reject(e);
        });
    });
  }