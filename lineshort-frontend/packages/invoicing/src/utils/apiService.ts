import axios from 'axios';
// import { toast } from 'react-toastify';
// import { destroyToken } from './authService';

const ACCEPTED_ERROR_CODES: number[] = [400, 401, 403, 422];

const ApiService = {
	instance: null as any,
	init(getToken?: () => string) {
		if (!this.instance) {
			this.instance = axios.create({ withCredentials: false });
			// @ts-ignore
			this.instance.defaults.baseURL = import.meta.env.VITE_APP_API_BASE_URL;
			// @ts-ignore
			console.log('api url: ', import.meta.env.VITE_APP_API_BASE_URL);
			// this.instance.defaults.headers['content-type'] = 'application/json';
			console.log('token logged', getToken);
			this.instance.defaults.headers['Authorization'] = null;
			this.refreshToken = getToken;
		}
	},

	setHeader(header: string, val: string) {
		this.instance.defaults.headers[header] = val;
	},

	setAuthToken(token: string) {
		if (this.instance)
			this.instance.defaults.headers['Authorization'] = `Bearer ${token}`;
	},

	// @ts-ignore
	setDefaultBaseUrl(url: string = import.meta.env.VITE_APP_API_BASE_URL) {
		if (this.instance) this.instance.defaults.baseURL = url;
	},

	get(
		resource: string,
		slug = null,
		params: any = {},
		baseURL?: string
	): Promise<any> {
		return new Promise((resolve, reject) => {
			const url = `${resource}${slug ? `/${slug}` : ''}`;
			if (baseURL) this.setDefaultBaseUrl(baseURL);
			console.log(
				'🚀 ~ file: apiService.ts:46 ~ returnnewPromise ~ this.refreshToken:',
				this
			);
			console.log(
				'🚀 ~ file: apiService.ts:46 ~ returnnewPromise ~ this.refreshToken():',
				this.refreshToken()
			);
			this.setAuthToken(this.refreshToken());
			this.instance
				.get(url, { params })
				.then((res: any) => {
					resolve(res.data);
				})
				.catch((error: any) => {
					if (error?.response?.status === 401) {
						// destroyToken();
					}
					if (!ACCEPTED_ERROR_CODES.includes(error?.response?.status)) {
						// toast.error('Something Went Wrong');
					}
					reject(error?.response);
				});
			if (baseURL) this.setDefaultBaseUrl();
		});
	},

	post(
		resource: string,
		params: any = {},
		slug = '',
		isFormData = false,
		baseURL?: string
	): Promise<any> {
		return new Promise((resolve, reject) => {
			if (baseURL) this.setDefaultBaseUrl(baseURL);
			this.setAuthToken(this.refreshToken());
			const headers = isFormData
				? { 'Content-Type': 'multipart/form-data' }
				: { 'Content-Type': 'application/json' };
			this.instance
				.post(`${resource}${slug ? `/${slug}` : ''}`, params, { headers })
				.then((res: any) => {
					resolve(res.data);
				})
				.catch((error: any) => {
					if (error?.response?.status === 401) {
						// destroyToken();
					}
					if (!ACCEPTED_ERROR_CODES.includes(error?.response?.status)) {
						// toast.error('Something Went Wrong');
					}
					reject(error?.response);
				});
			if (baseURL) this.setDefaultBaseUrl();
		});
	},

	put(
		resource: string,
		slug = '',
		params: any = {},
		isFormData = false
	): Promise<any> {
		const headers = isFormData
			? { 'Content-Type': 'multipart/form-data' }
			: { 'Content-Type': 'application/json' };
		return new Promise((resolve, reject) => {
			this.setAuthToken(this.refreshToken());
			this.instance
				.put(`${resource}${slug ? `/${slug}` : ''}`, params, { headers })
				.then((res: any) => {
					resolve(res.data);
				})
				.catch((error: any) => {
					if (error?.response?.status === 401) {
						// destroyToken();
					}
					if (ACCEPTED_ERROR_CODES.includes(error?.response?.status)) {
						// toast.error('Something Went Wrong');
					}
					reject(error?.response);
				});
		});
	},

	delete(
		resource: string,
		slug = '',
		params: any = {},
		isFormData = false
	): Promise<any> {
		const headers = isFormData
			? { 'Content-Type': 'multipart/form-data' }
			: { 'Content-Type': 'application/json' };

		return new Promise((resolve, reject) => {
			this.setAuthToken(this.refreshToken());
			this.instance
				.delete(`${resource}${slug ? `/${slug}` : ''}`, params)
				.then((res: any) => {
					resolve(res.data);
				})
				.catch((error: any) => {
					if (error?.response?.status === 401) {
						// destroyToken();
					}
					if (ACCEPTED_ERROR_CODES.includes(error?.response?.status)) {
						// toast.error('Something Went Wrong');
					}
					reject(error?.response);
				});
		});
	},
};

// ApiService.init();

export default ApiService;
