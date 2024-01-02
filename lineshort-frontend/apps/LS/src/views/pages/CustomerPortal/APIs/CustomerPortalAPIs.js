import ApiService from '../../../../core/services/apiService';

// Define your response structure here
// Example: const data = null;

// get all invoice list

export function getCustomerPriceQuote(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/get-estimate', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function showCustomerPriceQuoteApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/view-estimate`, null, data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function acceptPriceQuoteApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post('/accept-estimate', data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function declinePriceQuoteApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post('/decline-estimate', data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function downloadCustomerPriceQuoteApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.get('/download-estimate-pdf', null, data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// Sales Orders

export function getCustomerSalesOrderApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/get-sales-order', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// get specific sale order / view
export function showCustomerSaleOrderApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/view-sales-order`, null, params)
      .then(response => {
        resolve(response?.data);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function acceptSalesOrderApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post('/accept-sales-order', data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function declineSalesOrderApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post('/decline-sales-order', data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function downloadCustomerSalesApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.get('/download-sale-order-pdf', null, data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// create invoice
export function createInvoiceApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post('/invoice', data, '', true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// import invoice
export function importInvoiceApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post('/import-invoices', data, '', true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// add customer contact
export function addCustomerContactApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post('/add-customer-contact', data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// update invoice
export function updateInvoiceApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post(`/invoice/${data.id}`, data, '', true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// add customer contact
export function generateNumberApi(type) {
  return new Promise((resolve, reject) => {
    ApiService.post('/generate-number', type)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// get all invoice list
export function getAllInvoicesListApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/invoice', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        console.log('getAllInvoicesListApi', e);
        reject(e);
      });
  });
}

// get all invoice list
export function getInvoiceSummaryApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/get-invoice-dashboard', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        console.log('getAllInvoicesListApi', e);
        reject(e);
      });
  });
}

// Invoice Export
export function getAllInvoicesExportApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/export-invoice', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        console.log('getAllInvoicesExportApi', e);
        reject(e);
      });
  });
}

// get invoice details
export function getInvoiceDetailsApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/invoice/${id}`)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        console.log('getInvoiceDetailsApi', e);
        reject(e);
      });
  });
}

// bulk delete invoices
export function deleteInvoicesApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post('/bulk-delete-invoice', { ids: data })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// delete single invoice
export function deleteInvoiceApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.delete(`/invoice/${id}`)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// bulk delete estimates
export function bulkDeleteInvoicesApi(ids) {
  return new Promise((resolve, reject) => {
    ApiService.post('/bulk-delete-invoice', ids)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// download pdf estimate
export function downloadInvoiceApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/invoice-download-pdf`, null, id)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// get customers
export function getCustomersApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/get-customers', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// get persons
export function getSalesPersonApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/get-sales-persons', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// Get Payment Terms
export function getPeymentTermsApi() {
  return new Promise((resolve, reject) => {
    ApiService.get(`/get-terms`, null, null)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// Get single customer
export function customersSingleApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/customer/${id}`, null, null)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.log('Error:', error);
        reject(error);
      });
  });
}

export function markAddressDefaultApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post('/mark-address-as-default', data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// email list in estimate
export function getEmailList(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/get-email-list', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function sendInvoiceEmailApi(data) {
  const formData = new FormData();

  for (const key in data) {
    if (Array.isArray(data[key])) {
      data[key].forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else {
      formData.append(key, data[key]);
    }
  }

  formData.forEach((value, key) => {
    console.log('form@@@@', key, value);
  });

  return new Promise((resolve, reject) => {
    ApiService.post(`/send-mail`, formData, '', true)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log('Error occurred:', error);
        reject(error);
      });
  });
}

// create customer address
export function createCustomerAddress(data) {
  console.log('dataes', data);
  return new Promise((resolve, reject) => {
    ApiService.post('/add-customer-address', { ...data })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// update customer address
export function updateCustomerAddressApi(data, id) {
  console.log('dataes', data);
  return new Promise((resolve, reject) => {
    ApiService.put('/update-customer-address', id, data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// get all Refund Requests list
export function getAllRefundRequestsListApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/get-credit-memo', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        console.log('getAllRefundRequestsListApi', e);
        reject(e);
      });
  });
}
// get all Refund History list
export function getAllRefundHistory(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/get-customer-refund-history', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        console.log('getAllRefundHistory', e);
        reject(e);
      });
  });
}

export function ViewRefundRequest(params) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/view-credit-memo/`, null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function createRefundRequest(RefundRequestData) {
  return new Promise((resolve, reject) => {
    ApiService.post('/create-credit-memo', RefundRequestData, null, true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function updateRefundRequest(RefundRequestData, id) {
  return new Promise((resolve, reject) => {
    ApiService.post(`/update-credit-memo`, RefundRequestData, id, true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function downloadRefundRequestApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/download-refund-request-pdf`, null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// delete creditmemo fiels
export function deleteCreditmemoFielsApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.delete(`/delete-credit-memo-file/${id}`)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}
