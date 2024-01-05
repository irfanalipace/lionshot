import ApiService from "../services/apiService";


export function invoiceSingleApi(id) {
    return new Promise((resolve, reject)  => {
        ApiService.get(`/invoice/${id}`)
            .then(response =>  {
            // console.log('Response:', response);
            resolve(response.data);
        })
            .catch(error =>  {
            console.log('Error:', error);
            reject(error);
        });
    });
}