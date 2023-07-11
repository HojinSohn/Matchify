import {SafeAreaView, ScrollView, Text, View} from "react-native";
import React from "react";
import UserProfile from "./UserProfile";

function UserPage({ allUserData }) {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                {allUserData.map((item, index) => {
                    return (
                        <View key={index}>
                            <UserProfile userData={item}> </UserProfile>
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}



export default UserPage