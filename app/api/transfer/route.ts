import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import { verify } from "jsonwebtoken";

const prisma = new PrismaClient();

// Blockchain Configuration
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL); // Replace with your network
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CONTRACT_ABI = [
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
		"name": "CreditsAdded",
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
	}
]

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const cookies = req.cookies;
    const authCookie = cookies.get("Auth")?.value;

    // Check if authCookie is available
    if (!authCookie) {
        return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
        );
    }

    const secret = process.env.JWT_SECRET || "My-secret"; // Use a default secret for fallback

    // Decode the JWT token and extract user data
    const decoded = verify(authCookie, secret) as { userId: string; meterId: string; name: string; mobileNo: string };
    const { userId: receiverAddress } = decoded;

    const { senderId, amount } = await req.json();

    if (!senderId || !receiverAddress || !amount) {
      return new NextResponse("Invalid input data", { status: 400 });
    }

    // Fetch sender's public and private keys from the database
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });

    if (!sender) {
      return new NextResponse("Sender not found", { status: 404 });
    }

    const { privateKey } = sender;

    // Initialize sender's wallet
    const wallet = new ethers.Wallet(privateKey!, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS!, CONTRACT_ABI, wallet);

    // Perform the transfer
    const tx = await contract.transfer(receiverAddress, ethers.parseUnits(amount.toString(), 18)); // Assuming 18 decimals
    await tx.wait(); // Wait for the transaction to be confirmed

    // Update the sender's credits in the database
    // await prisma.user.update({
    //   where: { id: senderId },
    //   data: { credits: { decrement: amount } },
    // });

    // Return the transaction hash
    return NextResponse.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error processing transfer:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
