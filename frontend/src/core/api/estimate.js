import ApiService from '../services/apiService';


// get all estimate list 
export function getAllEstimatesListApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/estimate', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}

// create estimates 
export function createEstimateApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post('/estimate', data, '', true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}


// update estimate 
export function updateEstimateApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post(`/estimate/${data.id}`, data, '', true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}


// bulk delete estimates 
export function bulkDeleteEstimatesApi(ids) {
  return new Promise((resolve, reject) => {
    ApiService.post('/bulk-delete-estimate', ids)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}


// delete single estimate 
export function deleteEstimateApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.delete(`/estimate/${id}`)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log('Error occurred:', error);
        reject(error);
      });
  });
}


// view apis / send email 

// export function sendEstimateEmailApi(data) {
//   console.log('datasend' , data)

//   const formData = new FormData();

//   for (const key in data) {
//     if (Array.isArray(data[key])) {
//       // Check if the array is empty
//       if (data[key].length === 0) {
//         alert('empty')
//         formData.append([key], []); // Append an empty string to represent the empty array
//       } else {
//         data[key].forEach((item, index) => {
//           formData.append(`${key}[${index}]`, item);
//         });
//       }
//     } else {
//       formData.append(key, data[key]);
//     }
//   }
//   return new Promise((resolve, reject) => {
//     ApiService.post(`/send-mail`, formData, '', true) 
//       .then(response => {
//         resolve(response);
//       })
//       .catch(error => {
//         console.log('Error occurred:', error);
//         reject(error);
//       });
//   });
// }



export function sendEstimateEmailApi(data) {
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
  // Assuming you have a FormData dataect named 'formData'
  // formData.forEach((value, key) => {
  //   console.log( 'form@@@@' , key, value);
  // });

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


// get customers 

export function getCustomersApi() {
  return new Promise((resolve, reject) => {
    ApiService.get('/get-customers')
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

// add customer conatct 
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


// add customer conatct 
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

// create customer address
export function createCustomerAddress(data) {
  console.log('dataes', data)
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
  console.log('dataes', data)
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

// address mark as default 
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

// show estimate / view estimates 

export function showEstimateApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/estimate/${id}`)
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



// add estimates files / view 

export function addEstimatesFileApi(data) {



  return new Promise((resolve, reject) => {
    ApiService.post('/add-estimate-files', data, '', true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// delete estimates fiels 
export function deleteEstimateFielsApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.delete(`/estimate-file-delete/${id}`)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}


// convert invoice 
export function convertToSaleOrderApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post(`/convert-to-sale-order`, data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}


// download pdf estimate 
export function downloadEstimateApi(id) {
  // console.log('iddddd' ,  id)
  return new Promise((resolve, reject) => {
    ApiService.get(`/estimate-download-pdf`, null, id)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}


// update customer tax 

export function updateCustomerTaxApi(data) {
  // const updatedData = {};
  // for (const key in data) {
  //   if (data[key] !== null && data[key] !== undefined && data[key] !== '') {   // only send those keys which are required and have values  , empty keys will be removed
  //     updatedData[key] = data[key];
  //   }
  // }
  return new Promise((resolve, reject) => {
    ApiService.post(`/update-customer-tax`, data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}



// exemptions reasons 

export function getExemtionsReasonsApi() {
  return new Promise((resolve, reject) => {
    ApiService.get(`/get-exemption-reasons`)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}


// authority options 


export function getTaxAuthoritiesApi() {
  return new Promise((resolve, reject) => {
    ApiService.get(`/get-tax-authorities`)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}






// get price list 
export function getPriceListApi() {
  return new Promise((resolve, reject) => {
    ApiService.get(`/price-list`)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}






// single order 


export function getSingeSaleOrderApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/sale-orders/${id}`)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}


export function exportEstimate(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/export-estimate', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function importEstimate(body) {
  return new Promise((resolve, reject) => {
    ApiService.post('/import-estimates', body, null, true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}








