// Import the functions you need from the SDKs you need
//import * as firebase from "firebase";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCtl2JJZiJT0KKTvknvCcMgDmCuxVUfG0E",
    authDomain: "fir-auth-17508.firebaseapp.com",
    projectId: "fir-auth-17508",
    storageBucket: "fir-auth-17508.appspot.com",
    messagingSenderId: "663370089947",
    appId: "1:663370089947:web:a4035fdc52b2c7ddc093fe",
    measurementId: "G-JV268XJN43"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app()
}
const auth = firebase.auth();

export { auth };
//const analytics = getAnalytics(app);