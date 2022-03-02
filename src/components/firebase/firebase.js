import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
 
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
