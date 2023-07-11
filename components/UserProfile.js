import {StyleSheet, Text, View} from "react-native";
import {auth} from "../firebase/firebase";
import ProfilePicture from "./ProfilePicture";
import React from "react";

function UserProfile({userData}) {
    return(
        <View>
            <Text>username: {userData["username"]}</Text>
            <Text>userBio: {userData["userBio"]}</Text>
            <Text>Top Artist: {userData["topArtists"]?.toString()}</Text>
            <Text>Spotify Data: {userData["userSpotifyData"]?.toString()}</Text>
            <ProfilePicture selectedImage={userData["ImageUrl"]} style={styles.profileImage}/>
        </View>
    )
}

const styles = StyleSheet.create({
    profileImage: {
        width: 150,
        height: 150,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default UserProfile