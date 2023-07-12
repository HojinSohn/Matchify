import {SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
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
        <View>
            <Text>username: {userData["username"]}</Text>
            <Text>userBio: {userData["userBio"]}</Text>
            {/*<Text>Top Artist: {userData["topArtists"]?.toString()}</Text>*/}
            {/*<Text>Spotify Data: {userData["userSpotifyData"]?.toString()}</Text>*/}

            <ProfilePicture selectedImage={userData["ImageUrl"]} style={styles.profileImage}/>
            <ArtistProfiles userData={userData}></ArtistProfiles>
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

    return (<SafeAreaView style={styles.container}>
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

                // (infos !== null && infos !== undefined) ? (
                // infos.map((info, index) => {
                //     return (
                //         <View key={index}>
                //             <ArtistProfile artistInfo={info}> </ArtistProfile>
                //         </View>
                //     );
                // })
            ) : (
                <View>
                    {/*return (<Text>No Info</Text>)*/}
                </View>
            )}
        </ScrollView>
    </SafeAreaView>);
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
        width: 150,
        height: 150,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 15,
    },
    infoContainer: {
        marginBottom: 20,
    },
    infoText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
})

export default UserProfile