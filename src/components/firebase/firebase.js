import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA_hJ-r3UEK2zO5sAYMDbDFjR2_zCQyVbk",
    authDomain: "adoose-94825.firebaseapp.com",
    projectId: "adoose-94825",
    storageBucket: "adoose-94825.appspot.com",
    messagingSenderId: "859761011449",
    appId: "1:859761011449:web:a1a2cd1490eb7b37259028"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
