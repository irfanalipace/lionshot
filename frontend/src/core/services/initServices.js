import ApiService from './apiService';
import { setUserTracking } from './cookiesService';
 
const initServices = {
  init(navigate) {
    setUserTracking(); // sets user visit data in cookies
    ApiService.init(navigate); //initializes api service
  }
};
 
initServices.init();
 
export default initServices;