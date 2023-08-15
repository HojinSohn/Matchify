import {useNavigation} from "@react-navigation/core";
import {
    StyleSheet,
    View,
    Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import React, {useEffect, useState} from "react";
import {MaterialIcons} from "@expo/vector-icons";
import MapView, {Marker} from 'react-native-maps';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {
    deleteAppointment,
    getChatRoomData,
    getChatRoomRef,
    getCurrentUserData,
    makeAppointment
} from "../firebase/firestore";

import {MAP_API_KEY} from "@env"

const mapApiKey = MAP_API_KEY;

const AppointmentScreen = (data) => {
    const navigation = useNavigation();
    const chatUserData = data.route.params?.param;
    const [appData, setAppData] = useState(null);
    const [timeString, setTimeString] = useState("Not Set");
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [ampm, setAmpm] = useState('');
    const [location, setLocation] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })
    const [address, setAddress] = useState(null)
    const [dataProcessing, setDataProcessing] = useState(false);


    useEffect(() => {
        setTimeString(month + " " + day + ", " + hour + ":" + minute + " " + ampm)
    }, [month, day, hour, minute, ampm])

    useEffect(() => {
        const fetchdata = async () => {
            const chatRoomRef
                = await getChatRoomRef(chatUserData["username"], (await getCurrentUserData())["username"])
            const roomData = await getChatRoomData(chatRoomRef);
            await setAppData(roomData.appointmentData)
            if (roomData.appointmentData != null) {
                setAddress(roomData.appointmentData.address)
                setLocation(roomData.appointmentData.location);
                setTimeString(roomData.appointmentData.time)
            }
        }
        fetchdata();

    }, [])

    const pressAM = async () => {
        setAmpm("AM");
    }

    const pressPM = async () => {
        setAmpm("PM");
    }

    const donePress = async () => {
        if (day !== '' &&
            hour !== '' &&
            minute !== '' &&
            ampm !== '' &&
            location !== null) {
            setDataProcessing(true)
            const chatRef
                = await getChatRoomRef(chatUserData["username"], (await getCurrentUserData())["username"]);
            const appointmentData = {time: timeString, location: location, address: address}
            await makeAppointment(chatRef, appointmentData);
            navigation.replace("ChatRoom", {param : chatUserData})
        }

        if (appData !== null) {
            navigation.replace("ChatRoom", {param : chatUserData})
        }
    }

    const goBack = async () => {
        navigation.replace("ChatRoom", {param : chatUserData})
    }

    const removeAppointment = async () => {
        setDataProcessing(true);
        const chatRef
            = await getChatRoomRef(chatUserData["username"], (await getCurrentUserData())["username"]);
        await deleteAppointment(chatRef);
        navigation.replace("ChatRoom", {param : chatUserData})
    }

    if (appData != null) {
        return (
            <View
                style={styles.container}
            >
                <View style={styles.timeContainer}>
                    <Text>Appointment Time</Text>
                    <View style={styles.timeDisplay}>
                        <Text>{timeString}</Text>
                    </View>
                </View>
                <Text>Appointment Location</Text>
                <View style={styles.locationContainer}>
                    <Text>{address}</Text>
                    <MapView style={styles.map}
                             initialRegion={location}
                             region={location}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            title={"hi"}
                            description={"des"}
                        />
                    </MapView>
                </View>
                <View style={{alignItems: "flex-end", flex: 0, flexDirection: "row", justifyContent: "space-between"}}>
                    <TouchableOpacity style={{width: "20%", alignItems: "center"}} onPress={goBack}>
                        <MaterialIcons name="arrow-back" size={40} color="black"/>
                    </TouchableOpacity>
                    {(dataProcessing) ?
                        <ActivityIndicator size={40}/> :
                        <TouchableOpacity style={{width: "40%", height: "100%", alignItems: "center", backgroundColor: "white"}} onPress={removeAppointment}>
                            <Text>Delete Appointment</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    } else {
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.timeContainer}>
                    <Text>Appointment Time</Text>
                    <View style={styles.timeDisplay}>
                        <Text>{timeString}</Text>
                    </View>
                    <View style={styles.timeSetter}>
                        <View style={styles.timeComponent}>
                            <Text> Month </Text>
                            <TextInput
                                placeholder="Month"
                                value={month}
                                onChangeText={text => setMonth(text)}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.timeComponent}>
                            <Text> Day </Text>
                            <TextInput
                                placeholder="0"
                                value={day}
                                onChangeText={text => setDay(text)}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.timeComponent}>
                            <Text> Hour </Text>
                            <TextInput
                                placeholder="0"
                                value={hour}
                                onChangeText={text => setHour(text)}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.timeComponent}>
                            <TouchableOpacity onPress={pressAM} style={styles.button}>
                                <Text>AM</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pressPM} style={styles.button}>
                                <Text>PM</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.timeComponent}>
                            <Text> Minute </Text>
                            <TextInput
                                placeholder="0"
                                value={minute}
                                onChangeText={text => setMinute(text)}
                                style={styles.input}
                            />
                        </View>
                    </View>
                </View>
                <Text>Set Location</Text>
                <View style={styles.locationContainer}>
                    <GooglePlacesAutocomplete
                        placeholder='Search'
                        onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            console.log(data, "\n", details);
                            setLocation({
                                latitude: details.geometry.location.lat,
                                longitude: details.geometry.location.lng,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            })
                            setAddress(data.description);
                        }}
                        query={{
                            key: mapApiKey,
                            language: 'en',
                            location: `${location.latitude}, ${location.longitude}`
                        }}
                        fetchDetails={true}
                        styles={{
                            container: {
                                flex: 0,
                                position: "absolute",
                                width: "100%",
                                zIndex: 1
                            },
                            textInput: {
                                height: 38,
                                color: '#5d5d5d',
                                fontSize: 16,
                            },
                            predefinedPlacesDescription: {
                                color: '#1faadb',
                            },
                        }}
                    />
                    <MapView style={styles.map}
                             initialRegion={location}
                             region={location}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            title={"hi"}
                            description={"des"}
                        />
                    </MapView>
                </View>
                <View style={{alignItems: "flex-end", flex: 0, flexDirection: "row", justifyContent: "space-between"}}>
                    <TouchableOpacity style={{width: "20%", alignItems: "center"}} onPress={goBack}>
                        <MaterialIcons name="arrow-back" size={40} color="black"/>
                    </TouchableOpacity>

                    {(dataProcessing) ?
                        <ActivityIndicator size={40}/> :
                        <TouchableOpacity style={{width: "20%", alignItems: "center"}} onPress={donePress}>
                            <MaterialIcons name="check" size={40} color="black"/>
                        </TouchableOpacity>
                    }

                </View>
            </KeyboardAvoidingView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    timeContainer: {
        flex: 0.5,
        borderWidth: 1,
        borderColor: "black",
        margin: 1,
        zIndex: 1,
        justifyContent: "center"
    },
    timeSetter: {
        flex: 0.5,
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    timeComponent: {
        borderWidth: 1,
        borderColor: "black",
        justifyContent: "center",
    },
    timeDisplay: {
        flex: 0.2,
        marginVertical: 15,
        justifyContent: "center"
    },
    locationContainer: {
        flex: 0.9,
        margin: 1,
    },
    input: {
        backgroundColor: 'yellow',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop:5,
    },
    button: {
        marginVertical: 5,
        marginHorizontal: 5,
        padding: 3,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5
    },
    map: {
        width: '100%',
        height: '100%',
    },
});


export default AppointmentScreen;

