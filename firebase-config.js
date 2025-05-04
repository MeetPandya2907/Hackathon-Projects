// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1wQrOUiUQWmFc3XNIgwEJOkp82NvHQhA",
  authDomain: "airbnb-clone-e6275.firebaseapp.com",
  projectId: "airbnb-clone-e6275",
  storageBucket: "airbnb-clone-e6275.firebasestorage.app",
  messagingSenderId: "711426320432",
  appId: "1:711426320432:web:d206c33b7c8353d58ee5f5",
  measurementId: "G-4DDRFJ7HGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);