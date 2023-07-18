import {ScrollView, Text, View} from "react-native";
import {getCurrentUserData, getCurrentUserDoc, getMessages} from "../firebase/firestore";
import {useEffect, useState} from "react";
import UserProfile from "../components/UserProfile";

const ChatRoomScreen = (data) => {
    const chatUserData = data.route.params?.param;
    const [messages, setMessages] = useState(null);
    useEffect(() => {
        const fetchMessageData = async () => {
            const u1Data = await getCurrentUserData();
            const u1Name = u1Data["username"];
            const u2Name = chatUserData["username"];
            const messageData = await getMessages(u1Name, u2Name);
            setMessages(messageData);
        }
        fetchMessageData();
    }, [])
    return (
        <ScrollView>
            {messages != null && (messages.map((item, index) => {
                return (
                    <View key={index}>
                        <Text> {item} </Text>
                    </View>
                );
            }))}
        </ScrollView>
    )
}

export default ChatRoomScreen;
