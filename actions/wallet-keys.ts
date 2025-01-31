"use server"

import {ethers} from "ethers";
import crypto from "crypto";

export async function generateKeyPair() {
    const wallet = ethers.Wallet.createRandom();

    // Extract the public and private keys
    const privateKey = wallet.privateKey; // Private key
    const publicKey = wallet.address;    // Public key (Ethereum address)
    
    const cipherPrivateKey = await encrypt(privateKey);
    
    return { publicKey, cipherPrivateKey };
}

export async function encrypt(plainText: string) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");
    const iv = Buffer.from(process.env.ENCRYPTION_IV!, "hex");

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");

    return encrypted;
}

  
export async function decrypt(encryptedText: string) {
    // The encryption key must be 32 bytes (for AES-256)
    const key = Buffer.from(process.env.ENCRYPTION_KEY!, "hex"); 
    const iv = Buffer.from(process.env.ENCRYPTION_IV!, "hex"); // The same IV used during encryption

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}

