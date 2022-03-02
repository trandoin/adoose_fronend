import axios from'axios';

const API = axios.create({baseURL : "http://localhost:5000"});


export const addNotification = data => API.post('/Notifications/addNotification',data);
export const getAllNotification = data => API.post('/Notifications/getAllNotifications',data);
export const readAll = data => API.post("./Notifications/readAll",data);