import ApiService from '../services/apiService';

export function createAccount(accountData) {
    return new Promise((resolve, reject) => {
      ApiService.post('/accounts', accountData)
        .then(response => {
          resolve(response);
        })
        .catch(e => {
          reject(e);
        });
    });
  }