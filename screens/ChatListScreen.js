import React, {useEffect, useRef, useState} from "react";
import {
    getAllUserData, getChatRoomDatas,
    getChatRoomRef,
    getCurrentUserData, getUserDataByName
} from "../firebase/firestore";
import {StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native'
import UserProfile from "../components/UserProfile";
import {useNavigation} from "@react-navigation/core";

const ChatListScreen = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState(null);
    const [userList, setUserList] = useState([]);
    useEffect(() => {
        const processUserDatas = async () => {
            const currentUser = await getCurrentUserData();
            const chatRoomDatas = await getChatRoomDatas(currentUser["username"]);
            const userList = [];
            chatRoomDatas.forEach(chatRoomData => {
                const members = chatRoomData["members"];
                if (members[0] === userName) {
                    userList.push(members[1]);
                } else {
                    userList.push(members[0]);
                }
            })
            setUserList(userList);
            console.log(userList);
        }
        processUserDatas();
    }, [])

    const showChatRoom = async (username) => {
        const data = await getUserDataByName(username);
        console.log("showChatRoom: ", data);
        navigation.replace("ChatRoom", {param : data});
    }

    return (

        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {userList.map((item, index) => {
                    return (
                        <View key={index}>
                            <TouchableOpacity style={styles.chatRoomItem} onPress={() => showChatRoom(item)}>
                                <Text style={styles.roomText}>{item}</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff', // Light blue background color
    },
    scrollViewContent: {
        paddingBottom: 8,
    },
    chatRoomItem: {
        backgroundColor: '#BFBEEB', // Light blue chat room color
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    roomText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF', // White text color on light blue background
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});


export default ChatListScreen;

