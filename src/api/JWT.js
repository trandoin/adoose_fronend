import axios from'axios';

const API = axios.create({baseURL : "https://adoose-backend.herokuapp.com"});

export const verifyJWT = data => API.post('/checkUserValidation',data);