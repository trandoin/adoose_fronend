import axios from "axios";

const API = axios.create({ baseURL: "https://adoose-backend.herokuapp.com" });

export const addNotification = (data) =>
  API.post("/Notifications/addNotification", data);
export const getAllNotification = (data) =>
  API.post("/Notifications/getAllNotifications", data);
export const readAll = (data) => API.post("./Notifications/readAll", data);
