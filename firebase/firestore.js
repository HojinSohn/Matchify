import {auth, db} from "./firebase"
import {collection, doc, getDoc, getDocs, setDoc} from "firebase/firestore";

const getCurrentUserDoc = async () => {
    const docRef = await doc(db, "users", auth.currentUser?.email);
    return docRef;
}
const getCurrentUserData = async () => {
    const docRef = await doc(db, "users", auth.currentUser?.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
}

const getUserDataByName = async (name) => {
    const datas = await getAllUserData();
    datas.forEach((data) => {
        if (data["username"] === name) {
            return data;
        }
    })
}

const getAllUserData = async() => {
    const userDocs = await getDocs(collection(db, "users"));
    const temp = []
    userDocs.forEach((doc) => {
        temp.push(doc.data());
    })
    return temp;
}

// const getMessages = async (u1Name, u2Name) => {
//     const convDocs = await getDocs(collection(db, "messages"));
//     var convDocData = null
//     convDocs.forEach((doc) => {
//         const docData = doc.data()
//         if (docData["members"].includes(u1Name) && docData["members"].includes(u2Name)) {
//             convDocData = docData;
//         }
//     })
//     if (convDocData != null) {
//         return convDocData["messages"];
//     }
//     else {
//         return null;
//     }
// }

const getMessages = async (chatRoomRef) => {
    const chatDoc = await getDoc(chatRoomRef);
    const chatData = await chatDoc.data();
    return chatData["messages"];
}

const getChatRoomRef = async (u1Name, u2Name) => {
    const convDocs = await getDocs(collection(db, "messages"));
    var convDocRef = null
    convDocs.forEach((doc) => {
        const docData = doc.data()
        if (docData["members"].includes(u1Name) && docData["members"].includes(u2Name)) {
            convDocRef = doc.ref;
        }
    })

    if (convDocRef === null) {
        const messageID = u1Name + "+" + u2Name;
        convDocRef = await doc(db, "messages", messageID);
        await setDoc(convDocRef, {
            members: [u1Name, u2Name],
            messages: []
        });
    }
    console.log(convDocRef);

    return (convDocRef);
}

export {getCurrentUserData, getCurrentUserDoc, getAllUserData, getMessages, getChatRoomRef, getUserDataByName};