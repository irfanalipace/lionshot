import ApiService from "../services/apiService";

export function getAllSaleOrders(params) {
  return new Promise((resolve, reject) => {
    ApiService.get("/sale-orders", null, params)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function viewSalesOrder(id) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/sale-orders/${id}`, null, null)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
        reject(error);
      });
  });
}

export function deleteSaleOrder(id) {
  return new Promise((resolve, reject) => {
    ApiService.delete("/sale-orders", id)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function bulkDeleteSaleOrder(Ids) {
  return new Promise((resolve, reject) => {
    ApiService.post("/bulk-delete-sale-orders", Ids)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function createSaleOrderApi(data) {
  // for (const key in data) {
  //   if (key === "estimate_items") {
  //     delete data[key];
  //   }
  // }
  return new Promise((resolve, reject) => {
    ApiService.post("/sale-orders", data, "", true)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}
export function updateSaleOrderApi(data) {
  // for (const key in data) {
  //   if (key === "estimate_items") {
  //     delete data[key];
  //   }
  // }
  return new Promise((resolve, reject) => {
    ApiService.post(`/sale-orders/${data.id}`, data, "", true)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}


export function deleteSalesOrderFielApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.delete(`/sale-order-file-delete/${id}`)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}



export function addSalesOrderFielApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post("/add-sale-order-files", data, "", true)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getPdfUrlApi(id) {
  return new Promise((resolve, reject) => {
    ApiService.get("/sale-order-download-pdf", null , id )
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function exportSaleOrder(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/export-sale-orders', null, params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function importSaleOrder(body) {
  return new Promise((resolve, reject) => {
    console.log("sdsa")
    ApiService.post('/import-sale-orders', body, null, true)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}




// convert invoice 
export function convertingToInvoiceApi(data) {
  return new Promise((resolve, reject) => {
    ApiService.post(`/convert-to-invoice` , data)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
   
  });
}