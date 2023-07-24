import {SafeAreaView, ScrollView, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import UserProfile from "./UserProfile";
import {getCurrentUserData} from "../firebase/firestore";

function UserPage({ allUserData }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const processAllData = async () => {
            const newAllData = [];
            const currentUser = await getCurrentUserData();
            console.log(currentUser["username"]);
            allUserData.forEach(userData => {
                console.log(userData["username"]);
                if (userData["username"] !== currentUser["username"]) {
                    newAllData.push(userData);
                }
            })
            setData(newAllData);
        }
        processAllData();
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
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