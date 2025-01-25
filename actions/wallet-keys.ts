"use server"

import {ethers} from "ethers";
import crypto from "crypto";

export async function generateKeyPair() {
  // Generate a new wallet
    console.log("Hello ");

    const wallet = ethers.Wallet.createRandom();

    // Extract the public and private keys
    const privateKey = wallet.privateKey; // Private key
    const publicKey = wallet.address;    // Public key (Ethereum address)

    console.log("Public Key (Address):", publicKey);
    console.log("Private Key:", privateKey); 
    
    const cipherPrivateKey = encrypt(privateKey);

    

    return { publicKey, cipherPrivateKey };
}

function encrypt(text:any) {
    const algorithm = "aes-256-cbc";
    const key = crypto.randomBytes(32); // Generate a 32-byte key
    const iv = crypto.randomBytes(16); // Generate a 16-byte IV

    // Encrypt
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return encrypted;
}
  
// function decrypt(encryptedText, encryptionKey) {
//     const decipher = crypto.createDecipher("aes-256-cbc", encryptionKey);
//     let decrypted = decipher.update(encryptedText, "hex", "utf8");
//     decrypted += decipher.final("utf8");
//     return decrypted;
// }

