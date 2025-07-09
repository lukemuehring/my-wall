import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSz5aJHzXzF0f8zTyXhd8ThlZMaPz-3ck",
  authDomain: "my-wall-514a.firebaseapp.com",
  projectId: "my-wall-514a",
  storageBucket: "my-wall-514a.firebasestorage.app",
  messagingSenderId: "277136348074",
  appId: "1:277136348074:web:e352299ef3e80c34a051d3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
