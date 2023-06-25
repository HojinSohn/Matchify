import React, {useState} from 'react'
import {Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, Image} from 'react-native'
import {auth, db, colRef} from "../firebase";
import {useNavigation} from "@react-navigation/core";
import * as ImagePicker from 'expo-image-picker';
import ProfilePicture from "../components/ProfilePicture";
import {doc, setDoc} from "firebase/firestore";

const PromptScreen = () => {
    const navigation = useNavigation()

    const [pfp, setPfp] = useState(null)
    const [name, setName] = useState(null);
    const [bio, setBio] = useState(null);
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
    const handleSave = async () => {

        console.log(name, bio)
        const docRef = doc(db, "users", auth.currentUser?.email);
        await setDoc(docRef, {
            username: name,
            userBio: bio,
            userPfp: pfp
        });

        // todoRef
        //     .add(data)
        //     .then(() => {
        //         Keyboard.dismiss();
        //     })
        //     .catch((error) => {
        //         alert(error);
        //     })
    }

    //upload profile picture from device storage
    const pfpSelect = async () => {
        let imageGot = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        // if (!imageGot.canceled) {
        setPfp(imageGot.assets[0].uri);
        // }
    }


    return (
        <View style={(styles.container)}>
            <TextInput
                placeholder="name"
                value={name}
                onChangeText={text => setName(text)}
                style={styles.input}
            />
            <TextInput
                placeholder='bio'
                value={bio}
                onChangeText={text => setBio(text)}
                style={styles.input}
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
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop:5,
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