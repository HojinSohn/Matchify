import {Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {auth} from "../firebase/firebase";
import ProfilePicture from "./ProfilePicture";
import React, {useEffect, useState} from "react";
import {getArtistInfo, getTrackInfo} from "../api/api";
import {getToken} from "../api/token";
import ArtistProfile from "./ArtistProfile";
import TrackProfile from "./TrackProfile";
import { Ionicons } from '@expo/vector-icons';
import {useNavigation} from "@react-navigation/core";

function UserProfile({userData}) {
    const navigation = useNavigation()
    const [artistProfileShow, setArtistProfileShow] = useState(false);
    const [trackProfileShow, setTrackProfileShow] = useState(false);
    const artistToggle = () => {
        setArtistProfileShow(!artistProfileShow);
    }

    const trackToggle = () => {
        setTrackProfileShow(!trackProfileShow);
    }

    const chatPress = () => {

    }
    return(
        <View style={styles.container}>
            <ProfilePicture selectedImage={userData["ImageUrl"]} size={350} style={styles.profileImage}/>

            <View style={styles.chatBox}>
                <View style={styles.textContainer}>
                    <Text style={styles.username}>{userData["username"]}</Text>
                    <Text style={styles.userBio}>{userData["userBio"]}</Text>
                </View>
                <TouchableOpacity onPress={chatPress}>
                    <Ionicons name="chatbubble-ellipses-outline" size={50} color="black"/>
                </TouchableOpacity>
            </View>

            {/*<Text>Top Artist: {userData["topArtists"]?.toString()}</Text>*/}
            {/*<Text>Spotify Data: {userData["userSpotifyData"]?.toString()}</Text>*/}
            <TouchableOpacity onPress={artistToggle} style={styles.button}>
                <Text style={styles.buttonText}>{artistProfileShow ? 'Hide Artists' : 'Show Artists'}</Text>
            </TouchableOpacity>
            { artistProfileShow && (
                <ScrollView style={styles.artistContainer} nestedScrollEnabled={true}>
                <ArtistProfiles userData={userData}></ArtistProfiles>
            </ScrollView>
            )}

            <TouchableOpacity onPress={trackToggle} style={styles.button}>
                <Text style={styles.buttonText}>{trackProfileShow ? 'Hide Tracks' : 'Show Tracks'}</Text>
            </TouchableOpacity>
            { trackProfileShow && (
                <ScrollView style={styles.artistContainer} nestedScrollEnabled={true}>
                <TrackProfiles userData={userData}></TrackProfiles>
            </ScrollView>)}

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

function TrackProfiles({userData}) {

    const [infos, setInfos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const tracksInfo = await processTracks(userData);
            setInfos(tracksInfo);
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
                                <Text style={styles.infoText}>Track Info:</Text>
                                <TrackProfile trackInfo={info} />
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

const processTracks = async (userData) => {
    const infos = [];
    try {
        if (userData["topTracks"] !== null) {
            for (const trackCode of userData["topTracks"]) {
                const trackID = trackCode.substring(trackCode.lastIndexOf(',') + 1);
                if (trackID !== null) {
                    const trackInfo = await getTrackInfo(trackID);
                    infos.push(trackInfo);
                }
            }
        }
    } catch (error) {
        console.log("Error processArtists: ", error);
    }
    return infos;
}

const styles = StyleSheet.create({
    chatBox: {
        flexDirection: "row",
        alignItems: "center"
    },
    button: {
        backgroundColor: '#0782F9',
        width: '30%',// 40
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 10,
    },
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
        backgroundColor: '#ffffff',
        borderColor: '#000000',
        borderWidth: 5
    },
    username: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "#000000"
    },
    userBio: {
        fontWeight: 300,
        fontSize: 15,
        marginBottom: 20,
        color: "#5a5a5a"
    },
    textContainer: {
        width: 300,
        alignItems: "flex-start",
    }
})

export default UserProfile
