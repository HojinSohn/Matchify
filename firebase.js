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
    apiKey: "AIzaSyD7U-Y1TURBB9gTrXIqQ9cnysnreUwOk88",
    authDomain: "matchify-b4076.firebaseapp.com",
    projectId: "matchify-b4076",
    storageBucket: "matchify-b4076.appspot.com",
    messagingSenderId: "593959637896",
    appId: "1:593959637896:web:d5f6afd443e351db57603d",
    measurementId: "G-CBWDW0X8DL"
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

const firestore = firebase.firestore;
export { firestore }
//const analytics = getAnalytics(app);