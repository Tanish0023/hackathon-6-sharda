import { db } from "@/lib/db";
import { ethers } from "ethers";

// Replace these with your contract details
const CONTRACT_ADDRESS = "0x3328358128832A260C76A4141e19E2A943CD4B6D"; // Replace with your deployed contract address
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

// Initialize a provider and contract instance
export const getContract = () => {
  // Connect to the Ethereum network (replace with your preferred provider, e.g., Infura or Alchemy)
  const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/5PdkNmU-khw3HZ5uPlRZkVnD9SkG6Bo7"); // Replace with your provider URL

  // Use a signer if you need to perform write operations
  const privateKey = "YOUR_PRIVATE_KEY"; // Backend-stored private key for signing transactions
  const wallet = new ethers.Wallet(privateKey, provider);

  // Initialize the contract instance
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

  return contract;
};

// Example: Read data from the contract
export const fetchContractData = async (
    userId: string
) => {
  try {
    const user = await db.user.findUnique({
        where:{
            id: userId
        }
    })

    const contract = getContract();
    const data = await contract.getCredit(user?.publicKey);
    console.log("Contract Data:", data);
    return data;
  } catch (error) {
    console.error("Error reading contract data:", error);
    throw error;
  }
};

// Example: Write data to the contract
export const sendTransactionToContract = async (value: number) => {
  try {
    const contract = getContract();
    const tx = await contract.someSetterMethod(value); // Replace with your contract's setter method
    console.log("Transaction Sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction Confirmed:", receipt);
    return receipt;
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
};
