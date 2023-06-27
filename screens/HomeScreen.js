import React, {useEffect, useState} from 'react'
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {auth, db} from "../firebase";
import {useNavigation} from "@react-navigation/core";
import {doc, getDoc} from "firebase/firestore";

const HomeScreen = () => {
    const navigation = useNavigation();
    const [showProfile, setShowProfile] = useState(false);
    const docRef = doc(db, "users", auth.currentUser?.email);
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        getUserData();
    }, []);

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

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => alert(error.message))
    }

    const showProfileToggle = async () => {
        console.log("Hi", userData);
        setShowProfile(!showProfile);
    }

    return (
        <View style={(styles.container)}>
            <Button title="Show Profile" onPress={showProfileToggle} />
            {showProfile && (
                <View>
                    <Text>Email: {auth.currentUser?.email}</Text>
                    <Text>userBio: {userData["userBio"]}</Text>
                    <Text>userPfp: {userData["userPfp"]}</Text>
                    <Text>username: {userData["username"]}</Text>
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
})