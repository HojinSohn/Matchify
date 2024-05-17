import {StyleSheet, Text, View} from "react-native";
import React from "react";
import {Image} from 'react-native'

function TrackProfile({trackInfo}) {
    return(
        <View style={styles.container}>
            <Text style={styles.name}>{trackInfo["name"]}</Text>
            <Image
                source={{uri: trackInfo["imageUrl"]}} style={{ width: 250, height: 250 , marginTop: 15}}
            />
            <Text style={styles.genre}>{trackInfo["artist"]}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1db954',
        flexDirection: "column",
        margin: 15,
        padding: 15,
        alignItems: "center"
    },
    name: {
        fontSize: 25,
        fontWeight: 'bold',
        color: "#FFFFFF",
        fontStyle: "italic",
    },
    genre: {
        fontSize: 10,
        fontWeight: 'bold',
        color: "#333333",
        fontStyle: "italic",
    }
})

export default TrackProfile;