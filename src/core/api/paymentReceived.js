import ApiService from "../services/apiService";

// *********** Create PaymentReceived *********
// create estimates 
export function createPaymentReceivedApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post('/payment-received', data, '', true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}
// *********** update PaymentReceived *********
export function updatePaymentReceivedApi(data) {
  return new Promise((resolve, reject) => {
    // ApiService.put('/payment-received', id, data)
    ApiService.post(`/payment-received/${data.id}`, data, '', true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}
// *********** getll all PaymentReceived *********
export function getAllPaymentReceived(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/payment-received', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}
// *********** getll all getAmountReceived *********
export function getAmountReceived(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/get-amount-received', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// *********** Get single PaymentReceived *************
export function SinglePaymentReceivedApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/payment-received/${id}`, null, null)
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

// *********** Delete single PaymentReceived *************
export function deletePaymentReceivedApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.delete(`/payment-received/${id}`)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log('Error occurred:', error);
        reject(error);
      });
  });
}
// *********** Delete single PaymentReceived *************
export function deletePaymentReceivedFielsApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.delete(`/payment-received-file-delete/${id}`)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}
// *********** download pdf PaymentReceived *************
export function downloadPDFPaymentReceiveApi(id) {
  // console.log('iddddd' ,  id)
  return new Promise((resolve, reject) => {
    ApiService.get(`/payment-received-download-pdf`, null, id)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}
// *********** download pdf PaymentReceived *************
export function exportPaymentReceived(params) {
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