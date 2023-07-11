import axios from "axios";

const getUserProfile = async (token) => {
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

const getUsersTopItem = async (token) => {
    var topItems = [];
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    for (let item of response.data["items"]) {
        topItems.push(item["name"]);
    }
    return topItems;
    // setUserTopItems(topItems);
}

export {getUserProfile, getUsersTopItem}