import ApiService from '../services/apiService';
///All Conditions
export function getCondition(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/condition', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
///create the conditions items

export function createConditions(conditionsData) {
	return new Promise((resolve, reject) => {
		ApiService.post('/condition', conditionsData, '', true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// *********** Update conditions *********
export function UpdateCondition(conditionsData) {
	return new Promise((resolve, reject) => {
		ApiService.put(`/condition/${conditionsData.id}`, '', conditionsData)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// *********** Show conditions Detail *********
export function GetConditionsDetail(id) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/condition/${id}`, null, null)
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

// *********** Delete Condition *********

export function deleteCondition(Id) {
	return new Promise((resolve, reject) => {
		ApiService.delete('/condition', Id)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
