import {auth, db} from "./firebase"
import {collection, doc, getDoc, getDocs} from "firebase/firestore";

const getCurrentUserDoc = async () => {
    return await doc(db, "users", auth.currentUser?.email);
}
const getCurrentUserData = async () => {
    const docRef = await doc(db, "users", auth.currentUser?.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
}

const getAllUserData = async() => {
    const userDocs = await getDocs(collection(db, "users"));
    const temp = []
    userDocs.forEach((doc) => {
        temp.push(doc.data());
    })
    return temp;
}

const getMessages = async (u1Name, u2Name) => {
    const convDocs = await getDocs(collection(db, "messages"));
    var convDocData = null
    convDocs.forEach((doc) => {
        const docData = doc.data()
        if (docData["members"].includes(u1Name) && docData["members"].includes(u2Name)) {
            convDocData = docData;
        }
    })
    if (convDocData != null) {
        return convDocData["messages"];
    }
    else {
        return null;
    }
}

export {getCurrentUserData, getCurrentUserDoc, getAllUserData, getMessages};