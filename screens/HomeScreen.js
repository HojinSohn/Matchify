import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {auth} from "../firebase/firebase";
import {useNavigation} from "@react-navigation/core";
import UserPage from "../components/UserPage";
import {getToken} from "../api/token";
import {getAllUserData, getCurrentUserData} from "../firebase/firestore";
import {Entypo, MaterialCommunityIcons} from "@expo/vector-icons";
import HeartPanel from "../components/HeartPanel";
import {SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URL} from "@env"

const HomeScreen = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [allUserData, setAllUserData] = useState(null);

    useEffect(() => {
        console.log(SPOTIFY_CLIENT_ID, '\n', SPOTIFY_CLIENT_SECRET , '\n', SPOTIFY_REDIRECT_URL);
        auth.onAuthStateChanged(user => {
            if (!user) {
                navigation.replace('Login');
            }
        });

        getToken();
        // getEventsByName(); // test

        const fetchData = async () => {
            const currentUserData = await getCurrentUserData()
            setUserData(currentUserData);
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            const allUserData = await getAllUserData();
            setAllUserData(allUserData);
        }
        fetchUserData();
    }, [userData]);

    const editProfile = async () => {
        navigation.replace("Prompt");
    }

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => alert(error.message))
    }

    const showChatList = async () => {
        navigation.replace("ChatList");
    }


    return (
        <View style={(styles.container)}>
            <View style={styles.buttonPanel}>
                <TouchableOpacity
                    onPress={handleSignOut}
                    style={{margin: 10, flex: 1}}
                >
                    <MaterialCommunityIcons name="logout" size={40} color="black"/>
                </TouchableOpacity>
                <Text style={styles.title}>MATCHIFY</Text>
                <View style={{flex: 1.5, flexDirection: "row", alignItems: "center"}}>
                    <TouchableOpacity onPress={editProfile} style={{flex: 1}}>
                        <MaterialCommunityIcons name="account-circle" size={40} color="black"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showChatList} style={{flex: 1}}>
                        <Entypo name="chat" size={40} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            {userData !== null && (
                <View style={styles.heartPanel}>
                    <HeartPanel heartList={userData["heartList"]}></HeartPanel>
                </View>
            )}

            {allUserData !== null && (
                <UserPage allUserData = {allUserData} />
            )}
        </View>
    )
}
export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // backgroundColor: "#FFE4B5"
        backgroundColor: "#fff7e8"
    },
    button: {
        backgroundColor: '#0782F9',
        // width: '100%',// 40
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 10,
    },
    profileImage: {
        width: 150,
        height: 150,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonPanel: {
        flex: 0.1,
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: "#FFF0D9"
    },
    title: {
        flex: 3,
        fontWeight: "bold",
        fontStyle: "italic",
        fontSize: 35,
    },
    heartPanel: {
        alignItems: "flex-start"
    }
})