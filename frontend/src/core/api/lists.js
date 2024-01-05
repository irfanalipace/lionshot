import ApiService from "../services/apiService";

// *********** Get all states *************
export function getAllStatesApi() {
  return new Promise((resolve, reject) => {
    ApiService.get(`/get-states`, null, null)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        // console.log('Console Log: : error getAllStatesApi', e);
        reject(e);
      });
  });
}
// *********** Get all cities *************
export function getAllCitiesApi() {
  return new Promise((resolve, reject) => {
    ApiService.get(`/get-states-wt-cities`, null, null)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        // console.log('Console Log: : error getAllCitiesApi', e);
        reject(e);
      });
  });
}
// *********** Get Currencies *************
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

export function getAllAccounts() {
  return new Promise((resolve, reject) => {
    ApiService.get('/accounts')
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function getUnits() {
  return new Promise((resolve, reject) => {
    ApiService.get('/get-units')
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}
