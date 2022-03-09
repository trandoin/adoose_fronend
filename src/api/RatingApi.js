import axios from "axios";

const API = axios.create({ baseURL: "https://adoose-backend.herokuapp.com" });

export const getPublicRating = (data) =>
  API.post("/rate/getPublicRating", data);
export const postPublicRating = (data) =>
  API.post("/rate/postPublicRating", data);
