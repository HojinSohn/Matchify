import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import UserProfile from "../components/UserProfile";
import {Feather, MaterialIcons} from "@expo/vector-icons";
import React from "react";
import {useNavigation} from "@react-navigation/core";
import {heartDelete, matchAdd} from "../firebase/firestore";

var screenWidth = Dimensions.get('window').width;
const ProfileScreen = (userData) => {
    const navigation = useNavigation()
    const chatUserData = userData.route.params?.param;

    const goBack = async () => {
        navigation.replace("Home")
    }

    const noPress = async () => {
        await heartDelete(chatUserData["username"])
        navigation.replace("Home")
    }

    const yesPress = async () => {
        console.log("yes Press", chatUserData)
        await matchAdd(chatUserData["username"])
        navigation.replace("Home")
    }

    return (
        <View style={styles.container}>
            <View style={styles.exit}>
                <TouchableOpacity onPress={goBack}>
                    <Feather name="x" size={40} color="black"/>
                </TouchableOpacity>
            </View>
            <View style={styles.profile}>
                <UserProfile userData={chatUserData}></UserProfile>
            </View>
            <View style={styles.choice}>
                <TouchableOpacity onPress={noPress}>
                    <MaterialIcons name="thumb-down" size={55} color="blue"/>
                 </TouchableOpacity>
                <TouchableOpacity onPress={yesPress}>
                    <MaterialIcons name="thumb-up" size={55} color="red"/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    profile: {
        flex: 0.8,
        marginVertical: -15,
    },
    choice: {
        flex: 0.1,
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        borderColor: "black",
        borderWidth: 3,
        borderRadius: 100,
        padding: 5,
        backgroundColor: "#ffffff",
        width: screenWidth * 0.8,
        justifyContent: "space-around"
    },
    exit: {
        width: screenWidth,
        justifyContent: "flex-start",
        flex: 0.08
    }
})