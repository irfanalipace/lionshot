
import ApiService from "../services/apiService";

export function getAllInvoiceDateCorApi(params) {
  return new Promise((resolve, reject) => {
    ApiService.get('/get-invoice-by-date-range', null, params)
      .then(response => {
      
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });

  });
}


// const resp = {
//     data: {
//       data: [
//         // Your sample data goes here
//         { id:1, invoice: 'A12DE2' },
//         { id:2, invoice: 'N12DE2'},
//         {  id:3, invoice: 'C14DE2' },
//         {  id:4, invoice: 'N12DHN'},
//         // Add more sample data as needed
//       ]
//     }
//   };
   
//   export function CorApi() {
//     return new Promise((resolve, reject) => {
//       // Simulating an API call with setTimeout
//       setTimeout(() => {
//         resolve(resp);
//         // You can also simulate an error condition if needed
//         // reject(new Error('Simulated API error'));
//       }, 1000); // Simulating a 1-second delay
//     });
//   }