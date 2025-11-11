import CryptoJS from "crypto-js";

const secretKey = window.APP_KEY;
let key = CryptoJS.SHA256(secretKey); 
let iv = CryptoJS.enc.Hex.parse(key.toString().substr(0, 32));

export const encryptData = (data) => {
    const stringData = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(stringData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString(); 
};

export const decryptData = (cipherText) => {
    const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
};
