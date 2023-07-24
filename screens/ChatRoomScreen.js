import {
    Button,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {
    getChatRoomRef,
    getCurrentUserData,
    getCurrentUserDoc,
    getMessages,
    getUserDataByName
} from "../firebase/firestore";
import {useCallback, useEffect, useState} from "react";
import UserProfile from "../components/UserProfile";
import {addDoc, arrayUnion, setDoc, updateDoc} from "firebase/firestore";
import {useNavigation} from "@react-navigation/core";
import {Bubble, GiftedChat} from "react-native-gifted-chat";

const ChatRoomScreen = (data) => {
    const navigation = useNavigation();
    const chatUserData = data.route.params?.param;
    const [username, setUsername] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [messages, setMessages] = useState([{}]);
    const [input, setInput] = useState(null);
    const [userProfileUrl, setUserProfileUrl] = useState(null);
    const [youProfileUrl, setYouProfileUrl] = useState(null);
    var chatRoomRef = null;

    const setChatRoomRef = async () => {
        const u1Data = await getCurrentUserData();
        const u1Name = u1Data["username"];
        setUsername(u1Name);
        setUserProfileUrl(u1Data["ImageUrl"])
        console.log("setChatRoomRef: ", chatUserData);
        const u2Name = chatUserData["username"];
        // const u2Data = await getUserDataByName(u2Name);
        const u2Data = data;
        setYouProfileUrl(u2Data["ImageUrl"]);
        console.log("setChatRoomRef 1: ", u1Name, u2Name);
        chatRoomRef = await getChatRoomRef(u1Name, u2Name);
        console.log("setChatRoomRef 2: ", chatRoomRef);
    }

    useEffect(() => {
        setChatRoomRef();
        loadMessage();
    }, []);

    const saveMessage = async (messages) => {
        console.log(messages)
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
                console.log(message["text"]);
                message["createdAt"] = message["createdAt"].toDate();
                messageArray.unshift(message);
            })
            setMessages(messageArray);
    }

    const onSend = useCallback((messages = []) => {
        saveMessage(messages);
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        console.log(messages);
    }, []);

    const handleQuit = async () => {
        navigation.replace("Home");
    }

    return (
        <View style={{flex: 1}}>
            <TouchableOpacity onPress={handleQuit}
                            style={styles.button}>
                <Text style={styles.buttonText}>Quit</Text>
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
        borderColor: "#000000",
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
                left: { backgroundColor: '#e1e1e1' }, // Customize left bubble background color
                right: { backgroundColor: '#008ecc' }, // Customize right bubble background color
            }}
            textStyle={{
                left: { color: '#000' }, // Customize left bubble text color
                right: { color: '#fff' }, // Customize right bubble text color
            }}
        />
    );
};