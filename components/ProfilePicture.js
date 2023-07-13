import {Image} from 'react-native'
function ProfilePicture({ selectedImage, size}) {

    if (selectedImage === null || selectedImage === undefined) {
        return (
            <Image
                source={require('../assets/default_pfp.jpeg')}
            />
        )
    } else {
        // console.log("hello", selectedImage);
        return (
            <Image
                source={{uri: selectedImage}} style={{ width: size, height: size , margin: 5,
                                                        borderWidth: 5, borderColor: "#C0C0C0"}}
                // source={{uri: selectedImage}}
            />
        )
    }
}

export default ProfilePicture