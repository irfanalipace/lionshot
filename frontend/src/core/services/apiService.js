import axios from 'axios';
import { destroyToken } from './authService';
import notyf from '../../views/Components/NotificationMessage/notyfInstance';

/**
 * Service to call HTTP request via Axios
 */

const ACCEPTED_ERROR_CODES = [400, 401, 403, 422];
let isRateLimited = false;
let rateLimitTimestamp = 0;
const ApiService = {
  instance: null,
  init() {
    if (!this.instance) {
      this.instance = axios.create();
      this.instance.defaults.baseURL = import.meta.env.VITE_APP_API_BASE_URL;
      this.instance.defaults.headers['content-type'] = 'application/json';
    }
  },

  /**
   * Set the default HTTP request headers
   */

  setHeader(header, val) {
    this.instance.defaults.headers[header] = val;
  },

  // set token  in header
  setAuthToken(token) {
    this.instance.defaults.headers['Authorization'] = `Bearer ${token}`;
  },

  /**
   * Set the default Base URL of api requests
   */

  setDefaultBaseUrl(url = import.meta.env.VITE_APP_API_BASE_URL) {
    this.instance.defaults.baseURL = url;
  },

  /**
   * Set the default Base URL of api requests =  OTO BAse URL
   */

  setOTOBaseUrl() {
    this.instance.defaults.baseUrl = import.meta.env.VITE_APP_OTO_BASE_URL;
  },

  /**
   * Check if the user is currently rate limited
   * @returns {boolean}
   */
  isRateLimited() {
    return isRateLimited && Date.now() < rateLimitTimestamp + 10000;
  },

  /**
   * Set the rate limit and update timestamp
   */
  setRateLimit() {
    isRateLimited = true;
    rateLimitTimestamp = Date.now();
  },

  /**
   * Reset the rate limit and timestamp
   */
  resetRateLimit() {
    isRateLimited = false;
    rateLimitTimestamp = 0;
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {*}
   */

  get(resource, slug = '', params = {}, baseURL) {
    return new Promise((resolve, reject) => {
      const url = `${resource}${slug ? `/${slug}` : ''}`;
      if (baseURL) this.setDefaultBaseUrl(baseURL);
      if (this.isRateLimited()) {
        // If rate limited, show notification and reject the promise
        notyf.error('Too many requests. Please wait.');
        reject({ status: 429, message: 'Too many requests. Please wait.' });
        return;
      }

      this.instance
        .get(url, { params })
        .then(res => {
          // If successful response, reset the rate limiting flag and timestamp
          this.resetRateLimit();
          resolve(res.data);
        })
        .catch(error => {
          if (error?.response?.status === 429) {
            // If 429 error, set rate limiting flag and update timestamp
            notyf.error('Too many requests. Please wait.');
            this.setRateLimit();
            // Show notification or handle as needed
          }

          if (error?.response?.status === 401) {
            destroyToken();
            window.location.reload();
          }

          if (!ACCEPTED_ERROR_CODES.includes(error?.response?.status)) {
            // notyf.error('Something Went Wrong');
          }
          reject(error?.response);
        });

      if (baseURL) this.setDefaultBaseUrl();
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */

  post(resource, params = {}, slug = '', isFormData = false, baseURL) {
    return new Promise((resolve, reject) => {
      if (baseURL) this.setDefaultBaseUrl(baseURL);
      const headers = isFormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };
      this.instance
        .post(`${resource}${slug ? `/${slug}` : ''}`, params, { headers })
        .then(res => {
          resolve(res.data);
        })
        .catch(error => {
          // console.print('error status: ', error?.response?.status);
          if (error?.response?.status === 401) {
            destroyToken();
            window.location.reload();
          }
          if (!ACCEPTED_ERROR_CODES.includes(error?.response?.status)) {
            // notyf.error('Something Went Wrong');
          }
          reject(error?.response);
        });
      if (baseURL) this.setDefaultBaseUrl();
    });
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */

  put(resource, slug = '', params = {}, isFormData = false) {
    const headers = isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' };
    return new Promise((resolve, reject) => {
      this.instance
        .put(`${resource}${slug ? `/${slug}` : ''}`, params, { headers })
        .then(res => {
          resolve(res.data);
        })
        .catch((error, status) => {
          if (error?.response?.status === 401) {
            destroyToken();
            window.location.reload();
          }
          if (ACCEPTED_ERROR_CODES.includes(error?.response?.status)) {
            // notyf.error('Something Went Wrong');
          }
          reject(error?.response);
        });
    });
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */

  delete(resource, slug = '', params = {}, isFormData = false, baseURL) {
    const headers = isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' };

    return new Promise((resolve, reject) => {
      if (baseURL) this.setDefaultBaseUrl(baseURL);
      this.instance
        .delete(`${resource}${slug ? `/${slug}` : ''}`, params)
        .then(res => {
          resolve(res.data);
        })
        .catch(error => {
          if (error?.response?.status === 401) {
            destroyToken();
            window.location.reload();
          }
          if (ACCEPTED_ERROR_CODES.includes(error?.response?.status)) {
            // notyf.error('Something Went Wrong');
          }
          reject(error?.response);
        });
    });
  }
};

export default ApiService;
