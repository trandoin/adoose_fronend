import axios from "axios";

const API = axios.create({ baseURL: "https://adoose-backend.herokuapp.com" });

export const isUserFollowed = (data) =>
  API.post("/follow/isUserFollowed", data);
export const followUser = (data) => API.post("/follow/followUser", data);
export const unfollowUser = (data) => API.post("/follow/unfollowUser", data);
export const blocked = (data) => API.post("/follow/block", data);
