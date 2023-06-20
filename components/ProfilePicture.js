import { Image } from 'react-native'

function ProfilePicture({ selectedImage }) {

    if (selectedImage === null) {
        return (
            <Image
                source={require('../assets/default_pfp.jpeg')}
            />
        )
    } else {
        return (
            <Image
                source={{uri: selectedImage}}
            />
        )
    }
}



export default ProfilePicture