import ApiService from '../services/apiService';

// *********** Get all Departments *************
export function getDepartmentsApi() {
	return new Promise((resolve, reject) => {
		ApiService.get(`/departments`, null, null)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				// console.log('Console Log: : error getAllCitiesApi', e);
				reject(e);
			});
	});
}

export function CreateDepartment(DepartmentData) {
	return new Promise((resolve, reject) => {
		ApiService.post('/departments', DepartmentData, '', true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function deleteDepartment(DepartmentId) {
	return new Promise((resolve, reject) => {
		ApiService.delete('/departments', DepartmentId)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function UpdateDepartment(DepartmentData) {
	return new Promise((resolve, reject) => {
		ApiService.put(`/departments`, DepartmentData?.id, DepartmentData)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function getDepartmentNameApi(id) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/departments/${id}`, null, null)
			.then(response => {
				resolve(response.data);
			})
			.catch(error => {
				reject(error);
			});
	});
}
