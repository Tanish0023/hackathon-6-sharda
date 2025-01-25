import { ethers } from "ethers";
import { decrypt } from "@/actions/wallet-keys"; // Assuming this decrypts private keys
import { db } from "@/lib/db";

const CONTRACT_ADDRESS = "0x3328358128832A260C76A4141e19E2A943CD4B6D";
const CONTRACT_ABI = [
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
				"name": "credits",
				"type": "uint256"
			}
		],
		"name": "CreditStored",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "kWh",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "cost",
				"type": "uint256"
			}
		],
		"name": "EnergyPurchased",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "energyPricePerKWh",
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
		"name": "getCredits",
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
		"name": "isSeller",
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
			},
			{
				"internalType": "uint256",
				"name": "credits",
				"type": "uint256"
			}
		],
		"name": "storeCredit",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"name": "userCredits",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export const storeCreditOnBlockchain = async (userId: string, credits: number) => {
  try {
    // Fetch user details from your database
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found in database");

    // Decrypt user's private key
    const privateKey = await decrypt(user.privateKey!);

    // Initialize ethers wallet
    const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/5PdkNmU-khw3HZ5uPlRZkVnD9SkG6Bo7"); // Replace with your provider
    const wallet = new ethers.Wallet(privateKey, provider);

    // Initialize contract
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    // Call storeCredit function
    const tx = await contract.storeCredit(user.publicKey, credits);
    console.log("Transaction sent:", tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);

    return receipt;
  } catch (error) {
    console.error("Error storing credits on the blockchain:", error);
    throw error;
  }
};
