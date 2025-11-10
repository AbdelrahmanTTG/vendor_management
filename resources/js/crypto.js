import CryptoJS from "crypto-js";

const SALT = window.APP_KEY;
export const encryptData = (data) => {
    const stringData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringData, SALT).toString();
};
export const decryptData = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, SALT);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
};
