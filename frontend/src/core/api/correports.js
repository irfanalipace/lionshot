import ApiService from "../services/apiService";

export function getAllInvoiceDateCorApi(params, page = 1) {
  return new Promise((resolve, reject) => {
        ApiService.get("/get-invoice-by-date-range", null, { ...params, page })
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

/**
 * Gets data related to the said invoiceId;
 *  !we have commented it out because we have to use the static data for now,
 *  !Please replace "static invoice ID i.e. 870319" with invoiceId param
 * @param {int} invoiceId
 * @returns
 *  {JSON} invoiceData
 */
export function getViewInovice(invoiceId) {
  return new Promise((resolve, reject) => {
    ApiService.get("/get-invoice-by-internal-id", null, {
      invoiceId: "870319", //invoiceId,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}
