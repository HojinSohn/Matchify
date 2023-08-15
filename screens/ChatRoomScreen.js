import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text, Dimensions, Alert,
} from "react-native";
import {
    getChatRoomData,
    getChatRoomRef,
    getCurrentUserData,
    getMessages, isMatchedChat,
} from "../firebase/firestore";
import React, {useCallback, useEffect, useState} from "react";
import {arrayUnion, updateDoc, onSnapshot, getDocs, collection} from "firebase/firestore";
import {useNavigation} from "@react-navigation/core";
import {Bubble, GiftedChat} from "react-native-gifted-chat";
import {MaterialIcons, Feather, Ionicons, AntDesign, Entypo} from "@expo/vector-icons";
import ProfilePicture from "../components/ProfilePicture";
import UserProfile from "../components/UserProfile";
import {db} from "../firebase/firebase";

const ChatRoomScreen = (data) => {
    const navigation = useNavigation();
    const chatUserData = data.route.params?.param;
    const [username, setUsername] = useState(null);
    const [messages, setMessages] = useState([{}]);
    const [userProfileUrl, setUserProfileUrl] = useState(null);
    const [profileShow, setProfileShow] = useState(null);
    const [matched, setMatched] = useState(false);
    const [showProfilePanel, setShowProfilePanel] = useState(false);
    const [chatRoomData, setChatRoomData] = useState(null);
    const [hasAddress, setHasAddress] = useState(false);
    var chatRoomRef = null;

    const setChatRoomRef = async () => {
        const u1Data = await getCurrentUserData();
        const u1Name = u1Data["username"];
        setUsername(u1Name);
        setUserProfileUrl(u1Data["ImageUrl"])
        const u2Name = chatUserData["username"];
        chatRoomRef = await getChatRoomRef(u1Name, u2Name);
        // console.log(await isMatchedChat(chatRoomRef))
        setMatched(await isMatchedChat(chatRoomRef))
        setShowProfilePanel(true);//
        const roomData = await getChatRoomData(chatRoomRef)
        setChatRoomData(roomData);
        setHasAddress(roomData.appointmentData != null);
    }

    const fetchUpdates = async () => {
        // const isMatched = await isMatchedChat(chatRoomRef)
        // setMatched(isMatched)
        // console.log(isMatched)
        console.log(matched)
        const roomData = await getChatRoomData(chatRoomRef)
        setChatRoomData(roomData);
        setHasAddress(roomData.appointmentData != null);
    }

    useEffect(() => {
        const check = async () => {
            if (chatRoomRef === null) {
                await setChatRoomRef();
            }
            const unsubscribe = onSnapshot(chatRoomRef, snapshot => {
                fetchUpdates();
                const messageData = snapshot.data()["messages"];
                const messageArray = []
                messageData.forEach(message => {
                    message["createdAt"] = message["createdAt"].toDate();
                    messageArray.unshift(message);
                })
                setMessages(messageArray);
            })
            loadMessage();
            return () => {
                unsubscribe();
            };
        }
        check();

    }, []);

    const saveMessage = async (messages) => {
        if (chatRoomRef === null) {
            await setChatRoomRef();
        }
        for (const message of messages) {
            await updateDoc(chatRoomRef, {
                messages: arrayUnion(message)
            })
        }
    }

    const loadMessage = async () => {
        if (chatRoomRef === null) {
            await setChatRoomRef();
        }
        const messageData = await getMessages(chatRoomRef); // should change method
        const messageArray = []
        messageData.forEach(message => {
            message["createdAt"] = message["createdAt"].toDate();
            messageArray.unshift(message);
        })
        setMessages(messageArray);
    }

    const onSend = useCallback((messages = []) => {
        saveMessage(messages);
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, []);

    const handleQuit = async () => {
        navigation.replace("ChatList");
    }

    const pressAppointment = async () => {
        console.log("make an appointment")
        navigation.replace("Appointment", {param : chatUserData})
    }

    const showProfile = async () => {
        setProfileShow(true);
    }

    const hideProfile = async () => {
        setProfileShow(false);
    }

    const closePanel = async () => {
        setShowProfilePanel(false);
    }

    const openPanel = async () => {
        setShowProfilePanel(true);
    }

    const seeAppointment = async () => {
        navigation.replace("Appointment", {param : chatUserData, param2: chatRoomData})
    }

    if (profileShow) {
        return (
            <View style={{backgroundColor: "#FFF0D9", flex: 1}}>
                <View></View>
                <TouchableOpacity onPress={hideProfile}>
                    <Feather name="x" size={40} color="black"/>
                </TouchableOpacity>
                <UserProfile userData={chatUserData}></UserProfile>
            </View>
        )
    } else {
        return (
            <View style={{flex: 1, backgroundColor: "#fff7e8"}}>
                <View style={styles.profilePanel}>
                    {!showProfilePanel &&
                        <View style={{flexDirection:"row", width: Dimensions.get("window").width, justifyContent: "space-between"}}>
                            <TouchableOpacity onPress={handleQuit}>
                                <MaterialIcons name="arrow-back" size={40} color="black"/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openPanel}>
                                <AntDesign name={"down"} size={30} color={"black"}></AntDesign>
                            </TouchableOpacity>
                        </View>
                    }
                    {showProfilePanel &&
                        <View style={styles.profilePanel}>
                            <Text style={styles.username}>{chatUserData["username"]}</Text>
                            <TouchableOpacity onPress={showProfile} style={{height: 80, width: 500, alignItems: "center"}}>
                                <ProfilePicture selectedImage={chatUserData["ImageUrl"]} size={80}/>
                            </TouchableOpacity>
                            {matched && (
                                hasAddress ?
                                (<TouchableOpacity onPress={seeAppointment} style={{borderWidth: 2, borderColor: "black",
                                    marginVertical: 10, padding: 5, borderRadius: 15}}>
                                    <Text>See Appointment</Text>
                                </TouchableOpacity>)
                                :
                                (<TouchableOpacity onPress={pressAppointment} style={{height: 50, width: 200, alignItems: "center"}}>
                                    <Entypo name={"location"} size={40} color={"black"}></Entypo>
                                </TouchableOpacity> ))
                            }
                            <View style={{width: Dimensions.get("window").width,
                                alignItems: "center", flexDirection: "row",
                                marginTop: 0, justifyContent: "space-between"}}>
                                <TouchableOpacity onPress={handleQuit}>
                                    <MaterialIcons name="arrow-back" size={40} color="black"/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={closePanel}>
                                    <AntDesign name={"up"} size={30} color={"black"}></AntDesign>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </View>

                <GiftedChat
                    messages={messages}
                    showAvatarForEveryMessage={true}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: username,
                        name: username,
                        avatar: userProfileUrl
                    }}
                    renderBubble={props => <CustomBubble {...props} />}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '20%',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
        borderColor: "#000",
        borderWidth: 1.5,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    messageContainerMe: {
        padding: 8,
        borderRadius: 8,
        alignItems: "flex-end",
        backgroundColor: 'white',
        marginBottom: 8,
    },
    messageContainerYou: {
        padding: 8,
        borderRadius: 8,
        alignItems: "flex-start",
        backgroundColor: 'white',
        marginBottom: 8,
    },
    sender: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    messageText: {
        fontSize: 16,
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#59d431',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    profilePanel: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffe4b5",
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#000000"
    },
    profileCard: {
        width: Dimensions.get("window").width * 0.7,
        height: Dimensions.get("window").height * 0.7,
    }
})

export default ChatRoomScreen;


const CustomBubble = props => {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
                left: { backgroundColor: '#ffffff' }, // Customize left bubble background color
                right: { backgroundColor: '#FF7F00' }, // Customize right bubble background color
            }}
            textStyle={{
                left: { color: '#000' }, // Customize left bubble text color
                right: { color: '#fff' }, // Customize right bubble text color
            }}
        />
    );
};