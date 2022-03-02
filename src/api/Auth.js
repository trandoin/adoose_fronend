import axios from'axios';

const API = axios.create({baseURL : "http://localhost:5000"});

export const login    = data =>   API.post('/user/login',data);
export const register = data =>   API.post('/user/register',data);

export const verification = data => API.post('/user/verification',data);
export const verificationMail = data => API.post('/user/verificationMail',data);
export const checkLinkValidityVerification = data => API.post('/user/checkLinkValidityVerification',data);

export const setnewpassword = data => API.post('/user/setnewpassword',data);
export const forgetPassword = data => API.post('/user/forgetPassword',data);
export const checkLinkValidityForget = data => API.post('/user/checkLinkValidityForget',data);