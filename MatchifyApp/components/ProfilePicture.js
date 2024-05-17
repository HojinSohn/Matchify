import {Image} from 'react-native'
function ProfilePicture({ selectedImage, size}) {
    if (selectedImage === null || selectedImage === undefined) {
        return (
            <Image
                source={require('../assets/default_pfp.jpeg')}
            />
        )
    } else {
        return (
            <Image
                source={{uri: selectedImage}} style={{ width: size, height: size, borderRadius: 15}}
            />
        )
    }
}

export default ProfilePicture