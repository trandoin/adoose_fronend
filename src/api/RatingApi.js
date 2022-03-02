import axios from'axios';

const API = axios.create({baseURL : "http://localhost:5000"});

export const getPublicRating = data =>   API.post('/rate/getPublicRating',data);
export const postPublicRating = data => API.post('/rate/postPublicRating',data);