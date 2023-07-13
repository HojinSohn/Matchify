import {Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import {auth} from "../firebase/firebase";
import ProfilePicture from "./ProfilePicture";
import React, {useEffect, useState} from "react";
import {getArtistInfo} from "../api/api";
import {getToken} from "../api/token";
import ArtistProfile from "./ArtistProfile";

function UserProfile({userData}) {
    // processArtists(userData);  // this is repetitive maybe just call once and save that data here.
    //                                 // because api call only once
    return(
        <View style={styles.container}>
            <Text style={styles.username}>username: {userData["username"]}</Text>
            <Text style={styles.userBio}>userBio: {userData["userBio"]}</Text>
            {/*<Text>Top Artist: {userData["topArtists"]?.toString()}</Text>*/}
            {/*<Text>Spotify Data: {userData["userSpotifyData"]?.toString()}</Text>*/}

            <ProfilePicture selectedImage={userData["ImageUrl"]} size={350} style={styles.profileImage}/>
            <ScrollView style={styles.artistContainer} nestedScrollEnabled={true}>
                <ArtistProfiles userData={userData}></ArtistProfiles>
            </ScrollView>
        </View>
    )
}

function ArtistProfiles({userData}) {

    const [infos, setInfos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const artistsInfo = await processArtists(userData);
            setInfos(artistsInfo);
        };

        fetchData();
    }, [userData]);

    return (
        <ScrollView style={{backgroundColor: '#000000', padding: 15}}>
            {
                (infos !== null && infos !== undefined) ? (
                    infos.map((info, index) => {
                        return (
                            <View key={index} style={styles.infoContainer}>
                                <Text style={styles.infoText}>Artist Info:</Text>
                                <ArtistProfile artistInfo={info} />
                            </View>
                        );
                    })
                ) : (
                    <View>
                        {/*return (<Text>No Info</Text>)*/}
                    </View>
                )}
        </ScrollView>
    );
}

const processArtists = async (userData) => {
    const infos = [];
    try {
        if (userData["topArtists"] !== null) {
            for (const artistCode of userData["topArtists"]) {
                const artistID = artistCode.substring(artistCode.indexOf(',') + 1);
                if (artistID !== null) {
                    const artistInfo = await getArtistInfo(artistID);
                    infos.push(artistInfo);
                }
            }
        }
    } catch (error) {
        console.log("Error processArtists: ", error);
    }
    return infos;
}

const styles = StyleSheet.create({
    profileImage: {
        width: 200,
        height: 200,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    artistContainer: {
        maxHeight: 500,
        margin: 15
    },
    infoContainer: {
        marginBottom: 20,
        width: Dimensions.get('window').width * 0.7,
    },
    infoText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    container: {
        flex: 1,
        // minHeight: 800,
        padding: 15,
        margin: 10,
        alignItems: "center",
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderWidth: 5
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    userBio: {
        fontSize: 16,
        marginBottom: 20,
    },
    // profileImage: {
    //     width: 200,
    //     height: 200,
    //     borderRadius: 50,
    //     marginBottom: 100,
    // },
})

export default UserProfile
