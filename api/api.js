import axios from "axios";
import {getToken} from "./token";

var token;

const clientSecretSeatGeek = "2ab3ea2c018b688727e1d978874ac6b72c1909217701fa45624cbf778d4b64d7";
const clientIDSeatGeek = "MzUxOTgwMzN8MTY5MDQxNjE2My4zMTExMzQ2";

const getUserProfile = async () => {
    token = await getToken();
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
    try {
        token = await getToken();
        var topItems = [];
        const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        for (let item of response.data["items"]) {
            topItems.push(item["name"] + "," + item["id"]);
        }
    } catch (error) {
        console.log("What error in getUserTopItem, ", error);
    }
    return topItems;
    // setUserTopItems(topItems);
}

const getArtistInfo = async (id) => {
    token = await getToken();
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
        console.log("Error getArtistInfo id check: ", id);
        console.log("Error getArtistInfo: ", error);
    }
    return info;
}

const getTrackInfo = async (id) => {
    token = await getToken();
    // console.log("getArtistInfo token check: ", token);
    var info = {};
    try {
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        info.imageUrl = response.data["album"]["images"][0]["url"]
        info.name = response.data["name"]
        info.artist = response.data["artists"][0]["name"]
        info.artistID = response.data["artists"][0]["id"]
    } catch (error) {
        console.log("Error getTrackInfo token check: ", token);
        console.log("Error getTrackInfo id check: ", id);
        console.log("Error getTrackInfo: ", error);
    }
    return info;
}

const getUsersTopTrack = async () => {
    token = await getToken();
    var topItems = [];
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10&offset=0', {
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

const getEventsByName = async () => {
    const response = await axios.get(`https://api.seatgeek.com/2/performers?q=${name}&client_id=${clientIDSeatGeek}&client_secret=${clientSecretSeatGeek}`);
    console.log("getEvents::::", response.data);
    // setUserProfileData(userData);
}


export {getUserProfile, getUsersTopItem, getArtistInfo, getUsersTopTrack, getTrackInfo,getEventsByName}