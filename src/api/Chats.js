import axios from "axios";

const API = axios.create({ baseURL: "https://adoose-backend.herokuapp.com" });

export const getAllChats = (data) => API.post("/chats/getAllChats", data);
export const getSearchedUser = (data) =>
  API.post("/chats/getSearchedUser", data);
