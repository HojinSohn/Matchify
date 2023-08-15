
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore, collection} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {API_KEY,
AUTH_DOMAIN,
PROJECT_ID,
STORAGE_BUCKET,
MESSAGE_SENDER_ID,
APP_ID,
MEASUREMENT_ID} from "@env"

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGE_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
    // app = initializeApp(firebaseConfig);
} else {
    app = firebase.app()
}
const auth = firebase.auth();
// const auth = getAuth(app);
export { auth };

const provider = firebase.auth.GoogleAuthProvider;
export {provider};

const db = getFirestore(app)
export { db }

const storage = getStorage(app);
export { storage }