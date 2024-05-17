import {Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ProfilePicture from "./ProfilePicture";
import React, {useEffect, useState} from "react";
import {getArtistInfo, getTrackInfo} from "../api/api";
import ArtistProfile from "./ArtistProfile";
import TrackProfile from "./TrackProfile";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import {useNavigation} from "@react-navigation/core";
import {heartAdd, heartDelete} from "../firebase/firestore";

var screenWidth = Dimensions.get('window').width;
function UserProfile({userData}) {
    const navigation = useNavigation()
    const [artistProfileShow, setArtistProfileShow] = useState(false);
    const [trackProfileShow, setTrackProfileShow] = useState(false);
    const [heartClicked, setHeartClicked] = useState(false);
    const artistToggle = () => {
        setArtistProfileShow(!artistProfileShow);
    }

    const trackToggle = () => {
        setTrackProfileShow(!trackProfileShow);
    }

    const chatPress = () => {
        navigation.replace("ChatRoom", {param : userData})
    }

    const heartPress = () => {
        if (!heartClicked) {
            heartAdd(userData["username"]);
        } else {
            heartDelete(userData["username"]);
        }
        setHeartClicked(!heartClicked);
    }

    const data = [
        { id: '1', content: 'Page 1' },
        { id: '2', content: 'Page 2' },
        { id: '3', content: 'Page 3'}
    ];

    const renderItem = ({ item }) => {
        return (
            <View>
                {renderPageContent(item.content)}
            </View>
        );
    };

    const renderPageContent = (content) => {
        switch (content) {
            case 'Page 1':
                return (
                    <View style={styles.pageContainer}>
                        <ProfilePicture selectedImage={userData["ImageUrl"]} size={screenWidth * 0.95}/>
                    </View>
                )
            case 'Page 2':
                return (
                    <View style={styles.pageContainer}>
                            <ScrollView style={styles.artistContainer} nestedScrollEnabled={true}>
                                <View style={{width: "100%", alignItems: "center"}}>
                                    <Text style={{fontWeight: "bold"}}>Top Artists</Text>
                                </View>
                                <ArtistProfiles userData={userData}></ArtistProfiles>
                            </ScrollView>
                    </View>
                )
            case 'Page 3':
                return (<View style={styles.pageContainer}>
                        <ScrollView style={styles.artistContainer} nestedScrollEnabled={true}>
                            <View style={{width: "100%", alignItems: "center"}}>
                                <Text style={{fontWeight: "bold"}}>Top Tracks</Text>
                            </View>
                            <TrackProfiles userData={userData}></TrackProfiles>
                        </ScrollView>
                </View>)
            default:
                return null;
        }
    };



    return(
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
            />
            <View style={styles.chatBox}>
                <View style={styles.textContainer}>
                    <Text style={styles.username}>{userData["username"]}</Text>
                    <Text style={styles.userBio}>{userData["userBio"]}</Text>
                </View>
                <View style={{flexDirection: "column", alignItems: "center"}}>
                    <TouchableOpacity onPress={chatPress}>
                        <Ionicons name="chatbubble-ellipses-outline" size={50} color="black"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={heartPress}>
                        { (heartClicked) ? (<AntDesign name="heart" size={40} color="red" />)
                            : ( <AntDesign name="hearto" size={40} color="black" />)}
                    </TouchableOpacity>
                </View>
            </View>
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

    if (infos == null || infos.length === 0) {
        return (
            <View style={{width: "100%", alignItems: "center"}}>
                <Text style={{fontSize: 30}}>No Info</Text>
            </View>
        )
    } else {
        return (
            <ScrollView style={{backgroundColor: '#000000', padding: 15}}>
                {
                        infos.map((info, index) => {
                            return (
                                <View key={index} style={styles.infoContainer}>
                                    <Text style={styles.infoText}>Artist Info:</Text>
                                    <ArtistProfile artistInfo={info}/>
                                </View>
                            );
                        })
                }
            </ScrollView>
        );
    }
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

    if (infos == null || infos.length === 0) {
        return (
            <View style={{width: "100%", alignItems: "center"}}>
                <Text style={{fontSize: 30}}>No Info</Text>
            </View>
        )
    } else {
        return (
            <ScrollView style={{backgroundColor: '#000000', padding: 15}}>
                {
                    infos.map((info, index) => {
                        return (
                            <View key={index} style={styles.infoContainer}>
                                <Text style={styles.infoText}>Track Info:</Text>
                                <TrackProfile trackInfo={info} />
                            </View>
                        );
                    })
                }
            </ScrollView>
        );
    }
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
        alignItems: "center",
        marginVertical: 10,
        borderColor: "black",
        borderWidth: 3,
        borderRadius: 15,
        padding: 5,
        backgroundColor: "#ffffff",
        width: screenWidth * 0.95,
    },
    artistContainer: {
        maxHeight: 500,
        width: screenWidth * 0.95,
        marginBottom: 15
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
    container: {
        flex: 1,
        width: screenWidth,
        height: Dimensions.get('window').height * 0.8,
        marginVertical: 15,
        paddingVertical: 15,
        alignItems: "center",
        // backgroundColor: '#b5f5ff',
        backgroundColor: '#ffe4b5',
        // backgroundColor: '#ff8924',
        borderRadius: 10
    },
    pageContainer: {
        flex: 1,
        width: screenWidth,
        paddingTop: 15,
        alignItems: "center",
        // backgroundColor: '#ffe4b5',
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

export {ArtistProfiles, TrackProfiles}
