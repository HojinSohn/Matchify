import {getDownloadURL, ref, deleteObject} from "firebase/storage";
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
        console.log('Error getting URL:', error);
    }
};

const deleteImage = async (fileName) => {
    const imageRef = ref(storage, `images/${fileName}`);
    await deleteObject(imageRef);
    console.log("delete complete, ", fileName);
}

export {getImageUrl, deleteImage};