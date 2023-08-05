import {Image, View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions} from 'react-native'
import UserProfile from "./UserProfile";
import React, {useEffect, useState} from "react";
import {getUserDataByName, getUserDocByName} from "../firebase/firestore";
import ProfilePicture from "./ProfilePicture";
import {AntDesign, Feather} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/core";

function HeartPanel({ heartList }) {
    if (heartList == null || heartList.length === 0) {
        return (
            <View style={styles.emptyPanel}>
                <AntDesign name="heart" size={15} color="red"/>
                <Text>...</Text>
            </View>
        )
    } else {
        return (
            <View style={styles.panel}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {heartList.map((item, index) => {
                        return (
                            <View key={index}>
                                <HeartProfile username={item}> </HeartProfile>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        )
    }
}

function HeartProfile ({username}) {
    const [userData, setUserData] = useState(null);
    const [url, setUrl] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getUserDataByName(username);
            const profileImageUrl = data["ImageUrl"];
            setUserData(data);
            setUrl(profileImageUrl);
        }
        fetchData();
    }, [])

    const heartPress = async () => {
        console.log()
        navigation.replace("Profile", {param : userData})
    }

    return (
        <TouchableOpacity onPress={heartPress}>
            <View style={styles.container}>
                <ProfilePicture selectedImage={url} size={50}>
                </ProfilePicture>
                <AntDesign name="heart" size={15} color="red" style={styles.overlay} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginHorizontal: 5,
        justifyContent: "center"
    },
    overlay: {
        position: 'absolute',
        top: 35,
        right: 35
    },
    panel: {
        height: 54,
        width: Dimensions.get("window").width * 0.9,
        alignItems: "flex-start",
        justifyContent: "center",
        paddingVertical: 2,
    },
    emptyPanel: {
        height: 30,
        width: Dimensions.get("window").width * 0.9,
        flexDirection: "row",
        alignItems: "center"
    }
})
export default HeartPanel;