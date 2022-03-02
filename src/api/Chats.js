import axios from'axios';

const API = axios.create({baseURL : "http://localhost:5000"});


export const getAllChats = data => API.post('/chats/getAllChats',data);
export const getSearchedUser = data => API.post('/chats/getSearchedUser',data);