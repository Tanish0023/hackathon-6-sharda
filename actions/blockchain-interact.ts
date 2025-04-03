"use server";

import { db } from "@/lib/db";
import { ethers } from "ethers";

// Updated ABI to match the revised contract
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "addCredits",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "CreditsMinted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "CreditsTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "initializeUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferCredits",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "UserCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isUserInitialized",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "userExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Configuration
const CONTRACT_ADDRESS = '0xE3Ca443c9fd7AF40A2B5a95d43207E763e56005F'; // Replace with the new address after redeploying
const PROVIDER_URL = 'https://eth-sepolia.g.alchemy.com/v2/5PdkNmU-khw3HZ5uPlRZkVnD9SkG6Bo7';
const ADMIN_PRIVATE_KEY = "0xc9980858da1db9c205ba7a875d10d1b9b7caea47b46172a226d9bd16edf9f689";

// Initialize provider and contract
const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, adminWallet);

// Type definitions
interface User {
  id: string;
  publicKey: string;
}

interface TransactionResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * Adds credits to a user's account using admin wallet
 */
export async function addCredits(userId: string, amount: number): Promise<TransactionResponse> {
  try {
    if (amount <= 0) throw new Error("Amount must be positive");

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { publicKey: true }
    });

    if (!user || !ethers.isAddress(user.publicKey)) {
      return { success: false, error: "Invalid user or address" };
    }

    const gasEstimate = await contract.addCredits.estimateGas(user.publicKey, amount);
    const gasPrice = await provider.getFeeData();
    const gasLimit = (gasEstimate * BigInt(12)) / BigInt(10);

    const tx = await contract.addCredits(user.publicKey, amount, {
      gasLimit,
      gasPrice: gasPrice.gasPrice,
    });

    const receipt = await tx.wait();
    console.log("Credits added to user", userId, "tx hash:", receipt.transactionHash);

    return { success: true, transactionHash: receipt.transactionHash };
  } catch (error) {
    console.error("Error adding credits for user", userId, ":", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Transaction failed"
    };
  }
}

/**
 * Transfers credits between users using admin wallet
 */
export async function transferCredits(
  userId: string,
  recipientId: string,
  amount: number
): Promise<TransactionResponse> {
  try {
    if (amount <= 0) throw new Error("Amount must be positive");
    if (userId === recipientId) throw new Error("Cannot transfer to self");

    const [user, recipient] = await Promise.all([
      db.user.findUnique({ where: { id: userId }, select: { publicKey: true } }),
      db.user.findUnique({ where: { id: recipientId }, select: { publicKey: true } })
    ]);

    if (!user || !ethers.isAddress(user.publicKey)) {
      return { success: false, error: "Invalid sender" };
    }
    if (!recipient || !ethers.isAddress(recipient.publicKey)) {
      return { success: false, error: "Invalid recipient" };
    }

    const senderBalance = await contract.getBalance(user.publicKey);
    if (senderBalance < BigInt(amount)) {
      return { success: false, error: "Insufficient credits" };
    }

    const gasEstimate = await contract.transferCredits.estimateGas(user.publicKey, recipient.publicKey, amount);
    const gasPrice = await provider.getFeeData();
    const gasLimit = (gasEstimate * BigInt(12)) / BigInt(10);

    const tx = await contract.transferCredits(user.publicKey, recipient.publicKey, amount, {
      gasLimit,
      gasPrice: gasPrice.gasPrice,
    });

    const receipt = await tx.wait();
    console.log("Credits transferred from", userId, "to", recipientId, "tx hash:", receipt.transactionHash);

    return { success: true, transactionHash: receipt.transactionHash };
  } catch (error) {
    console.error("Error transferring credits:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Transaction failed"
    };
  }
}

/**
 * Gets a user's credit balance
 */
export async function getBalance(userId: string): Promise<string> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { publicKey: true }
    });

    if (!user) {
      console.error("User not found in database:", userId);
      return "0";
    }
	console.log(user);
	

    if (!ethers.isAddress(user.publicKey)) {
      console.error("Invalid Ethereum address for user", userId, ":", user.publicKey);
      return "0";
    }

    console.log("Fetching balance for user", userId, "with address:", user.publicKey);

	// const a = await contract.["getBalance"](user.publicKey);
	
    const balance = await contract.getBalance(user.publicKey);
    const balanceStr = balance.toString();
    
    if (balanceStr === "0") {
      console.log("No balance recorded for user", userId, "at address:", user.publicKey);
    } else {
      console.log("Balance retrieved for user", userId, ":", balanceStr);
    }
    
    return balanceStr;
  } catch (error: any) {
    console.error("Error retrieving balance for user", userId, ":", error);
    if (error.code === "BAD_DATA") {
      console.error("BAD_DATA error details:", error);
      console.error("Likely ABI mismatch or incorrect contract address:", CONTRACT_ADDRESS);
    }
    return "0"; // Default to 0 for any error
  }
}

/**
 * Debug function to test contract
 */
export async function testContract() {
  try {
    const owner = await contract.owner();
    console.log("Contract owner:", owner);
    const balance = await contract.getBalance("0x140BebB540a6BDe55E8d7345dF22D105Cb542E23");
    console.log("Test balance:", balance.toString());
    const exists = await contract.userExists("0x140BebB540a6BDe55E8d7345dF22D105Cb542E23");
    console.log("User exists:", exists);
    return true;
  } catch (error) {
    console.error("Contract test failed:", error);
    return false;
  }
}