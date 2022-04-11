import axios from'axios';

const API = axios.create({baseURL : "https://adoose-backend.herokuapp.com"});

export const getProfileData = data => API.post('/profile/getProfileData',data);


export const editProfielData = data => API.put(`/profile/editProfielData/${data._id}`,data);

export const getOthersProfileData = data => API.post('/profile/getOthersProfileData',data);
export const saveAbout = data => API.post('/profile/saveAbout',data);

export const getLeadsData = data => API.post('/profile/getLeadsData',data);
export const saveLeadsData = data => API.post('/profile/saveLeadsData',data)
export const getLeadsDataPartial = data => API.post('/profile/getLeadsDataPartial',data);

export const getPostsData = data => API.post('/profile/getPostsData',data);
export const getPostsDataPartial = data => API.post('/profile/getPostsDataPartial',data);

export const getFollowData = data => API.post('/profile/getFollowData',data);

export const addFee = data => API.post('/profile/addFee' ,data)