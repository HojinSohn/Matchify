import React, {useEffect, useRef, useState} from "react";
import {
    getChatRoomDatas,
    getCurrentUserData, getUserDataByName
} from "../firebase/firestore";
import {StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native'
import {useNavigation} from "@react-navigation/core";
import {MaterialIcons} from "@expo/vector-icons";
import ProfilePicture from "../components/ProfilePicture";

const ChatListScreen = () => {
    const navigation = useNavigation();
    const [userList, setUserList] = useState([]);
    useEffect(() => {
        const processUserDatas = async () => {
            const currentUser = await getCurrentUserData();
            const username = currentUser["username"];
            const chatRoomDatas = await getChatRoomDatas(username);
            const userList = [];
            chatRoomDatas.forEach(chatRoomData => {
                const members = chatRoomData["members"];
                if (members[0] === username) {
                    if (currentUser["matchList"] != null && currentUser["matchList"].includes(members[1])) {
                        userList.unshift(members[1])
                    } else {
                        userList.push(members[1]);
                    }
                } else {
                    if (currentUser["matchList"] != null && currentUser["matchList"].includes(members[0])) {
                        userList.unshift(members[0])
                    } else {
                        userList.push(members[0]);
                    }
                }
            })
            setUserList(userList);
        }
        processUserDatas();
    }, [])

    const showChatRoom = async (username) => {
        const data = await getUserDataByName(username);
        navigation.replace("ChatRoom", {param : data});
    }

    const handleQuit = async () => {
        navigation.replace("Home");
    }

    function ChatRoomProfile({username}) {
        const [url, setUrl] = useState(null);
        const [isMatchedUser, setIsMatchedUser] = useState(false);

        useEffect(() => {
            const fetchData = async () => {
                const userData = await getUserDataByName(username);
                setUrl(userData["ImageUrl"]);
                const currentUser = await getCurrentUserData();
                if (currentUser["matchList"].includes(username)) {
                    await setIsMatchedUser(true);
                }
            }
            fetchData();
        })

        if (isMatchedUser) {
            return (
                <TouchableOpacity style={styles.chatRoomItemMatched} onPress={() => showChatRoom(username)}>
                    <ProfilePicture selectedImage={url} size={70}></ProfilePicture>
                    <Text>{username}</Text>
                </TouchableOpacity>
            )
        }
        return (
            <TouchableOpacity style={styles.chatRoomItem} onPress={() => showChatRoom(username)}>
                <ProfilePicture selectedImage={url} size={70}></ProfilePicture>
                <Text>{username}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleQuit}>
                <MaterialIcons name="arrow-back" size={40} color="black"/>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {userList.map((item, index) => {
                    return (
                        <View key={index}>
                            <ChatRoomProfile username={item} ></ChatRoomProfile>
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
        padding:5,
        backgroundColor: '#FFE4B5',
    },
    scrollViewContent: {
        paddingBottom: 8,
        marginTop: 10,
    },
    chatRoomItem: {
        backgroundColor: '#b5f5ff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    chatRoomItemMatched: {
        backgroundColor: '#f0a1f0',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    roomText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});


export default ChatListScreen;

