import React, {useEffect, useState} from 'react'
import {Button, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {auth, db, storage} from "../firebase";
import {useNavigation} from "@react-navigation/core";
import {doc, getDoc} from "firebase/firestore";
import {ref, getDownloadURL} from "firebase/storage";
import ProfilePicture from "../components/ProfilePicture";

const HomeScreen = () => {
    const navigation = useNavigation();
    const [showProfile, setShowProfile] = useState(false);
    const docRef = doc(db, "users", auth.currentUser?.email);
    const [userData, setUserData] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
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
    }, [userData]);



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
                    <Image source={{uri: imageUrl}} style={styles.profileImage}/>
                </View>
            )}

            <TouchableOpacity
                onPress={handleSignOut}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
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
    },
})