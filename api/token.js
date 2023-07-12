import axios from "axios";
// import {encode} from "base-64";
import { encode } from 'base-64';

var token = null;

const clientId = "c2f5a819d4684f8c9efc489144cb0e0a";
const clientSecret = '0cb4370ee5254a16aa2fd319290a15f5';
const redirectUri = 'exp://192.168.1.20:19000/--/';
const exchangeCodeForAccessToken = async (code) => {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                code: code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + encode(`${clientId}:${clientSecret}`)
                }
            },
        );

        const { access_token } = await response.data;

        // Use the access_token for Spotify API requests
        console.log('Access Token:', access_token);
        // gotAccessToken = true;
        token = access_token;
        // setToken(token);
        return access_token; // added
        // await getUserProfile(access_token);
        // await getUsersTopItem(access_token);
    } catch (error) {
        console.error('Error exchanging authorization code for access token:', error);
    }
};

const getToken = async () => {
    if (token !== null) {
        // console.log("The accessToken IS in token.js: ::::::::222", token);
        return token;
    }

    const auth = encode(`${clientId}:${clientSecret}`);

    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

    const accessToken =  await response.data.access_token;
    // console.log("The accessToken IS in token.js: ::::::::", accessToken);
    token = accessToken;
    return accessToken;


        // .then(response => {
        //     const accessToken = response.data.access_token.;
        //     console.log("Access token IS :::   ", accessToken);
        //     token = accessToken;
        //     return accessToken;
        // })
        // .catch(error => {
        //     console.error(error);
        // });
}

/*
curl -X POST "https://accounts.spotify.com/api/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret"
 */

export {exchangeCodeForAccessToken, getToken, clientId, redirectUri};