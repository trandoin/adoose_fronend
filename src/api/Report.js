import axios from'axios';

const API = axios.create({baseURL : "https://adoose-backend.herokuapp.com"});

export const Report    = data =>   API.post('/report/account',data);