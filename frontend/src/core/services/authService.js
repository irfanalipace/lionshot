import ApiService from './apiService';

const TOKEN = 'token';
const USER = 'user';
const PASSWORD = 'user_password';
const USER_STATE = 'state';
const TEMP_TOKEN = 'temp_token';

export const getToken = () => {
  return window.localStorage.getItem(TOKEN);
};
export const saveToken = token => {
  window.localStorage.setItem(TOKEN, token);
};

export const saveUser = user => {
  const userDetails = { ...user, name: user.name || user.user };
  window.localStorage.setItem(USER, JSON.stringify(userDetails));
};
export const saveUserName = name => {
  let user = getUser();
  user = { ...user, name };
  saveUser(user);
};

export const saveUserImage = profile_pic => {
  let user = getUser();
  user = { ...user, profile_pic };
  saveUser(user);
};
export const saveUserID = id => {
  let user = getUser();
  user = { ...user, id };
  saveUser(user);
};

export const saveUserState = userState => {
  window.localStorage.setItem(USER_STATE, JSON.stringify(userState));
};
export const saveUserEmail = email => {
  let user = getUser();
  user = { ...user, email };
  saveUser(user);
};

export const saveTempToken = token => {
  ApiService.setHeader('Authorization', 'Bearer ' + token);
  const encodedToken = btoa(token);
  window.localStorage.setItem(TEMP_TOKEN, encodedToken);
};
export const getTempToken = () => {
  let tempToken = '';
  try {
    tempToken = atob(window.localStorage.getItem(TEMP_TOKEN));
  } catch (error) {
    tempToken = window.localStorage.getItem(TEMP_TOKEN);
  }

  return tempToken;
};

export const saveUserPassword = password => {
  const encodeedPassword = btoa(password);
  window.localStorage.setItem(PASSWORD, encodeedPassword);
};
export const getUserPassword = () => {
  let password = '';
  try {
    password = atob(window.localStorage.getItem(PASSWORD));
  } catch (error) {
    password = window.localStorage.getItem(PASSWORD);
  }
  return password;
};

export const destroyUserPassword = () =>
  window.localStorage.removeItem(PASSWORD);

export const getUser = () =>
  JSON.parse(window.localStorage.getItem(USER)) || {};

export const getUserEmail = () => {
  const user = getUser();
  return user?.email;
};
export const getUserName = () => {
  const user = getUser();
  return user?.name;
};

export const getUserImage = () => {
  const user = getUser();
  return user?.profile_pic;
};
export const getUserId = () => {
  const user = getUser();
  return user?.id;
};

export const getUserState = () =>
  JSON.parse(window.localStorage.getItem(USER_STATE));

const deleteUser = () => window.localStorage.removeItem(USER);

export const destroyTempKeys = () => {
  window.localStorage.removeItem(PASSWORD);
  window.localStorage.removeItem(TEMP_TOKEN);
};

export const destroyToken = () => {
  window.localStorage.removeItem(TOKEN);
  // deleteUser();
  // window.localStorage.removeItem(PASSWORD);
  // window.localStorage.removeItem(TEMP_TOKEN);
  // window.location.reload();
};

export default {
  getToken,
  saveToken,
  saveUser,
  destroyToken,
  deleteUser,
  getUser,
  saveUserEmail,
  saveUserName,
  saveUserImage,
  getUserImage,
  getUserName,
  getUserEmail,
  getUserId,
  saveUserPassword,
  getUserPassword,
  destroyUserPassword,
  saveTempToken,
  getTempToken,
  destroyTempKeys,
  saveUserID
};
