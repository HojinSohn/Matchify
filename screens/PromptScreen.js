import React, {useEffect, useState} from 'react'
import {Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, Image} from 'react-native'
import {auth, db, colRef, storage} from "../firebase/firebase";
import {useNavigation} from "@react-navigation/core";
import * as ImagePicker from 'expo-image-picker';
import ProfilePicture from "../components/ProfilePicture";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {ref, uploadBytes } from 'firebase/storage';
import {makeRedirectUri, useAuthRequest} from "expo-auth-session";
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';
import { encode } from 'base-64';
import { Entypo } from '@expo/vector-icons';
import {getImageUrl} from "../firebase/storage";

const PromptScreen = () => {
    const navigation = useNavigation()
    const [pfp, setPfp] = useState(null)
    const [name, setName] = useState(null);
    const [bio, setBio] = useState(null);
    const [userProfileData, setUserProfileData] = useState(null);
    const [userTopItems, setUserTopItems] = useState(null);
    const clientId = "c2f5a819d4684f8c9efc489144cb0e0a";
    const clientSecret = '0cb4370ee5254a16aa2fd319290a15f5';
    const redirectUri = 'exp://192.168.1.20:19000/--/';
    var gotAccessToken = false;
    // const [accessToken, setAccessToken] = useState(null);

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
        console.log("Hello@@@@@@@@@@@@@@", response?.type);
        if (response?.type === 'success') {
            const { code} = response.params;
            console.log(code);
            exchangeCodeForAccessToken(code);

            // Use the access token to make a request to the Spotify API
        }
    }, [response]);

    const exchangeCodeForAccessToken = async (code) => {
        try {
            const response = await axios.post(
                'https://accounts.spotify.com/api/token',
                new URLSearchParams({
                    code: code,
                    redirect_uri: redirectUri,
                    grant_type: 'authorization_code'
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + encode(`${clientId}:${clientSecret}`)
                    }
                },
            );

            const { access_token } = await response.data;

            // Use the access_token for Spotify API requests
            console.log('Access Token:', access_token);
            gotAccessToken = true;
            await getUserProfile(access_token);
            await getUsersTopItem(access_token);
        } catch (error) {
            console.error('Error exchanging authorization code for access token:', error);
        }
    };

    const getUserProfile = async (token) => {
        var userData = [];
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        const userProfile = response.data;
        userData.push(userProfile["country"])
        userData.push(userProfile["followers"]["total"])
        userData.push(userProfile["display_name"])
        userData.push(userProfile["email"])
        setUserProfileData(userData);
    }

    const getUsersTopItem = async (token) => {
        var topItems = [];
        const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        for (let item of response.data["items"]) {
            topItems.push(item["name"]);
        }

        setUserTopItems(topItems);
    }

    const handleQuit = () => {
        auth.currentUser.delete();
        navigation.replace("Login");
    }

    //gets a list of concert performers from firebase
    const getConcertArtists = () => {

    }

    //saves user data to firebase firestore
    const handleSave = async () => {

        console.log(name, bio, userTopItems, userProfileData)
        await uploadImageToFirebase(pfp);

        const imageUri = pfp;
        const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
        const url = await getImageUrl(fileName);

        const docRef = doc(db, "users", auth.currentUser?.email);
        await setDoc(docRef, {
            username: name,
            userBio: bio,
            userPfp: pfp, // no need anymore
            topArtists: userTopItems,
            userSpotifyData: userProfileData,
            ImageUrl: url
        });

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
                    placeholder="name"
                    value={name}
                    onChangeText={text => setName(text)}
                    style={styles.input}
                />
                <View style={styles.bioContainer}>
                    <ProfilePicture selectedImage={pfp} />
                    <TextInput
                        multiline={true}
                        numberOfLines={5}
                        textAlignVertical="top"
                        textAlign="left"
                        placeholder='bio'
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
        width: 170,
        height: 170,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    bioContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
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