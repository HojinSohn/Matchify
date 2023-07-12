import axios from "axios";
import {getToken} from "./token";

var token;

const getUserProfile = async () => {
    token = getToken();
    var userData = [];
    const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    const userProfile = response.data;
    userData.push(userProfile["country"])
    userData.push(userProfile["followers"]["total"])
    userData.push(userProfile["display_name"])
    userData.push(userProfile["email"])
    return userData;
    // setUserProfileData(userData);
}

const getUsersTopItem = async () => {
    token = getToken();
    var topItems = [];
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    for (let item of response.data["items"]) {
        topItems.push(item["name"] + "," + item["id"]);
    }
    return topItems;
    // setUserTopItems(topItems);
}

const getArtistInfo = async (id) => {
    token = getToken();
    // console.log("getArtistInfo token check: ", token);
    var info = {};
    try {
        const response = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        info.genres = response.data["genres"]
        info.imageUrl = response.data["images"][0]["url"]
        info.name = response.data["name"]
    } catch (error) {
        console.log("Error getArtistInfo token check: ", token);
        console.log("Error getArtistInfo: ", error);
    }
    return info;
}

export {getUserProfile, getUsersTopItem, getArtistInfo}