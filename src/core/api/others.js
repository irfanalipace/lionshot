import ApiService from '../services/apiService';

// Ger Column names of a module
export function getColumnNamesApi(table) {
	return new Promise((resolve, reject) => {
		ApiService.get('/get-columns-name', null, { table })
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
// *********** Get all countries *************
export function getAllCountriesApi() {
	return new Promise((resolve, reject) => {
		ApiService.get(`/get-countries`, null, null)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				// console.log('Console Log: : error getAllCountriesApi', e);
				reject(e);
			});
	});
}
// *********** Get all states *************

export function getAllStatesApi(params) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/get-states`, null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				// console.log('Console Log: : error getAllStatesApi', e);
				reject(e);
			});
	});
}

// *********** Get all cities *************
export function getAllCitiesApi() {
	return new Promise((resolve, reject) => {
		ApiService.get(`/get-states-wt-cities`, null, null)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				// console.log('Console Log: : error getAllCitiesApi', e);
				reject(e);
			});
	});
}
