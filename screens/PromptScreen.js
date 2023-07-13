import React, {useEffect, useState} from 'react'
import {Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, Image} from 'react-native'
import {auth, db, colRef, storage} from "../firebase/firebase";
import {useNavigation} from "@react-navigation/core";
import * as ImagePicker from 'expo-image-picker';
import ProfilePicture from "../components/ProfilePicture";
import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {ref, uploadBytes } from 'firebase/storage';
import {makeRedirectUri, useAuthRequest} from "expo-auth-session";
import * as WebBrowser from 'expo-web-browser';
import { Entypo } from '@expo/vector-icons';
import {deleteImage, getImageUrl} from "../firebase/storage";
import {exchangeCodeForAccessToken, clientId, redirectUri} from "../api/token";
import {getUserProfile, getUsersTopItem} from "../api/api";

const PromptScreen = () => {
    const navigation = useNavigation()
    const [pfp, setPfp] = useState(null)
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [userProfileData, setUserProfileData] = useState(null);
    const [userTopItems, setUserTopItems] = useState(null);
    const [prevPfp, setPrevPfp] = useState(null);
    const [prevImageUrl, setPrevImageUrl] = useState(null);
    var gotAccessToken = false;
    const [existingProfile, setExistingProfile] = useState(false);

    WebBrowser.maybeCompleteAuthSession();


    const discovery = {
        authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        tokenEndpoint: 'https://accounts.spotify.com/api/token',
    };

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: clientId,
            scopes: ['user-read-email', 'playlist-modify-public', 'user-top-read', 'user-read-private',
                'user-top-read', 'playlist-read-private'],
            // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            redirectUri: redirectUri,
        },
        discovery
    );

    useEffect(() => {
        var docSnap;
        const checkDocExist = async () => {
            setExistingProfile(false);
            const docRef = doc(db, "users", auth.currentUser?.email);
            docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setExistingProfile(true);
                setName(docSnap.get("username"))
                setBio(docSnap.get("userBio"))
                setPfp(docSnap.get("userPfp"))
                setPrevPfp(docSnap.get("userPfp"))
                setPrevImageUrl(docSnap.get("ImageUrl"))
                setUserTopItems(docSnap.get("topArtists"))
                setUserProfileData(docSnap.get("userSpotifyData"))
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        checkDocExist();
    }, []);

    useEffect(() => {
        const getSpotifyData = async () => {
            if (response?.type === 'success') {
                const { code} = response.params;
                console.log(code);
                // const access_token = await exchangeCodeForAccessToken(code); // it sets token in token.js
                await exchangeCodeForAccessToken(code);
                gotAccessToken = true;
                const profileData = await getUserProfile();
                setUserProfileData(profileData);
                console.log("wow")
                const topItems = await getUsersTopItem();
                setUserTopItems(topItems);
                console.log("wowwww")
                // Use the access token to make a request to the Spotify API
            }
        }
        getSpotifyData();
        // console.log("Hello@@@@@@@@@@@@@@", response?.type);
    }, [response]);

    const handleQuit = () => {
        if (existingProfile) {
            navigation.replace("Home");
        } else {
            auth.currentUser.delete();
            navigation.replace("Login");
        }
    }

    //gets a list of concert performers from firebase
    const getConcertArtists = () => {

    }

    //saves user data to firebase firestore
    const handleSave = async () => {
        if (existingProfile) {
            console.log("handle save ex")
            var url = prevImageUrl;
            const fileName = pfp.substring(pfp.lastIndexOf('/') + 1);
            if (pfp !== prevPfp) {
                await uploadImageToFirebase(pfp);
                if (pfp != null) {
                    url = await getImageUrl(fileName);
                }
                const prevFileName = prevPfp.substring(prevPfp.lastIndexOf('/') + 1);
                await deleteImage(prevFileName)
            }
            const docRef = doc(db, "users", auth.currentUser?.email);
            await updateDoc(docRef, {
                username: name,
                userBio: bio,
                userPfp: pfp,
                topArtists: userTopItems,
                userSpotifyData: userProfileData,
                ImageUrl: url
            })
        } else {
            console.log("handle save no ex")
            console.log(name, bio, userTopItems, userProfileData)
            await uploadImageToFirebase(pfp);
            var url = null;
            if (pfp != null) {
                const fileName = pfp.substring(pfp.lastIndexOf('/') + 1);
                url = await getImageUrl(fileName);
            }
            const docRef = doc(db, "users", auth.currentUser?.email);
            await setDoc(docRef, {
                username: name,
                userBio: bio,
                userPfp: pfp,
                topArtists: userTopItems,
                userSpotifyData: userProfileData,
                ImageUrl: url
            });
        }
        navigation.replace("Home")
    }

    //upload profile picture from device storage
    const pfpSelect = async () => {
        let imageGot = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        // if (!imageGot.canceled) {
        setPfp(imageGot.assets[0].uri);

        // }
    }

    const uploadImageToFirebase = async (imageUri) => {
        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();

            const fileName = imageUri.substring(imageUri.lastIndexOf('/')+1);
            const imageRef = ref(storage, `images/${fileName}`);

            await uploadBytes(imageRef, blob);

            console.log('Image uploaded successfully.');
        } catch (error) {
            console.log('Error uploading image:', error);
        }
    };


    return (
        <View style={(styles.container)}>
            <View style={styles.userProfile}>
                <TextInput
                    placeholder={name}
                    value={name}
                    onChangeText={text => setName(text)}
                    style={styles.input}
                />
                <View style={styles.bioContainer}>
                    <ProfilePicture selectedImage={pfp} size={300} />
                    <TextInput
                        multiline={true}
                        numberOfLines={5}
                        textAlignVertical="top"
                        textAlign="left"
                        placeholder={bio}
                        value={bio}
                        onChangeText={text => setBio(text)}
                        style={styles.bioInput}
                    />
                </View>
            </View>
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
                onPress={handleQuit}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Quit</Text>
            </TouchableOpacity>
            <TouchableOpacity
                disabled={!request}
                onPress={() => {
                    promptAsync();
                }}
                style={{
                    width: '60%',
                    borderRadius: 25,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#1DB954",
                    flexDirection: "row",
                    padding: 10,
                    marginTop: 10,
                    borderColor: "#000000",
                    borderWidth: 1.5,
                }}
            >
                <Entypo name="spotify" size={24} color="white" />
                <Text style={styles.buttonText}>Link Spotify Account</Text>
            </TouchableOpacity>
        </View>
    )
}

export default PromptScreen

const styles = StyleSheet.create({
    bioInput: {
        backgroundColor: 'white',
        width: 300,
        height: 130,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    bioContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "column",
    },
    userProfile: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "column",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "#121212",
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 10,
        marginVertical: 5,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
        borderColor: "#000000",
        borderWidth: 1.5,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    }
})