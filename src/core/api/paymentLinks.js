import ApiService from "../services/apiService";

// *********** store PaymentLink *********
export function createPaymentLink(PaymentLinkData) {
  return new Promise((resolve, reject) => {
    ApiService.post('/payment-link', PaymentLinkData)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}
// *********** update PaymentLink *********
export function UpdatePaymentLink(id, PaymentLinkData) {
  return new Promise((resolve, reject) => {
    ApiService.put('/payment-link', id, PaymentLinkData)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}
// *********** getll all PaymentLink *********
export function getAllPaymentLinks(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/payment-link', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// *********** Get single paymentLink *************
export function SinglePaymentLinkApi(id) {
    return new Promise((resolve, reject) => {
      ApiService.get(`/payment-link/${id}`, null, null)
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
// *********** Delete paymentLink *************
  export function deletePaymentLink(paymentLinkId) {
    return new Promise((resolve, reject) => {
      ApiService.delete('/payment-link', paymentLinkId)
        .then(response => {
          resolve(response);
        })
        .catch(e => {
          reject(e);
        });
    });
  }