import ApiService from "../services/apiService";

export function getAllInvoiceDateCorApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get("/get-invoice-by-date-range", null, params)
      .then((response) => {
        // We need to request for an API change.
        // Columns we need are
        // This mapped response is being translated by existing datatables.
        /**
         * {
         * * total
         * * data
         * * per_page
         * * current_page
         * }
         */

        const mappedResponse = {
          data: {
            current_page: response.currentPage,
            total: response.totalCount,
            per_page: response?.pageLimit || 50,
            data: response.invoices,
          },
        };

        resolve(mappedResponse);
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
      invoiceId
    })
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}
