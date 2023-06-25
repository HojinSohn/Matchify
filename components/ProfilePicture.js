import { Image } from 'react-native'

function ProfilePicture({ selectedImage }) {

    if (selectedImage === null) {
        return (
            <Image
                source={require('../assets/default_pfp.jpeg')}
            />
        )
    } else {
        console.log("hello", selectedImage);
        return (
            <Image
                source={{uri: selectedImage}} style={{ width: 200, height: 200 }}
            />
        )
    }
}



export default ProfilePicture