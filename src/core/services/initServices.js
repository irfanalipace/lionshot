import ApiService from './apiService';
import { setUserTracking } from './cookiesService';

const initServices = {
  init() {
    setUserTracking(); // sets user visit data in cookies
    ApiService.init(); //initializes api service
  }
};

initServices.init();

export default initServices;
