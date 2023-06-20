import React, {useState} from 'react'
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {auth, firestore} from "../firebase";
import {useNavigation} from "@react-navigation/core";
import * as ImagePicker from 'expo-image-picker';
import ProfilePicture from "../components/ProfilePicture";

const PromptScreen = () => {
    const navigation = useNavigation()

    const [pfp, setPfp] = useState(null)
    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => alert(error.message))
    }

    //gets a list of concert performers from firebase
    const getConcertArtists = () => {

    }

    //saves user data to firebase firestore
    const handleSave = () => {

    }

    //upload profile picture from device storage
    const pfpSelect = async () => {
        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })
            .then(image => {
                if (!image.canceled) {
                    setPfp(image.assets[0].uri)
                }
            })
    }


    return (
        <View style={(styles.container)}>
            <TextInput
                placeholder="name"
            />
            <TextInput
                placeholder='bio'
            />
            <ProfilePicture selectedImage={pfp} />
            <TouchableOpacity
                onPress={pfpSelect}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Upload Profile Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleSave}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleSignOut}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
        </View>
    )
}

export default PromptScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    }
})