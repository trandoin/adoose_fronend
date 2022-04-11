import axios from'axios';

const API = axios.create({baseURL : "https://adoose-backend.herokuapp.com"});


export const getSearchedUsers = data => API.post("/Search/getSearchedUsers",data);