import ApiService from '../services/apiService';

export function getAllUsers(params) {
	return new Promise((resolve, reject) => {
		ApiService.get('/users', null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
export function UpdateUser(UserData) {
	return new Promise((resolve, reject) => {
		console.log('UserData', UserData);
		ApiService.put(`/users`, UserData)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}
