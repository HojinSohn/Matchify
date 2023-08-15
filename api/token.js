import axios from "axios";
import { encode } from 'base-64';
import {SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URL} from "@env"

var token = null;

const clientIdSpotify = SPOTIFY_CLIENT_ID;
const clientSecretSpotify = SPOTIFY_CLIENT_SECRET;
const redirectUri = SPOTIFY_REDIRECT_URL;
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
                    'Authorization': 'Basic ' + encode(`${clientIdSpotify}:${clientSecretSpotify}`)
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
    // console.log("getToken", SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URL)
    if (token !== null) {
        // console.log("The accessToken IS in token.js: ::::::::222", token);
        return token;
    }

    const auth = encode(`${clientIdSpotify}:${clientSecretSpotify}`);

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

export {exchangeCodeForAccessToken, getToken, clientIdSpotify, redirectUri};