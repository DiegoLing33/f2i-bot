import axios from "axios";

/**
 * Base64 utils
 */
const Base64 = {

    /**
     * Downloads image
     * @param url
     */
    async downloadImage(url: string): Promise<string> {
        try {
            const response = await axios.get(url, {responseType: 'arraybuffer'});
            return Promise.resolve(Buffer.from(response.data, 'binary').toString('base64'));
        } catch (e) {
            return Promise.reject(e);
        }
    }
};

export default Base64;