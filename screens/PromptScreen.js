import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {auth, storage} from "../firebase/firebase";
import {useNavigation} from "@react-navigation/core";
import * as ImagePicker from 'expo-image-picker';
import ProfilePicture from "../components/ProfilePicture";
import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {ref, uploadBytes } from 'firebase/storage';
import {useAuthRequest} from "expo-auth-session";
import * as WebBrowser from 'expo-web-browser';
import { Entypo } from '@expo/vector-icons';
import {deleteImage, getImageUrl} from "../firebase/storage";
import {exchangeCodeForAccessToken, clientIdSpotify, redirectUri} from "../api/token";
import {getUserProfile, getUsersTopItem, getUsersTopTrack} from "../api/api";
import {getCurrentUserData, getCurrentUserDoc} from "../firebase/firestore";

const PromptScreen = () => {
    const navigation = useNavigation()
    const [pfp, setPfp] = useState(null)
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [userProfileData, setUserProfileData] = useState(null);
    const [userTopItems, setUserTopItems] = useState(null);
    const [userTopTracks, setUserTopTracks] = useState(null);
    const [prevPfp, setPrevPfp] = useState(null);
    const [prevImageUrl, setPrevImageUrl] = useState(null);
    var gotAccessToken = false;
    const [existingProfile, setExistingProfile] = useState(false);
    const [processing, setProcessing] = useState(false);

    WebBrowser.maybeCompleteAuthSession();


    const discovery = {
        authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        tokenEndpoint: 'https://accounts.spotify.com/api/token',
    };

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: clientIdSpotify,
            scopes: ['user-read-email', 'playlist-modify-public', 'user-top-read', 'user-read-private', 'playlist-read-private'],
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
            const docRef = await getCurrentUserDoc();
            docSnap = await getDoc(docRef);
            const userData = await getCurrentUserData();
            if (userData != null) {
                setExistingProfile(true);
                setName(userData["username"])
                setBio(userData["userBio"])
                setPfp(userData["ImageUrl"])
                setPrevPfp(userData["userPfp"])
                setPrevImageUrl(userData["ImageUrl"])
                setUserTopItems(userData["topArtists"])
                setUserProfileData(userData["userSpotifyData"])
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        checkDocExist();
    }, []);

    useEffect(() => {
        const getSpotifyData = async () => {
            try {
                if (response?.type === 'success') {
                    const {code} = response.params;
                    console.log(code);
                    // const access_token = await exchangeCodeForAccessToken(code); // it sets token in token.js
                    await exchangeCodeForAccessToken(code);
                    gotAccessToken = true;
                    const profileData = await getUserProfile();
                    setUserProfileData(profileData);
                    // console.log("wow")

                    const topItems = await getUsersTopItem();
                    setUserTopItems(topItems);

                    // console.log("wowwww")

                    const topTracks = await getUsersTopTrack();
                    setUserTopTracks(topTracks);
                    // Use the access token to make a request to the Spotify API
                }
            } catch (error) {
                console.log("Error in spotify data processing:::: ", error);
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
        setProcessing(true);
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
            const docRef = await getCurrentUserDoc();
            await updateDoc(docRef, {
                username: name,
                userBio: bio,
                userPfp: pfp,
                topArtists: userTopItems,
                userSpotifyData: userProfileData,
                topTracks: userTopTracks,
                ImageUrl: url
            })
        } else {
            console.log("handle save no ex")
            console.log(name, bio, userTopItems, userTopTracks, userProfileData)
            await uploadImageToFirebase(pfp);
            var url = null;
            if (pfp != null) {
                const fileName = pfp.substring(pfp.lastIndexOf('/') + 1);
                url = await getImageUrl(fileName);
            }
            const docRef = await getCurrentUserDoc();
            await setDoc(docRef, {
                username: name,
                userBio: bio,
                userPfp: pfp,
                topArtists: userTopItems,
                topTracks: userTopTracks,
                userSpotifyData: userProfileData,
                ImageUrl: url
            });
        }
        navigation.replace("Home")
    }

    //upload profile picture from device storage
    const pfpSelect = async () => {
        try {
            let imageGot = null;
            imageGot = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });

            setPfp(imageGot.assets[0].uri);

        } catch (error) {
            console.log(error);
        }


        // if (!imageGot.canceled) {

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
                disabled={processing}
                onPress={pfpSelect}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Upload Profile Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
                disabled={processing}
                onPress={handleSave}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
                disabled={processing}
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
        backgroundColor: "#FFE4B5",
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 10,
        marginVertical: 5,
    },
    button: {
        backgroundColor: '#FFA500',
        width: '60%',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
        borderColor: "#FF7A00",
        borderWidth: 1.5,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    }
})