import ApiService from "../services/apiService";

export function getCustomerDetailsApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get("/customer-details", null, params)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function updateCustomerDetailsApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.post("/update-customer-profile", params, "", true)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

// graph data

export function getCustomerGraphApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get("/get-graph-data", null, params)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getCustomerDashboardApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get("/get-dashboard", null, params)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}


export function updateCustomerProfileApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.post("/update-customer-profile", params, "", true)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

