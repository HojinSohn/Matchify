import {SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import UserProfile from "./UserProfile";
import {getCurrentUserData} from "../firebase/firestore";
import {AntDesign} from "@expo/vector-icons";

function UserPage({ allUserData, }) {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState(null)
    const [inputFilter, setInputFilter] = useState(null)

    useEffect(() => {
        const processAllData = async () => {
            const newAllData = [];
            const currentUser = await getCurrentUserData();
            // console.log(currentUser["username"]);
            allUserData.forEach(userData => {
                // console.log(userData);
                if (userData["username"] !== currentUser["username"]) {

                    let found = false;
                    const artists = userData["topArtists"];
                    if (artists != null) {
                        artists.forEach(artistID => {
                            if (artistID?.toLowerCase().includes(filter?.toLowerCase())) {
                                found = true;
                            }
                        })
                    }

                    const tracks = userData["topTracks"];
                    if (tracks != null) {
                        tracks.forEach(trackID => {
                            if (trackID?.toLowerCase().includes(filter?.toLowerCase())) {
                                found = true;
                            }
                        })
                    }

                    if (found) {
                        newAllData.unshift(userData)
                    } else {
                        newAllData.push(userData);
                    }
                }
            })
            setData(newAllData);
        }
        processAllData();

    }, [filter])

    const search = async () => {
        setFilter(inputFilter);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text> Search:</Text>
                <TextInput
                    placeholder="keyword"
                    value={inputFilter}
                    onChangeText={text => setInputFilter(text)}
                    style={{marginHorizontal: 15}}
                />
                <TouchableOpacity onPress={search}>
                    <AntDesign name={"search1"} size={20}/>
                </TouchableOpacity>
            </View>
            <ScrollView>
                {data.map((item, index) => {
                    return (
                        <View key={index}>
                            <UserProfile userData={item}> </UserProfile>
                            {/*<UserProfile userData={allUserData[0]}> </UserProfile>*/}
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}



export default UserPage