import React, {useEffect, useState} from 'react'
import {Button, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {auth, db, storage} from "../firebase";
import {useNavigation} from "@react-navigation/core";
import {doc, getDoc, getDocs, collection} from "firebase/firestore";
import {ref, getDownloadURL} from "firebase/storage";
import ProfilePicture from "../components/ProfilePicture";

const HomeScreen = () => {
    const navigation = useNavigation();
    const [showProfile, setShowProfile] = useState(false);
    const docRef = doc(db, "users", auth.currentUser?.email);
    const [userData, setUserData] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [allUserData, setAllUserData] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (!user) {
                navigation.replace('Login');
            }
        });

        const getUserData = async() => {
            try {
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());
                    setUserData(docSnap.data());
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            } catch (error) {
                console.log(error)
            }
        }
        getUserData();
    }, []);

    useEffect(() => {
        const getImage = async() => {
            if (userData) {
                const imageUri = userData["userPfp"];
                const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
                const imageRef = ref(storage, `images/${fileName}`);
                let url;
                const downloadURL = await getDownloadURL(imageRef).then((x) => {
                    url = x;
                    console.log("WTFFF, ", url);
                });
                setImageUrl(url);
            }
        }
        getImage();
        const getAllData = async() => {
            const userDocs = await getDocs(collection(db, "users"));
            const temp = []
            userDocs.forEach((doc) => {
                temp.push(doc.data());
            })
            console.log("Hey this is user data, ", temp[0]["username"]);
            setAllUserData(temp);
        }
        getAllData();
    }, [userData]);

    const showAllUserData = async () => {
        setDataLoaded(!dataLoaded);
    }

    const getImageFromFirebase = async (imageUri) => {
        try {
            const fileName = imageUri.substring(imageUri.lastIndexOf('/')+1);
            const imageRef = ref(storage, `images/${fileName}`);

            const downloadURL = await getDownloadURL(imageRef);
        } catch (error) {
            console.log('Error uploading image:', error);
        }
    };

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => alert(error.message))
    }

    const showProfileToggle = async () => {
        // console.log("Hi", userData);
        // console.log("Hi!!!!!!!", imageUrl);
        setShowProfile(!showProfile);
    }

    const profiles = () => {
        const renderViews = allUserData.map((item, index) => (
            <View key={index}>
                <Text>{item}</Text>
            </View>
        ));
        return renderViews;
    }

    return (
        <View style={(styles.container)}>
            <TouchableOpacity onPress={showProfileToggle} style={styles.button}>
                <Text style={styles.buttonText}>{showProfile ? 'Hide Profile' : 'Show Profile'}</Text>
            </TouchableOpacity>
            {showProfile && (
                <View>
                    <Text>Email: {auth.currentUser?.email}</Text>
                    <Text>username: {userData["username"]}</Text>
                    <Text>userBio: {userData["userBio"]}</Text>
                    <Text>Top Artist: {userData["topArtists"].toString()}</Text>
                    <Text>Spotify Data: {userData["userSpotifyData"].toString()}</Text>
                    <Image source={{uri: imageUrl}} style={styles.profileImage}/>
                </View>
            )}

            <TouchableOpacity
                onPress={handleSignOut}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={showAllUserData} style={styles.button}>
                <Text style={styles.buttonText}>{dataLoaded ? 'Hide Data' : 'Show Data'}</Text>
            </TouchableOpacity>
            {dataLoaded && (
                allUserData.map((item, index) => (
                    <View key={index}>
                        <Text>------------------------</Text>
                        <Text>username: {item["username"]}</Text>
                        <Text>userBio: {item["userBio"]}</Text>
                        <Text>Top Artist: {item["topArtists"]?.toString()}</Text>
                        <Text>Spotify Data: {item["userSpotifyData"]?.toString()}</Text>
                        <Text>------------------------</Text>
                    </View>
                ))
                // <View>
                //     <Text>username: {allUserData[1]["username"]}</Text>
                //     <Text>userBio: {allUserData[1]["userBio"]}</Text>
                //     <Text>Top Artist: {allUserData[1]["topArtists"].toString()}</Text>
                //     <Text>Spotify Data: {allUserData[1]["userSpotifyData"].toString()}</Text>
                //     <Image source={{uri: imageUrl}} style={styles.profileImage}/>
                // </View>
            )}
        </View>
    )
}

export default HomeScreen

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
    },
    profileImage: {
        width: 150,
        height: 150,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
})