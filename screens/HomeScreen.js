import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {auth, db} from "../firebase/firebase";
import {useNavigation} from "@react-navigation/core";
import {doc, getDoc, getDocs, collection} from "firebase/firestore";
import UserPage from "../components/UserPage";
import UserProfile from "../components/UserProfile";

const HomeScreen = () => {
    const navigation = useNavigation();
    const [showProfile, setShowProfile] = useState(false);
    const docRef = doc(db, "users", auth.currentUser?.email);
    const [userData, setUserData] = useState(null);
    // const [imageUrl, setImageUrl] = useState(null);
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
        // const getImage = async() => {
        //     if (userData) {
        //         const imageUri = userData["userPfp"];
        //         const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
        //         const url = await getImageUrl(fileName);
        //         setImageUrl(url);
        //         console.log("Homepage url check", url);
        //     }
        // }
        // getImage();
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

    const editProfile = async () => {
        navigation.replace("Prompt");
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
                <UserProfile userData={userData}></UserProfile>
            )}

            <TouchableOpacity onPress={editProfile} style={styles.button}>
                <Text style={styles.buttonText}>{'Edit Profile'}</Text>
            </TouchableOpacity>

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
                <UserPage allUserData ={allUserData} />
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