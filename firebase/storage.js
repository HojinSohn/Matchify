import {getDownloadURL, ref} from "firebase/storage";
import {storage} from "./firebase";

const getImageUrl = async (fileName) => {
    try {
        const imageRef = ref(storage, `images/${fileName}`);
        let url;
        const downloadURL = await getDownloadURL(imageRef).then((x) => {
            url = x;
            console.log("WTFFF, ", url);
        });
        return (url);

    } catch (error) {
        console.log('Error uploading image:', error);
    }
};

export {getImageUrl};