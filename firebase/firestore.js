import {auth, db} from "./firebase"
import {arrayUnion, collection, doc, getDoc, getDocs, setDoc, updateDoc, serverTimestamp} from "firebase/firestore";

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
    // console.log("getUserDataByName: ", name)
    const datas = await getAllUserData();
    let userData = null;
    datas.forEach(data => {
        if (data["username"] === name) {
            // console.log("getUserDataByName: ", data)
            userData = data;
        }
    })
    return userData;
}

const getUserDocByName = async (name) => {
    console.log("getUserDocByName:", name);
    const userDocs = await getDocs(collection(db, "users"));
    let userDoc = null
    userDocs.forEach((doc) => {
        const userData = doc.data();
        console.log("gettt::::", userData["username"], name);
        if (userData["username"] === name) {
            console.log("hihi");
            userDoc = doc;
        }
    })
    return userDoc;
}

const heartAdd = async (name) => {
    const currentUserName = (await getCurrentUserData())["username"];
    const userDoc = await getUserDocByName(name);
    const heartList = (await getUserDataByName(name))["heartList"];

    if (heartList === undefined || !heartList.includes(currentUserName)) {
        console.log("heartAdd function: adding...",userDoc.data());
        await updateDoc(userDoc.ref, {heartList : arrayUnion(currentUserName)});
    } else {
        console.log("heartAdd function: Already in the list");
    }
}

const heartDelete = async (name) => {
    const currentUserData = await getCurrentUserData();
    const heartList = currentUserData["heartList"];
    const currentUserDoc = await getCurrentUserDoc();

    const updatedList = [];
    heartList.forEach((username) => {
        if (username !== name) {
            updatedList.push(username);
        }
    })
    await updateDoc(currentUserDoc, {heartList : updatedList});
}

const matchAdd = async (name) => {
    const currentUserData = await getCurrentUserData();
    const userData = await getUserDataByName(name);
    const currentUserDoc = await getCurrentUserDoc();
    const matchUserDoc = await getUserDocByName(name);
    const matchList = userData["matchList"];
    const currentMatchList = currentUserData["matchList"];
    if (matchList === undefined || !matchList.includes(currentUserData["username"])) {
        console.log("huh")
        await updateDoc(matchUserDoc.ref, {matchList : arrayUnion(currentUserData["username"])})
    }
    if (currentMatchList === undefined || !currentMatchList.includes(userData["username"])) {
        console.log("huh")
        await updateDoc(currentUserDoc, {matchList : arrayUnion(userData["username"])})
    }
    const chatRoomRef = await getChatRoomRef(currentUserData["username"], userData["username"])
    await updateDoc(chatRoomRef, {match: true});
    await heartDelete(name);
}

const getAllUserData = async() => {
    const userDocs = await getDocs(collection(db, "users"));
    const temp = []
    userDocs.forEach((doc) => {
        temp.push(doc.data());
    })
    return temp;
}

const getMessages = async (chatRoomRef) => {
    const chatDoc = await getDoc(chatRoomRef);
    const chatData = await chatDoc.data();
    return chatData["messages"];
}

const getChatRoomData = async (chatRoomRef) => {
    const chatDoc = await getDoc(chatRoomRef);
    const chatData = await chatDoc.data();
    return chatData;
}

const isMatchedChat = async (chatRoomRef) => {
    const chatDoc = await getDoc(chatRoomRef);
    const chatData = await chatDoc.data()
    if (chatData["match"] === undefined) {
        return false;
    }
    return chatData["match"];
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
        await updateDoc(convDocRef, {match: false})
    }
    console.log(convDocRef);

    return (convDocRef);
}

const getChatRoomDatas = async (username) => {
    const convDocs = await getDocs(collection(db, "messages"));
    const convDatas = [];
    convDocs.forEach((doc) => {
        const docData = doc.data()
        if (docData["members"].includes(username)) {
            convDatas.push(doc.data());
        }
    })

    return (convDatas);
}

const makeAppointment = async (chatRoomRef, appointmentData) => {
    console.log(chatRoomRef, appointmentData);
    await updateDoc(chatRoomRef, {appointmentData: appointmentData})
}

const deleteAppointment = async (chatRoomRef) => {
    await updateDoc(chatRoomRef, {appointmentData: null})
}

export {getCurrentUserData, getCurrentUserDoc, getUserDocByName,
    isMatchedChat, heartDelete, matchAdd, getAllUserData,
    getMessages, heartAdd, getChatRoomRef, getUserDataByName,
    getChatRoomDatas,getChatRoomData, makeAppointment, deleteAppointment};