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
import {getChatRoomRef, getCurrentUserData, getCurrentUserDoc, getMessages} from "../firebase/firestore";
import {useEffect, useState} from "react";
import UserProfile from "../components/UserProfile";
import {arrayUnion, setDoc, updateDoc} from "firebase/firestore";
import {useNavigation} from "@react-navigation/core";

const ChatRoomScreen = (data) => {
    const navigation = useNavigation();
    const chatUserData = data.route.params?.param;
    const [messages, setMessages] = useState([{}]);
    const [input, setInput] = useState(null);
    var chatRoomRef = null;
    const fetchMessageData = async () => {
        if (chatRoomRef === null) {
            await setChatRoomRef();
        }
        const messageData = await getMessages(chatRoomRef); // should change method
        const messageArray = []
        messageData.forEach(message => {
            console.log(message["text"]);
            messageArray.push(message);
        })
        setMessages(messageArray);
    }

    const setChatRoomRef = async () => {
        const u1Data = await getCurrentUserData();
        const u1Name = u1Data["username"];
        const u2Name = chatUserData["username"];
        chatRoomRef = await getChatRoomRef(u1Name, u2Name);
    }

    useEffect(() => {
        fetchMessageData();
    }, [])

    const handleQuit = async () => {
        navigation.replace("Home");
    }

    const handleSend = async () => {
        if (chatRoomRef === null) {
            await setChatRoomRef();
        }
        const senderData = await getCurrentUserData()
        const sender = senderData["username"];
        const messageToSend = {
            text: input,
            sender: sender,
            timestamp: (new Date()).toLocaleString(),
        }
        await updateDoc(chatRoomRef, {
            messages: arrayUnion(messageToSend)
        })
        setInput(null);
        fetchMessageData();
    }

    return (
        <View style={{ flex:1 }}>
            <TouchableOpacity
                onPress={handleQuit}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Quit</Text>
            </TouchableOpacity>
            <View style={styles.chatContainer}>
                <FlatList
                    data={messages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => {
                        // const formattedTime =  new Date(item.timestamp.seconds * 1000)
                        return (
                            <View style={styles.messageContainer}>
                                <Text style={styles.sender}>{item.sender}</Text>
                                <Text style={styles.messageText}>{item.text}</Text>
                                <Text style={styles.timestamp}>{item.timestamp}</Text>
                            </View>
                        )
                    }}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput value={input}
                           onChangeText={text => setInput(text)}
                           style={styles.input}></TextInput>
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>send</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
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
    messageContainer: {
        padding: 8,
        borderRadius: 8,
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
