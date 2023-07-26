import {
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import {
    getChatRoomRef,
    getCurrentUserData,
    getMessages,
} from "../firebase/firestore";
import React, {useCallback, useEffect, useState} from "react";
import {addDoc, arrayUnion, setDoc, updateDoc} from "firebase/firestore";
import {useNavigation} from "@react-navigation/core";
import {Bubble, GiftedChat} from "react-native-gifted-chat";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const ChatRoomScreen = (data) => {
    const navigation = useNavigation();
    const chatUserData = data.route.params?.param;
    const [username, setUsername] = useState(null);
    const [messages, setMessages] = useState([{}]);
    const [userProfileUrl, setUserProfileUrl] = useState(null);
    var chatRoomRef = null;

    const setChatRoomRef = async () => {
        const u1Data = await getCurrentUserData();
        const u1Name = u1Data["username"];
        setUsername(u1Name);
        setUserProfileUrl(u1Data["ImageUrl"])
        const u2Name = chatUserData["username"];
        const u2Data = data;
        setYouProfileUrl(u2Data["ImageUrl"]);
        chatRoomRef = await getChatRoomRef(u1Name, u2Name);
    }

    useEffect(() => {
        setChatRoomRef();
        loadMessage();
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

    return (
        <View style={{flex: 1, backgroundColor: "#F5F5F5"}}>
            <TouchableOpacity onPress={handleQuit}>
                <MaterialCommunityIcons name="logout" size={40} color="black"/>
            </TouchableOpacity>
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