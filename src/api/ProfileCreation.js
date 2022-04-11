import axios from'axios';

const API = axios.create({baseURL : "https://adoose-backend.herokuapp.com"});


export const getProfileData = data => API.post('/profile/getProfileData',data);
export const checkUsernameAvailability = data =>API.post('/profile/checkUsernameAvailability',data);
export const saveUserName = data => API.post('/profile/saveUserName',data);
export const saveGender = data => API.post('/profile/saveGender',data);
export const saveProfession = data => API.post('/profile/saveProfession',data);
export const saveAbout = data => API.post('/profile/saveAbout',data);
export const saveBriefDetails = data =>API.post('/profile/saveBriefDetails',data);
export const saveWork = data => API.post('/profile/saveWork',data);
export const saveLanguage = data => API.post('/profile/saveLanguage',data);
export const saveLocation = data => API.post('/profile/saveLocation',data);
export const saveSocialMedia = data => API.post('/profile/saveSocialMedia', data);
export const saveProfileImage = data => API.post('/profile/saveProfileImage',data);
export const saveAccountType = data => API.post('/profile/saveAccountType',data);
export const addWorkImage = data => API.post('./profile/addWorkImage',data);