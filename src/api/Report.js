import axios from'axios';

const API = axios.create({baseURL : "http://localhost:5000"});

export const Report    = data =>   API.post('/report/account',data);