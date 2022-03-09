import axios from "axios";

const API = axios.create({ baseURL: "https://adoose-backend.herokuapp.com" });

export const getProfileData = (data) =>
  API.post("/profile/getProfileData", data);
export const postNewPost = (data) => API.post("/feed/postNewPost", data);
export const getPosts = (data) => API.post("/feed/getPosts", data);
export const getDuniyaPosts = (data) => API.post("/feed/getDuniyaPosts", data);
